"""Backend API tests for Crescent Wellness Centre CMS.

Covers: public content/blog/messages, auth login/me, admin CRUD (content, blog,
messages, stats), 401 without token, 429 brute-force lockout.
"""
import os
import time
import uuid
import requests
import pytest

BASE_URL = os.environ.get("API_BASE_URL", "http://localhost:8000").rstrip("/")

ADMIN_EMAIL = os.environ["TEST_ADMIN_EMAIL"]
ADMIN_PASSWORD = os.environ["TEST_ADMIN_PASSWORD"]


# ---------- fixtures ----------
@pytest.fixture(scope="session")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def admin_token(api):
    r = api.post(
        f"{BASE_URL}/api/auth/login",
        json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
    )
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    tok = r.json().get("token")
    assert tok
    return tok


@pytest.fixture
def auth_headers(admin_token):
    return {"Content-Type": "application/json", "Authorization": f"Bearer {admin_token}"}


# ---------- public ----------
class TestPublic:
    def test_root(self, api):
        r = api.get(f"{BASE_URL}/api/")
        assert r.status_code == 200

    def test_get_content(self, api):
        r = api.get(f"{BASE_URL}/api/content")
        assert r.status_code == 200
        data = r.json()
        # site content should contain brands or general/hero data
        assert isinstance(data, dict) and len(data) > 0

    def test_get_blog_list(self, api):
        r = api.get(f"{BASE_URL}/api/blog")
        assert r.status_code == 200
        posts = r.json()
        assert isinstance(posts, list)
        assert len(posts) >= 1
        p = posts[0]
        for k in ("slug", "title"):
            assert k in p

    def test_get_blog_by_slug(self, api):
        r = api.get(f"{BASE_URL}/api/blog")
        slug = r.json()[0]["slug"]
        r2 = api.get(f"{BASE_URL}/api/blog/{slug}")
        assert r2.status_code == 200
        assert r2.json()["slug"] == slug

    def test_get_blog_unknown_slug(self, api):
        r = api.get(f"{BASE_URL}/api/blog/definitely-not-a-real-slug-xyz")
        assert r.status_code == 404


# ---------- messages ----------
class TestMessages:
    def test_create_message_and_list(self, api, auth_headers):
        payload = {
            "name": "TEST_User",
            "contact": "test@example.com",
            "brand": "pharmasave",
            "message": "TEST message for pytest",
        }
        r = api.post(f"{BASE_URL}/api/messages", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["name"] == payload["name"]
        assert data["read"] is False
        assert isinstance(data["id"], str) and len(data["id"]) > 0
        msg_id = data["id"]

        # admin list contains it
        r2 = requests.get(f"{BASE_URL}/api/admin/messages", headers=auth_headers)
        assert r2.status_code == 200
        ids = [m["id"] for m in r2.json()]
        assert msg_id in ids

        # PATCH toggle read
        r3 = requests.patch(
            f"{BASE_URL}/api/admin/messages/{msg_id}",
            headers=auth_headers,
            json={"read": True},
        )
        assert r3.status_code == 200
        assert r3.json()["read"] is True

        # DELETE
        r4 = requests.delete(
            f"{BASE_URL}/api/admin/messages/{msg_id}", headers=auth_headers
        )
        assert r4.status_code in (200, 204)

    def test_create_message_validation(self, api):
        r = api.post(f"{BASE_URL}/api/messages", json={"name": "x"})
        assert r.status_code == 422


# ---------- auth ----------
class TestAuth:
    def test_login_success(self, api):
        r = api.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
        )
        assert r.status_code == 200
        data = r.json()
        assert "token" in data and "user" in data
        assert data["user"]["email"] == ADMIN_EMAIL

    def test_login_wrong_password(self, api):
        r = api.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": "wrongpass-xyz"},
        )
        assert r.status_code in (401, 429)

    def test_me_with_token(self, api, admin_token):
        r = requests.get(
            f"{BASE_URL}/api/auth/me",
            headers={"Authorization": f"Bearer {admin_token}"},
        )
        assert r.status_code == 200
        assert r.json()["email"] == ADMIN_EMAIL

    def test_me_without_token(self, api):
        r = requests.get(f"{BASE_URL}/api/auth/me")
        assert r.status_code == 401


# ---------- admin protection ----------
class TestAdminAuthGuards:
    def test_admin_content_requires_token(self):
        r = requests.put(f"{BASE_URL}/api/admin/content", json={"data": {}})
        assert r.status_code == 401

    def test_admin_blog_requires_token(self):
        r = requests.get(f"{BASE_URL}/api/admin/blog")
        assert r.status_code == 401

    def test_admin_messages_requires_token(self):
        r = requests.get(f"{BASE_URL}/api/admin/messages")
        assert r.status_code == 401

    def test_admin_stats_requires_token(self, auth_headers):
        r_no = requests.get(f"{BASE_URL}/api/admin/stats")
        assert r_no.status_code == 401
        r = requests.get(f"{BASE_URL}/api/admin/stats", headers=auth_headers)
        assert r.status_code == 200
        assert isinstance(r.json(), dict)


# ---------- content round-trip ----------
class TestContentRoundTrip:
    def test_content_update_reflected(self, api, auth_headers):
        # get current
        cur = api.get(f"{BASE_URL}/api/content").json()
        # make a small mutation on a top-level string field (or add sentinel)
        sentinel = f"TEST_SENTINEL_{uuid.uuid4().hex[:8]}"
        new_content = dict(cur) if isinstance(cur, dict) else {}
        new_content["_test_sentinel"] = sentinel

        # NOTE: PUT /api/admin/content accepts the content dict AS THE BODY
        # (not wrapped in {"data": ...}); wrapping corrupts the stored content.
        r = requests.put(
            f"{BASE_URL}/api/admin/content",
            headers=auth_headers,
            json=new_content,
        )
        assert r.status_code == 200, r.text

        after = api.get(f"{BASE_URL}/api/content").json()
        assert after.get("_test_sentinel") == sentinel

        # cleanup
        after.pop("_test_sentinel", None)
        requests.put(
            f"{BASE_URL}/api/admin/content",
            headers=auth_headers,
            json=after,
        )


# ---------- blog CRUD ----------
class TestBlogCRUD:
    def test_blog_create_update_delete(self, api, auth_headers):
        slug = f"test-post-{uuid.uuid4().hex[:8]}"
        payload = {
            "slug": slug,
            "title": "TEST Post Title",
            "excerpt": "TEST excerpt",
            "tag": "Test",
            "cover": "https://example.com/img.jpg",
            "author": "TEST",
            "readTime": "1 min",
            "published": True,
            "content": [{"type": "paragraph", "text": "hello"}],
        }
        r = requests.post(
            f"{BASE_URL}/api/admin/blog", headers=auth_headers, json=payload
        )
        assert r.status_code in (200, 201), r.text
        created = r.json()
        post_id = created.get("id") or created.get("slug")
        assert post_id

        # appears in public /api/blog (published)
        pub = api.get(f"{BASE_URL}/api/blog").json()
        assert any(p["slug"] == slug for p in pub)

        # update
        upd = requests.put(
            f"{BASE_URL}/api/admin/blog/{post_id}",
            headers=auth_headers,
            json={**payload, "title": "TEST Post Title UPDATED"},
        )
        assert upd.status_code == 200
        assert upd.json()["title"] == "TEST Post Title UPDATED"

        # verify persistence via public GET by slug
        got = api.get(f"{BASE_URL}/api/blog/{slug}")
        assert got.status_code == 200
        assert got.json()["title"] == "TEST Post Title UPDATED"

        # delete
        d = requests.delete(
            f"{BASE_URL}/api/admin/blog/{post_id}", headers=auth_headers
        )
        assert d.status_code in (200, 204)

        # no longer public
        gone = api.get(f"{BASE_URL}/api/blog/{slug}")
        assert gone.status_code == 404


# ---------- brute force lockout ----------
class TestBruteForceLockout:
    def test_repeated_wrong_password_locks_out(self, api):
        # Backend enforces in-memory lockout (5/15min) keyed by IP+email.
        # Under load-balanced / multi-worker deployments the counter may be
        # sharded per worker, so we allow up to 25 attempts to see a 429.
        bad_email = f"bfattacker-{uuid.uuid4().hex[:6]}@example.com"
        codes = []
        got_429 = False
        for _ in range(25):
            r = api.post(
                f"{BASE_URL}/api/auth/login",
                json={"email": bad_email, "password": "wrong"},
            )
            codes.append(r.status_code)
            if r.status_code == 429:
                got_429 = True
                break
        assert got_429, f"expected 429 lockout within 25 attempts, saw {codes}"

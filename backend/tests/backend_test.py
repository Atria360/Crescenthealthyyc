"""Backend API tests for Healthcare Hub messages endpoints."""
import os
import requests
import pytest

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL")
if not BASE_URL:
    # fallback: read from frontend .env
    with open("/app/frontend/.env") as f:
        for line in f:
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.split("=", 1)[1].strip()
                break
BASE_URL = BASE_URL.rstrip("/")


@pytest.fixture
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


def test_root(api):
    r = api.get(f"{BASE_URL}/api/")
    assert r.status_code == 200
    assert r.json().get("message") == "Healthcare Hub API"


def test_create_message_and_persistence(api):
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
    assert data["contact"] == payload["contact"]
    assert data["brand"] == payload["brand"]
    assert data["message"] == payload["message"]
    assert data["read"] is False
    assert isinstance(data["id"], str) and len(data["id"]) > 0
    assert isinstance(data["created_at"], str) and "T" in data["created_at"]

    # GET verify
    r2 = api.get(f"{BASE_URL}/api/messages")
    assert r2.status_code == 200
    arr = r2.json()
    assert isinstance(arr, list)
    ids = [m["id"] for m in arr]
    assert data["id"] in ids
    # newest first
    if len(arr) > 1:
        assert arr[0]["created_at"] >= arr[-1]["created_at"]


def test_create_message_validation(api):
    # missing fields -> 422
    r = api.post(f"{BASE_URL}/api/messages", json={"name": "x"})
    assert r.status_code == 422

import os
from pathlib import Path
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import logging
from typing import Optional
from fastapi import FastAPI, APIRouter, Depends, HTTPException, Request, Body
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import select, func

from database import AsyncSessionLocal, get_db
from models import AdminUser, SiteContent, BlogPost, Message
from auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_admin,
    register_attempt,
    is_locked,
    clear_attempts,
)
from seed_data import DEFAULT_CONTENT, DEFAULT_POSTS

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI(title="Crescent Wellness Centre API")
api_router = APIRouter(prefix="/api")


# ---------- Schemas ----------
class LoginInput(BaseModel):
    email: str
    password: str


class MessageCreate(BaseModel):
    name: str
    contact: str
    brand: str
    message: str


class BlogInput(BaseModel):
    slug: str = ""
    title: str
    excerpt: str = ""
    cover: str = ""
    date: str = ""
    readTime: str = ""
    author: str = ""
    tag: str = ""
    accent: str = "#1B4F9C"
    content: list = []
    published: bool = True
    sortOrder: int = 0


class MessagePatch(BaseModel):
    read: bool


# ---------- Serializers ----------
def blog_to_public(p: BlogPost) -> dict:
    return {
        "id": p.id,
        "slug": p.slug,
        "title": p.title,
        "excerpt": p.excerpt,
        "cover": p.cover,
        "date": p.date,
        "readTime": p.read_time,
        "author": p.author,
        "tag": p.tag,
        "accent": p.accent,
        "content": p.content or [],
        "published": p.published,
        "sortOrder": p.sort_order,
    }


def msg_to_dict(m: Message) -> dict:
    return {
        "id": m.id,
        "name": m.name,
        "contact": m.contact,
        "brand": m.brand,
        "message": m.message,
        "read": m.read,
        "created_at": m.created_at.isoformat() if m.created_at else None,
    }


def admin_to_dict(u: AdminUser) -> dict:
    return {"id": u.id, "email": u.email, "name": u.name, "role": u.role}


def _slugify(text: str) -> str:
    import re
    s = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return s or "post"


# ---------- Public ----------
@api_router.get("/")
async def root():
    return {"message": "Crescent Wellness Centre API"}


@api_router.get("/content")
async def get_content(db=Depends(get_db)):
    result = await db.execute(select(SiteContent).where(SiteContent.key == "main"))
    sc = result.scalar_one_or_none()
    return sc.data if sc else DEFAULT_CONTENT


@api_router.get("/blog")
async def list_blog(db=Depends(get_db)):
    result = await db.execute(
        select(BlogPost).where(BlogPost.published == True).order_by(BlogPost.sort_order.asc(), BlogPost.date.desc())
    )
    return [blog_to_public(p) for p in result.scalars().all()]


@api_router.get("/blog/{slug}")
async def get_blog(slug: str, db=Depends(get_db)):
    result = await db.execute(select(BlogPost).where(BlogPost.slug == slug))
    p = result.scalar_one_or_none()
    if not p or not p.published:
        raise HTTPException(status_code=404, detail="Post not found")
    return blog_to_public(p)


@api_router.post("/messages")
async def create_message(payload: MessageCreate, db=Depends(get_db)):
    msg = Message(**payload.model_dump())
    db.add(msg)
    await db.commit()
    await db.refresh(msg)
    return msg_to_dict(msg)


# ---------- Auth ----------
@api_router.post("/auth/login")
async def login(payload: LoginInput, request: Request, db=Depends(get_db)):
    email = payload.email.strip().lower()
    ip = request.client.host if request.client else "unknown"
    identifier = f"{ip}:{email}"

    if is_locked(identifier):
        raise HTTPException(status_code=429, detail="Too many attempts. Try again in 15 minutes.")

    result = await db.execute(select(AdminUser).where(AdminUser.email == email))
    user = result.scalar_one_or_none()
    if not user or not verify_password(payload.password, user.password_hash):
        register_attempt(identifier)
        raise HTTPException(status_code=401, detail="Invalid email or password")

    clear_attempts(identifier)
    token = create_access_token(user.id, user.email)
    return {"token": token, "user": admin_to_dict(user)}


@api_router.get("/auth/me")
async def me(admin: AdminUser = Depends(get_current_admin)):
    return admin_to_dict(admin)


# ---------- Admin: content ----------
@api_router.put("/admin/content")
async def update_content(
    data: dict = Body(...), admin: AdminUser = Depends(get_current_admin), db=Depends(get_db)
):
    result = await db.execute(select(SiteContent).where(SiteContent.key == "main"))
    sc = result.scalar_one_or_none()
    if sc:
        sc.data = data
    else:
        sc = SiteContent(key="main", data=data)
        db.add(sc)
    await db.commit()
    return {"ok": True, "data": data}


# ---------- Admin: blog ----------
@api_router.get("/admin/blog")
async def admin_list_blog(admin: AdminUser = Depends(get_current_admin), db=Depends(get_db)):
    result = await db.execute(
        select(BlogPost).order_by(BlogPost.sort_order.asc(), BlogPost.date.desc())
    )
    return [blog_to_public(p) for p in result.scalars().all()]


@api_router.post("/admin/blog")
async def admin_create_blog(
    payload: BlogInput, admin: AdminUser = Depends(get_current_admin), db=Depends(get_db)
):
    slug = payload.slug.strip() or _slugify(payload.title)
    existing = await db.execute(select(BlogPost).where(BlogPost.slug == slug))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="A post with this slug already exists")
    p = BlogPost(
        slug=slug,
        title=payload.title,
        excerpt=payload.excerpt,
        cover=payload.cover,
        date=payload.date,
        read_time=payload.readTime,
        author=payload.author,
        tag=payload.tag,
        accent=payload.accent,
        content=payload.content,
        published=payload.published,
        sort_order=payload.sortOrder,
    )
    db.add(p)
    await db.commit()
    await db.refresh(p)
    return blog_to_public(p)


@api_router.put("/admin/blog/{post_id}")
async def admin_update_blog(
    post_id: str, payload: BlogInput, admin: AdminUser = Depends(get_current_admin), db=Depends(get_db)
):
    result = await db.execute(select(BlogPost).where(BlogPost.id == post_id))
    p = result.scalar_one_or_none()
    if not p:
        raise HTTPException(status_code=404, detail="Post not found")
    new_slug = payload.slug.strip() or _slugify(payload.title)
    if new_slug != p.slug:
        dup = await db.execute(select(BlogPost).where(BlogPost.slug == new_slug, BlogPost.id != post_id))
        if dup.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="A post with this slug already exists")
    p.slug = new_slug
    p.title = payload.title
    p.excerpt = payload.excerpt
    p.cover = payload.cover
    p.date = payload.date
    p.read_time = payload.readTime
    p.author = payload.author
    p.tag = payload.tag
    p.accent = payload.accent
    p.content = payload.content
    p.published = payload.published
    p.sort_order = payload.sortOrder
    await db.commit()
    await db.refresh(p)
    return blog_to_public(p)


@api_router.delete("/admin/blog/{post_id}")
async def admin_delete_blog(post_id: str, admin: AdminUser = Depends(get_current_admin), db=Depends(get_db)):
    result = await db.execute(select(BlogPost).where(BlogPost.id == post_id))
    p = result.scalar_one_or_none()
    if not p:
        raise HTTPException(status_code=404, detail="Post not found")
    await db.delete(p)
    await db.commit()
    return {"ok": True}


# ---------- Admin: messages ----------
@api_router.get("/admin/messages")
async def admin_list_messages(admin: AdminUser = Depends(get_current_admin), db=Depends(get_db)):
    result = await db.execute(select(Message).order_by(Message.created_at.desc()))
    return [msg_to_dict(m) for m in result.scalars().all()]


@api_router.patch("/admin/messages/{message_id}")
async def admin_patch_message(
    message_id: str, payload: MessagePatch, admin: AdminUser = Depends(get_current_admin), db=Depends(get_db)
):
    result = await db.execute(select(Message).where(Message.id == message_id))
    m = result.scalar_one_or_none()
    if not m:
        raise HTTPException(status_code=404, detail="Message not found")
    m.read = payload.read
    await db.commit()
    await db.refresh(m)
    return msg_to_dict(m)


@api_router.delete("/admin/messages/{message_id}")
async def admin_delete_message(message_id: str, admin: AdminUser = Depends(get_current_admin), db=Depends(get_db)):
    result = await db.execute(select(Message).where(Message.id == message_id))
    m = result.scalar_one_or_none()
    if not m:
        raise HTTPException(status_code=404, detail="Message not found")
    await db.delete(m)
    await db.commit()
    return {"ok": True}


@api_router.get("/admin/stats")
async def admin_stats(admin: AdminUser = Depends(get_current_admin), db=Depends(get_db)):
    total = await db.scalar(select(func.count()).select_from(Message))
    unread = await db.scalar(select(func.count()).select_from(Message).where(Message.read == False))
    posts = await db.scalar(select(func.count()).select_from(BlogPost))
    return {"messages": total or 0, "unread": unread or 0, "posts": posts or 0}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- Startup seeding ----------
async def seed():
    async with AsyncSessionLocal() as db:
        # admin
        admin_email = os.environ["ADMIN_EMAIL"].strip().lower()
        admin_password = os.environ["ADMIN_PASSWORD"]
        result = await db.execute(select(AdminUser).where(AdminUser.email == admin_email))
        existing = result.scalar_one_or_none()
        if existing is None:
            db.add(AdminUser(email=admin_email, password_hash=hash_password(admin_password), name="Admin", role="admin"))
            logger.info("Seeded admin user %s", admin_email)
        elif not verify_password(admin_password, existing.password_hash):
            existing.password_hash = hash_password(admin_password)
            logger.info("Updated admin password for %s", admin_email)

        # site content
        result = await db.execute(select(SiteContent).where(SiteContent.key == "main"))
        if result.scalar_one_or_none() is None:
            db.add(SiteContent(key="main", data=DEFAULT_CONTENT))
            logger.info("Seeded site content")

        # blog posts
        count = await db.scalar(select(func.count()).select_from(BlogPost))
        if not count:
            for post in DEFAULT_POSTS:
                db.add(BlogPost(
                    slug=post["slug"], title=post["title"], excerpt=post["excerpt"],
                    cover=post["cover"], date=post["date"], read_time=post["read_time"],
                    author=post["author"], tag=post["tag"], accent=post["accent"],
                    content=post["content"], published=True, sort_order=post["sort_order"],
                ))
            logger.info("Seeded %d blog posts", len(DEFAULT_POSTS))

        await db.commit()


@app.on_event("startup")
async def on_startup():
    try:
        await seed()
    except Exception as e:
        logger.error("Seeding failed: %s", e)

import os
import time
import jwt
import bcrypt
from datetime import datetime, timezone, timedelta
from fastapi import Request, HTTPException, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models import AdminUser

JWT_ALGORITHM = "HS256"
ACCESS_TTL_HOURS = 12

# Simple in-memory brute-force throttle (single-instance CMS)
_MAX_ATTEMPTS = 5
_LOCKOUT_SECONDS = 900
_attempts: dict[str, list[float]] = {}


def _truncate(password: str) -> bytes:
    # bcrypt only uses the first 72 bytes
    return password.encode("utf-8")[:72]


def hash_password(password: str) -> str:
    return bcrypt.hashpw(_truncate(password), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(_truncate(plain), hashed.encode("utf-8"))
    except ValueError:
        return False


def _get_secret() -> str:
    return os.environ["JWT_SECRET"]


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "type": "access",
        "exp": datetime.now(timezone.utc) + timedelta(hours=ACCESS_TTL_HOURS),
    }
    return jwt.encode(payload, _get_secret(), algorithm=JWT_ALGORITHM)


def register_attempt(identifier: str) -> None:
    now = time.time()
    arr = [t for t in _attempts.get(identifier, []) if now - t < _LOCKOUT_SECONDS]
    arr.append(now)
    _attempts[identifier] = arr


def is_locked(identifier: str) -> bool:
    now = time.time()
    arr = [t for t in _attempts.get(identifier, []) if now - t < _LOCKOUT_SECONDS]
    _attempts[identifier] = arr
    return len(arr) >= _MAX_ATTEMPTS


def clear_attempts(identifier: str) -> None:
    _attempts.pop(identifier, None)


async def get_current_admin(
    request: Request, db: AsyncSession = Depends(get_db)
) -> AdminUser:
    auth_header = request.headers.get("Authorization", "")
    token = auth_header[7:] if auth_header.startswith("Bearer ") else None
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, _get_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

    result = await db.execute(select(AdminUser).where(AdminUser.id == payload["sub"]))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

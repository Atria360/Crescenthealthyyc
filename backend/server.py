from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection (interim store — will migrate to Supabase in the CMS phase)
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="Healthcare Hub API")
api_router = APIRouter(prefix="/api")


class MessageCreate(BaseModel):
    name: str
    contact: str
    brand: str
    message: str


class Message(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    contact: str
    brand: str
    message: str
    read: bool = False
    created_at: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )


@api_router.get("/")
async def root():
    return {"message": "Healthcare Hub API"}


@api_router.post("/messages", response_model=Message)
async def create_message(payload: MessageCreate):
    msg = Message(**payload.model_dump())
    await db.messages.insert_one(msg.model_dump())
    return msg


@api_router.get("/messages", response_model=List[Message])
async def list_messages():
    docs = await db.messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return docs


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

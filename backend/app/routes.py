"""
EcoBuddy AI API Routes Module
Defines FastAPI endpoints for chat interaction and health checks.
"""

from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException, UploadFile, File, Form, status
from pydantic import BaseModel, Field
import json
from app.gemini import gemini_service

router = APIRouter()

class MessageItem(BaseModel):
    sender: str = Field(..., description="Either 'user' or 'assistant'")
    text: str = Field(..., description="Message text content")

class ChatRequest(BaseModel):
    message: str = Field(..., description="Current user input text")
    history: Optional[List[MessageItem]] = Field(default=[], description="Past chat conversation history")
    image_base64: Optional[str] = Field(default=None, description="Optional base64 image data")
    mime_type: Optional[str] = Field(default=None, description="Optional image MIME type")

class ChatResponse(BaseModel):
    reply: str = Field(..., description="EcoBuddy AI generated response")
    status: str = Field(default="success")

@router.get("/health")
async def health_check():
    """Health status endpoint."""
    return {"status": "ok", "service": "EcoBuddy AI FastAPI Backend"}

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Primary chat endpoint for EcoBuddy AI assistant.
    Receives user message and optional history to return Gemini-generated response.
    """
    if not request.message and not request.image_base64:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message or image is required."
        )

    try:
        # Convert Pydantic history objects to standard dict list
        formatted_history = [
            {"sender": item.sender, "text": item.text} for item in (request.history or [])
        ]

        # Handle optional base64 image if passed in payload
        image_bytes = None
        if request.image_base64:
            import base64
            # Strip data URL prefix if present (e.g. data:image/png;base64,...)
            clean_b64 = request.image_base64
            if "," in clean_b64:
                clean_b64 = clean_b64.split(",")[1]
            image_bytes = base64.b64decode(clean_b64)

        response_text = gemini_service.generate_eco_response(
            user_message=request.message,
            conversation_history=formatted_history,
            image_bytes=image_bytes,
            mime_type=request.mime_type or "image/jpeg"
        )

        return ChatResponse(reply=response_text, status="success")

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"EcoBuddy AI Service Error: {str(e)}"
        )

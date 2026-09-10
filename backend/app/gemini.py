"""
EcoBuddy AI Gemini Service Module
Handles communication with the Google Gemini API using the official google-genai SDK.
"""

import os
from typing import List, Dict, Optional, Any
from google import genai
from google.genai import types
from app.config import settings
from app.prompts import ECOBUDDY_SYSTEM_PROMPT

class GeminiService:
    def __init__(self):
        api_key = settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY", "")
        if api_key:
            self.client = genai.Client(
                api_key=api_key,
                http_options={'headers': {'User-Agent': 'aistudio-build'}}
            )
        else:
            self.client = None

    def generate_eco_response(
        self,
        user_message: str,
        conversation_history: Optional[List[Dict[str, str]]] = None,
        image_bytes: Optional[bytes] = None,
        mime_type: Optional[str] = None
    ) -> str:
        """
        Generates an AI response from Gemini 3.6 Flash model.
        """
        api_key = settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY", "")
        if not self.client and api_key:
            self.client = genai.Client(
                api_key=api_key,
                http_options={'headers': {'User-Agent': 'aistudio-build'}}
            )

        if not self.client:
            raise ValueError("GEMINI_API_KEY is not set. Please set the environment variable in .env")

        contents = []

        # Add relevant conversation history if available
        if conversation_history:
            for msg in conversation_history:
                role = "user" if msg.get("sender") == "user" else "model"
                contents.append(
                    types.Content(
                        role=role,
                        parts=[types.Part.from_text(text=msg.get("text", ""))]
                    )
                )

        # Add image if provided
        parts = []
        if image_bytes and mime_type:
            parts.append(
                types.Part.from_bytes(
                    data=image_bytes,
                    mime_type=mime_type
                )
            )

        parts.append(types.Part.from_text(text=user_message))
        contents.append(types.Content(role="user", parts=parts))

        config = types.GenerateContentConfig(
            system_instruction=ECOBUDDY_SYSTEM_PROMPT,
            temperature=0.7,
            top_p=0.95,
        )

        response = self.client.models.generate_content(
            model="gemini-3.6-flash",
            contents=contents,
            config=config,
        )

        return response.text or "I couldn't process that request right now. Please try again."

gemini_service = GeminiService()

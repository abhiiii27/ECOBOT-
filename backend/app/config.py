import os
from dotenv import load_dotenv

# Load environment variables from .env file if available
load_dotenv()

class Settings:
    PROJECT_NAME: str = "EcoBuddy AI Backend"
    VERSION: str = "1.0.0"
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    CORS_ORIGINS: list = ["*"]

settings = Settings()

# EcoBuddy AI 🌿

**EcoBuddy AI** is an intelligent, full-stack AI-powered environmental assistant built to help users learn about waste segregation, recycling, composting, plastic reduction, water conservation, and eco-friendly practices through natural language conversations and visual image analysis.

EcoBuddy AI is designed as a modular, production-ready microservice ready for future integration into the broader **EcoSort** waste management platform.

---

## 🚀 Key Features

- **Waste Segregation Assistant**: Classifies items into 5 core bins:
  - 🔵 **Dry / Recyclables** (Clean paper, cardboard, PET/HDPE/PP plastics, metals, glass)
  - 🟢 **Wet / Organic** (Kitchen food scraps, coffee grounds, garden trimmings)
  - 🔴 **Domestic Hazardous** (Batteries, bulbs, paints, expired medicines)
  - 🖤 **E-Waste** (Old phones, cables, chargers, electronics)
  - ⚪ **Residual / Non-Recyclable** (Diapers, styrofoam, contaminated laminates)
- **Visual Waste Image Analyzer**: Upload or capture photos of waste items to ask EcoBuddy how to clean, recycle, or dispose of them properly.
- **Interactive Bin Guide Cheatsheet**: Instant visual modal reference for waste sorting categories and tips.
- **Text-To-Speech Output**: Read EcoBuddy answers aloud with browser speech synthesis.
- **Starter Prompts & Quick Chips**: One-click prompt triggers for common eco questions.
- **Dark & Light Theme**: Toggleable UI mode with persistent user preferences.
- **Location Variance Disclaimer**: Automatically reminds users that local municipal waste rules may vary.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS v4
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Animations**: CSS Keyframes & Motion

### Backend (Python FastAPI)
- **Framework**: FastAPI (Python 3.10+)
- **Server**: Uvicorn
- **AI Model**: Google Gemini API (`gemini-3.6-flash` via `google-genai` SDK)
- **Config**: `python-dotenv`, `pydantic`

### Express Server (Live Dev Container)
- **Runtime**: Node.js Express + `@google/genai` on Port 3000

---

## 📁 Folder Structure

```text
EcoBuddy-AI/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── ChatMessage.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   ├── StarterPrompts.tsx
│   │   │   ├── BinGuideModal.tsx
│   │   │   └── LoadingIndicator.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routes.py
│   │   ├── gemini.py
│   │   ├── prompts.py
│   │   └── config.py
│   ├── requirements.txt
│   └── .env.example
│
├── server.ts
├── metadata.json
├── package.json
└── README.md
```

---

## ⚙️ Setup & Installation Instructions

### Option 1: Running the Live Node.js / Express Container (Full Stack)

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env` file or ensure your secret is exported:
   ```env
   GEMINI_API_KEY="your_google_gemini_api_key_here"
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   The application will start on `http://localhost:3000`.

---

### Option 2: Running Standalone Python FastAPI Backend

1. **Navigate to the Backend directory**:
   ```bash
   cd backend
   ```

2. **Create and Activate a Virtual Environment**:
   ```bash
   python -m venv venv
   # On macOS/Linux:
   source venv/bin/activate
   # On Windows:
   venv\Scripts\activate
   ```

3. **Install Requirements**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set Up Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API Key in `.env`:
   ```env
   GEMINI_API_KEY="your_gemini_api_key_here"
   PORT=8000
   HOST="0.0.0.0"
   ```

5. **Run the FastAPI Server**:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   Interactive API docs (Swagger) will be available at: `http://localhost:8000/docs`.

---

## 🔌 API Endpoints

### `POST /api/chat`
Sends a user message and optional base64 image to EcoBuddy AI.

**Request Payload:**
```json
{
  "message": "Is a greasy cardboard pizza box recyclable?",
  "history": [
    { "sender": "user", "text": "Hi EcoBuddy!" },
    { "sender": "assistant", "text": "Hello! How can I help you live greener?" }
  ],
  "image_base64": "data:image/jpeg;base64,...",
  "mime_type": "image/jpeg"
}
```

**Response Payload:**
```json
{
  "reply": "Greasy pizza boxes with heavy food oil stains are **non-recyclable** as dry paper...",
  "status": "success"
}
```

### `GET /api/health`
Health check endpoint returning server status.

---

## 🌐 EcoSort Platform Integration Roadmap

EcoBuddy AI is built to plug directly into the **EcoSort** waste management ecosystem:
1. **IoT Smart Bin Sync**: Receive telemetry from smart bins and alert users when local bin capacity is reached.
2. **Citizen Reward Points**: Award green points to users who query and verify correct waste segregation habits.
3. **Municipal API Integration**: Connect to local city waste collection schedules to provide precise pick-up dates based on user geolocation.

---

## 📄 License
Apache-2.0 License - Open Source for Sustainable Communities.

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ECOBUDDY_SYSTEM_PROMPT = `
You are EcoBuddy AI, an intelligent, enthusiastic, and highly knowledgeable environmental assistant created to guide users on sustainability, waste segregation, recycling, composting, plastic reduction, and green living.

### Your Core Directives & Expertise:
1. **Waste Segregation**: Clear categorization of waste into 5 key categories:
   - 🔵 **Dry / Recyclables**: Clean paper, cardboard, rigid plastics (#1 PET, #2 HDPE, #5 PP), metals (aluminum/tin cans), glass bottles.
   - 🟢 **Wet / Organic**: Food scraps, fruit peels, coffee grounds, garden clippings, soiled unbleached paper (compostable).
   - 🔴 **Domestic Hazardous**: Batteries, light bulbs, paint cans, expired medicines, chemicals, cleaning products.
   - 🖤 **E-Waste**: Old phones, chargers, broken electronics, circuit boards, cables.
   - ⚪ **Residual / Non-Recyclable**: Diapers, sanitary waste, styrofoam, film plastic wrappers, multi-layer laminates.

2. **Practical Eco Actions**: Offer actionable, realistic steps (e.g., "Rinse yogurt containers before recycling", "Layer carbon-rich brown material with nitrogen-rich green material in your compost").

3. **Recycling Symbol Identification**: Explain resin codes (#1 to #7 plastics) and clarify what can usually be accepted.

4. **Tone & Style**:
   - Enthusiastic, friendly, encouraging, and clear.
   - Use bullet points, bold text, and relevant emojis for high readability.
   - Keep responses practical and educational without overwhelming jargon.
   - Whenever discussing specific waste disposal, mention: *"Note: Local municipal recycling guidelines can vary by region. Check your local council rules when in doubt."*

When an image of an item is provided, analyze the item and state its material, recommended waste category, disposal steps, and upcycling/reuse possibilities if applicable.
`;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Initialize Gemini Client lazily inside handler or globally if key exists
  const getGenAIClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "EcoBuddy AI Express Server" });
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history = [], imageBase64, mimeType = "image/jpeg" } = req.body;

      if (!message && !imageBase64) {
        return res.status(400).json({ error: "Message or image is required." });
      }

      const ai = getGenAIClient();

      const contents: any[] = [];

      // Add conversation history
      if (Array.isArray(history) && history.length > 0) {
        for (const item of history) {
          const role = item.sender === "user" ? "user" : "model";
          if (item.text) {
            contents.push({
              role,
              parts: [{ text: item.text }],
            });
          }
        }
      }

      // Prepare current turn parts
      const currentParts: any[] = [];

      if (imageBase64) {
        let cleanB64 = imageBase64;
        if (cleanB64.includes(",")) {
          cleanB64 = cleanB64.split(",")[1];
        }
        currentParts.push({
          inlineData: {
            mimeType,
            data: cleanB64,
          },
        });
      }

      if (message) {
        currentParts.push({ text: message });
      }

      contents.push({
        role: "user",
        parts: currentParts,
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents,
        config: {
          systemInstruction: ECOBUDDY_SYSTEM_PROMPT,
          temperature: 0.7,
        },
      });

      const replyText = response.text || "I couldn't process that response right now. Please try again!";

      return res.json({ reply: replyText, status: "success" });
    } catch (error: any) {
      console.error("EcoBuddy AI Error:", error);
      return res.status(500).json({
        error: error.message || "Failed to generate AI response.",
      });
    }
  });

  // Vite Dev / Static Production Middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EcoBuddy AI server listening at http://0.0.0.0:${PORT}`);
  });
}

startServer();

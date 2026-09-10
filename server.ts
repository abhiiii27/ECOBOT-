import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { getEcoKnowledgeResponse } from "./src/services/ecoKnowledge";

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

function getApiKey(): string | undefined {
  return (
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_GENAI_API_KEY ||
    process.env.API_KEY ||
    process.env.GOOGLE_API_KEY
  );
}

function getGenAIClient(): GoogleGenAI | null {
  const apiKey = getApiKey();
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

async function callWithTimeout<T>(promise: Promise<T>, ms: number, errorMsg: string): Promise<T> {
  let timer: any;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(errorMsg)), ms);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(timer);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json({ limit: "10mb" }));

  // CORS middleware for production deployment
  app.use((_req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (_req.method === "OPTIONS") {
      return res.sendStatus(204);
    }
    next();
  });

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    const hasKey = Boolean(getApiKey());
    res.json({
      status: "ok",
      service: "EcoBuddy AI Express Server",
      geminiConfigured: hasKey,
      model: "gemini-3.8-flash",
    });
  });

  // Chat API endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history = [], imageBase64, mimeType = "image/jpeg" } = req.body || {};

      if (!message && !imageBase64) {
        return res.status(400).json({ error: "Message or image is required." });
      }

      const ai = getGenAIClient();

      // If no Gemini API key is configured in the environment, use built-in knowledge engine
      if (!ai) {
        console.warn("[EcoBuddy Server] GEMINI_API_KEY not found in environment. Serving response via Knowledge Engine fallback.");
        const fallback = getEcoKnowledgeResponse(message || "", Boolean(imageBase64));
        return res.json({
          reply: fallback.reply,
          status: "success",
          source: "knowledge_fallback",
        });
      }

      // Sanitize and build conversation contents for Gemini API
      // Ensures strict alternation of roles (user -> model -> user) and merges consecutive turns
      const contents: any[] = [];
      let lastRole: "user" | "model" | null = null;

      if (Array.isArray(history) && history.length > 0) {
        for (const item of history) {
          const role = item.sender === "user" ? "user" : "model";
          if (!item.text || !item.text.trim()) continue;

          if (role === lastRole && contents.length > 0) {
            // Append text to previous turn of the same role
            const lastTurn = contents[contents.length - 1];
            const textPart = lastTurn.parts.find((p: any) => typeof p.text === "string");
            if (textPart) {
              textPart.text += `\n\n${item.text}`;
            } else {
              lastTurn.parts.push({ text: item.text });
            }
          } else {
            contents.push({
              role,
              parts: [{ text: item.text }],
            });
            lastRole = role;
          }
        }
      }

      // Format current user turn
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

      // If the last turn in history was already 'user', merge the current parts into it to prevent duplicate user turns
      if (lastRole === "user" && contents.length > 0) {
        contents[contents.length - 1].parts.push(...currentParts);
      } else {
        contents.push({
          role: "user",
          parts: currentParts,
        });
      }

      // Attempt generation with primary model (gemini-3.8-flash) with 12s timeout
      let replyText = "";
      try {
        const response = await callWithTimeout(
          ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents,
            config: {
              systemInstruction: ECOBUDDY_SYSTEM_PROMPT,
              temperature: 0.7,
            },
          }),
          12000,
          "Primary model gemini-3.8-flash timed out"
        );
        replyText = response.text || "";
      } catch (primaryModelError: any) {
        console.warn("[EcoBuddy Server] gemini-3.8-flash call failed, trying gemini-flash-latest:", primaryModelError.message);
        try {
          const fallbackResponse = await callWithTimeout(
            ai.models.generateContent({
              model: "gemini-flash-latest",
              contents,
              config: {
                systemInstruction: ECOBUDDY_SYSTEM_PROMPT,
                temperature: 0.7,
              },
            }),
            10000,
            "Fallback model gemini-flash-latest timed out"
          );
          replyText = fallbackResponse.text || "";
        } catch (secondaryModelError: any) {
          console.error("[EcoBuddy Server] All Gemini models failed or timed out:", secondaryModelError.message);
          // Fall back to built-in knowledge engine
          const fallback = getEcoKnowledgeResponse(message || "", Boolean(imageBase64));
          return res.json({
            reply: fallback.reply,
            status: "success",
            source: "knowledge_fallback",
          });
        }
      }

      if (!replyText) {
        const fallback = getEcoKnowledgeResponse(message || "", Boolean(imageBase64));
        return res.json({
          reply: fallback.reply,
          status: "success",
          source: "knowledge_fallback",
        });
      }

      return res.json({ reply: replyText, status: "success", source: "gemini" });
    } catch (error: any) {
      console.error("[EcoBuddy AI Server Error]:", error);
      // Even in catch block, provide knowledge base response rather than a hard failure
      const fallback = getEcoKnowledgeResponse(req.body?.message || "", Boolean(req.body?.imageBase64));
      return res.json({
        reply: fallback.reply,
        status: "success",
        source: "knowledge_fallback",
      });
    }
  });

  // Static / Vite middleware
  const distPath = path.join(process.cwd(), "dist");
  const hasDist = fs.existsSync(path.join(distPath, "index.html"));

  if (process.env.NODE_ENV !== "development" && hasDist) {
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[EcoBuddy AI] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

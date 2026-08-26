import { GoogleGenAI } from "@google/genai";
import { ENV } from "../../../config/env.js";

const apiKey = ENV.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined");
}

const ai = new GoogleGenAI({
  apiKey,
});

export async function generateWithGemini(
  systemInstruction: string,
  userMessage: string
) {
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: userMessage,
    config: {
      systemInstruction,
      temperature: 0.2,
    },
  });

  return response.text;
}
import { GoogleGenAI } from "@google/genai";
import { ENV } from "../../../config/env.js";

const ai = new GoogleGenAI({
  apiKey: ENV.GEMINI_API_KEY,
});

export async function generateWithGemini(
  systemInstruction: string,
  message: string
): Promise<string> {
  console.log("[Gemini]: Starting generation...");

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: message,
    config: {
      systemInstruction,
      temperature: 0.2,
    },
  });

  const text = response.text ?? "";

  console.log(
    `[Gemini]: Generation completed (${text.length} characters).`
  );

  return text;
}

export async function* streamWithGemini(
  systemInstruction: string,
  message: string
): AsyncGenerator<string> {
  console.log("[Gemini]: Starting streaming generation...");

  const response = await ai.models.generateContentStream({
    model: "gemini-3.5-flash",
    contents: message,
    config: {
      systemInstruction,
      temperature: 0.7,
    },
  });

  for await (const chunk of response) {
    const text = chunk.text ?? "";

    if (!text) {
      continue;
    }

    console.log(
      `[Gemini]: Streaming chunk (${text.length} characters)`
    );

    yield text;
  }

  console.log("[Gemini]: Streaming completed.");
}
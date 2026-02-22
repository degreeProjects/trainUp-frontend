import { GoogleGenAI } from "@google/genai";
import { config } from "../config";

const ai = new GoogleGenAI({
  apiKey: config.geminiApiKey,
});

export async function calculateCaloriesBurn(
  trainingType: string,
  trainingLength: number,
  height: number,
  weight: number,
  age: number
) {
  // Keep the prompt short and consistent so the response is easy to display:
  // a simple calorie range only (no extra text to parse).
  const contents = `User Profile: ${height}cm, ${weight}kg, ${age} years old.
Activity: ${trainingType} for ${trainingLength} minutes.
Task: Return ONLY the estimated calorie burn range (example: 300-400). No extra words.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents,
  });

  return `You burn: ${response.text} in this training`;
}

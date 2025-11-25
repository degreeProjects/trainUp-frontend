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
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `My height is ${height}cm and my weight is ${weight}kg, I am ${age} years old, and I had ${trainingType} training for ${trainingLength} minutes, tell me how many calories did I burn. I want you to return: just the calories burn range with no other text or explanations`,
  });

  return `You burn: ${response.text} in this training`;
}

import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

async function testGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is missing");
    return;
  }
  console.log("API Key found (starts with):", apiKey.substring(0, 5));

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  try {
    const result = await model.generateContent("Hello");
    console.log("Response:", result.response.text());
  } catch (error) {
    console.error("Gemini Error:", error);
  }
}

testGemini();

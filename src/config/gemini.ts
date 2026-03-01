import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = (process.env.GEMINI_API_KEY || "").trim();
if (!apiKey) {
    console.error("[GEMINI CONFIG] GEMINI_API_KEY is missing! Please set it in .env file.");
} else {
    console.log(`[GEMINI CONFIG] API Key found (length: ${apiKey.length})`);
}

const genAI = new GoogleGenerativeAI(apiKey);

export const geminiModel = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
});
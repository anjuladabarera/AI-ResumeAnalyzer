import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Retry wrapper
async function generateWithRetry(model, prompt, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      console.log("Gemini Retry Error:", err.status, err.statusText);

      if (err.status === 503 || err.status === 500) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        continue;
      }
      throw err;
    }
  }
  throw new Error("Gemini overloaded. Try again later.");
}

export async function analyzeResumeATS(text) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const prompt = `
    You are an ATS (Applicant Tracking System). Analyze the following resume:

    ${text}

    Reply ONLY in VALID JSON:

    {
      "ats_score": number,
      "skills_match": number,
      "experience_match": number,
      "missing_keywords": [],
      "strengths": [],
      "weaknesses": [],
      "summary": ""
    }
  `;

  return await generateWithRetry(model, prompt);
}

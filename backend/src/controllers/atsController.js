import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const atsScore = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "No text provided" });
    }

    const prompt = `
      You are an ATS (Applicant Tracking System). Analyze the following resume:

      ${text}

      Reply ONLY in the following JSON format:

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

    const result = await model.generateContent(prompt);
    const output = result.response.text(); // Gemini returns plain text

    res.status(200).json({
      success: true,
      analysis: output, // This goes directly to your frontend <p>{analysis}</p>
    });

  } catch (error) {
    console.error("Error analyzing CV:", error);
    res.status(500).json({
      success: false,
      message: "Error analyzing CV",
    });
  }
};

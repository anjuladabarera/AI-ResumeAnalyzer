import { compareJDnResume } from "../services/resumeAnalyzer.js";
import multer from "multer";
import express from "express";
import { analyzeResumeATS } from "../services/resumeAnalyzer.js";

/**
 * Safely parse model output that might include markdown fences.
 */
const parseComparison = (raw) => {
  if (!raw) return null;
  try {
    const cleaned = raw
      .replace(/```json\s*/gi, "")
      .replace(/```/g, "")
      .trim();
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
};

export const compareJobAndResume = async (req, res) => {
  try {
    const { jdText, text } = req.body;

    if (!jdText || !text) {
      return res
        .status(400)
        .json({ message: "Job Description text or Resume text missing" });
    }

    const rawComparison = await compareJDnResume(jdText, text);
    const parsed = parseComparison(rawComparison);

    // Fallback to minimal shape so frontend doesn't break
    const comparisonPayload =
      parsed ||
      {
        match_score: 0,
        skills_match: 0,
        experience_match: 0,
        missing_skills: [],
        strengths: [],
        weaknesses: [],
        summary: rawComparison || "No analysis returned",
      };

    res.status(200).json({
      success: true,
      comparision: comparisonPayload,
    });
  } catch (error) {
    console.error("Error comparing JD and Resume:", error);

    if (error.status === 429) {
      return res.status(429).json({
        success: false,
        message: "Gemini API quota exceeded. Please try again later.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error comparing JD and Resume",
    });
  }
};
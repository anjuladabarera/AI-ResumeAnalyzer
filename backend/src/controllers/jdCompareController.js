import { compareJDnResume } from "../services/resumeAnalyzer.js";
import multer from "multer";
import express from "express";
import { analyzeResumeATS } from "../services/resumeAnalyzer.js";



export const compareJobAndResume = async (req, res) => {
    try{
        const { jdText, text } = req.body;

        if (!jdText || !text)
           return res.status(400).json({ message: "Job Description text or Resume text missing" });

        const comparision = await compareJDnResume(jdText, text);

        res.status(200).json({
            success: true,
            comparision: comparision,
        });



    }

    catch (error) {

        console.error("Error comparing JD and Resume:", error);

        res.status(500).json({
            success: false,
            message: "Error comparing JD and Resume",
        });


         if (error.status === 429) {
      return res.status(429).json({
        success: false,
        message: "Gemini API quota exceeded. Please try again later."
      });

    }


}};
import { analyzeResumeATS } from "../services/resumeAnalyzer.js";


export const atsScore = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text)
      return res.status(400).json({ message: "No text provided" });

    const analysis = await analyzeResumeATS(text);

    res.status(200).json({
      success: true,
      analysis: analysis,
    });

  } catch (error) {
    console.error("Error analyzing CV:", error);

    res.status(500).json({
      success: false,
      message: "Error analyzing CV",
    });
  }
};

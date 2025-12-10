import multer from "multer";
import PDF from "../models/pdfModel.js";
import pdf from "pdf-parse-fixed";  // <-- WORKING VERSION

const storage = multer.memoryStorage();
export const upload_pdf = multer({ storage });

export const uploadPDF = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const pdfData = await pdf(file.buffer);
    const extractedText = pdfData.text;

    const newPDF = new PDF({
      name: file.originalname,
      data: file.buffer,
      contentType: file.mimetype,
      textFromPDF: extractedText,
    });

    const savedPDF = await newPDF.save();

    res.status(201).json({
      message: "PDF uploaded successfullyyyy",
      pdfId: savedPDF._id,
      text: extractedText,
    });
  } catch (error) {
    console.error("Error uploading PDF:", error);
    res.status(500).json({ message: "Server error while uploading PDF" });
  }
};


export const getextractedText = async (pdfId) => {
  try {
    const pdfDoc = await PDF.findById(pdfId);
  } catch (error) {
    console.error("Error retrieving PDF:", error);
    throw new Error("Error retrieving PDF");
  }
}
import express from "express";
import { uploadPDF  } from "../controllers/pdfController.js";
import { atsScore } from "../controllers/atsController.js";
import multer from "multer";        

const router = express.Router();


//routes
router.post("/ats-score", atsScore);


export default router;
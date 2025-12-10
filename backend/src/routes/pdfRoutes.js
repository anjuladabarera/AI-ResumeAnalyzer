import express from "express";
import { uploadPDF  } from "../controllers/pdfController.js";
import { upload_pdf } from "../controllers/pdfController.js";
import multer from "multer";





const router = express.Router();


//routes
// router.get("/", getallPDFs);
router.post("/upload", upload_pdf.single("pdf"), uploadPDF);
    


export default router; 

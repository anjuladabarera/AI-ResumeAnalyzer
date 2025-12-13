import express from "express";
import { compareJobAndResume } from "../controllers/jdCompareController.js";
const router = express.Router();

//routes

router.post("/compare-jobs", compareJobAndResume);

export default router;
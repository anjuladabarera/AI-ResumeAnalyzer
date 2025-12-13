import dotenv from "dotenv";
dotenv.config();


import express from 'express';
import pdfRoutes from './routes/pdfRoutes.js';
import connectDB from './config/db.js';

import cors from 'cors';
import { atsScore } from './controllers/atsController.js';
import atsRoutes from './routes/atsRoutes.js';
import jdRoutes from './routes/jdRoutes.js';

const app =express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/api/cv", pdfRoutes);
app.use("/api/cv", atsRoutes);
app.use("/api/cv", jdRoutes);
connectDB();




app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});




// mongodb+srv://wanjulasd_db_user:eBZe1XUbNxICGJbm@cluster0.4bpkums.mongodb.net/?appName=Cluster0
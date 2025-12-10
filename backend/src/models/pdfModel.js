import mongoose from "mongoose";

const pdfSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  data: {
    type: Buffer,
    required: true,
  },
  contentType: {
    type: String,
    required: true,
    default: "application/pdf",
  },
  textFromPDF: {
    type: String,  // store extracted text as a string
  },
}, 
{ timestamps: true }
);

export const PDF = mongoose.model("PDF", pdfSchema);
export default PDF;

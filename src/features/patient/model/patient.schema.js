// Import mongoose
import mongoose from "mongoose";

// Schema Creation
const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ["Male", "Female"], required: true },
  phoneNumber: { type: Number, required: true },
  reports: [{ type: mongoose.Schema.ObjectId,ref:'Report' }],
});

// Export the schema
export default patientSchema;

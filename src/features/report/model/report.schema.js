// Import mongoose
import mongoose from "mongoose";

// Schema Creation
const reportSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.ObjectId,
    ref: "Doctor",
    required: true,
  },
  patientId:{
    type:mongoose.Schema.ObjectId,
    ref:"Patient",
    required:true
  },
  createdBy:{type:String,required:true},
  patientName:{type:String,required:true},
  dateOfCreation: {
    type: Date,
    default: Date.now(),
  },
  status:{type:String,enum:["Negative", "Travelled-Quarantine", "Symptoms-Quarantine",
    "Positive-Admit"]},
});

// Export the schema
export default reportSchema;

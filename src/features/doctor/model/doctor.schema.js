// Import mongoose
import mongoose from "mongoose";

// Create Schema
const doctorSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email: {type: String, unique: true, required: true,
        match: [/.+\@.+\../, "Please enter a valid email"]
    },
    password:{type:String,required:true}
});

// Export statement
export default doctorSchema;
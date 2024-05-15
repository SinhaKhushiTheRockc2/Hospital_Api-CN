// Import third party modules
import mongoose from "mongoose";
import dotenv from "dotenv";

// Load all environment variables
dotenv.config();

// Storing the url of the database in a constant
const url=process.env.DB_URL;

// Create connection with the database
const connectToDB=async()=>{
    try {
        mongoose.connect(`${url}/hospitaldb`);
        console.log("MongoDb is connected using Mongoose");
    } catch (error) {
        console.log(error);
    }
}

export default connectToDB;
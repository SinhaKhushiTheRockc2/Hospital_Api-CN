// Import third party modules 
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// Import internal modules
import connectToDB from "./src/config/mongooseConfig.js";
import doctorRouter from "./src/features/doctor/routes/doctor.routes.js";
import patientRouter from "./src/features/patient/routes/patient.routes.js";
import jwtAuth from "./src/middleware/jwt.middleware.js";
import { errorHandlerMiddleware } from "./src/middleware/errorHandlerMiddleware.js";


// Create express server
const server=express();

// Load all environment variables
dotenv.config();

// Body parsing middleware
server.use(express.json());
server.use(cookieParser());
// Configure Routes
server.use('/api/doctor',doctorRouter);
server.use('/api/patient',jwtAuth,patientRouter);

// Error handler
server.use(errorHandlerMiddleware);

// Specify the port
server.listen(process.env.PORT,()=>{
    console.log("Server is listening on port 3200");
    // Call the database connection
    connectToDB();
});

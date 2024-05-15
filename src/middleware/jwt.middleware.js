// Import jsonwebtoken
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ApplicationError } from "../error_handler/application.error.js";

// Dotenv configuration
dotenv.config();

const jwtAuth=(req,res,next)=>{
    // Read the token
    const token=req.cookies.jwtToken;
    // req.cookies=token;
    console.log('req.cookies',req.cookies.jwtToken);
    console.log(token);
    // If no token is found
    if (!token) {
        throw new ApplicationError(401,"Login to access this route");
    }
    // Check if the token is valid
    try {
        const payload=jwt.verify(
            token,
            process.env.JWT_SECRET
        );
        req.userID=payload.userID;
    } catch (error) {
        // Return error
        return res.status(400).json({error:"Unauthorized"});
    }
    //Call the next middleware
    next(); 
}


export default jwtAuth;
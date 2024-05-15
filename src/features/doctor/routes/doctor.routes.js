// Import express
import express from "express";
import DoctorController from "../controller/doctor.controller.js";
import jwtAuth from "../../../middleware/jwt.middleware.js";

// Router creation
const doctorRouter=express.Router();

// Instance of Controller
const doccon=new DoctorController(); 

// Doctor Related routes
// Post request
doctorRouter.post('/doctors/register',(req,res,next)=>{
    doccon.signUp(req,res,next);
});

doctorRouter.post('/doctors/login',(req,res,next)=>{
    doccon.signIn(req,res,next);
});

// Get request
doctorRouter.get('/doctors/logout',jwtAuth,(req,res,next)=>{
    doccon.logoutUser(req,res,next);
});

// Put request
doctorRouter.put('/doctors/resetPassword/',(req,res,next)=>{
    doccon.resetPassword(req,res,next);
});

// Delete request
doctorRouter.delete('/doctors/delete/:doctorId',jwtAuth,(req,res,next)=>{
    doccon.deleteDoctorRecord(req,res,next);
})
// Export statement
export default doctorRouter;
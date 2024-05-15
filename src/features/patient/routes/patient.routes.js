// Import express
import express from "express";
import DoctorController from "../../doctor/controller/doctor.controller.js";

// Router Creation
const patientRouter=express.Router();

// Instance creation of doctorController
const doccon=new DoctorController();

// Post requests
patientRouter.post('/patients/register',(req,res,next)=>{
    doccon.registerPatient(req,res,next);
});

patientRouter.post('/patients/:id/create_report',(req,res,next)=>{
    doccon.createReport(req,res,next);
});

// Get requests
patientRouter.get('/patients/:id/all/reports',(req,res,next)=>{
    doccon.allReports(req,res,next);
});

patientRouter.get('/patients/reports/:status',(req,res,next)=>{
    doccon.getReportByStatus(req,res,next);
});

patientRouter.get('/patients/all',(req,res,next)=>{
    doccon.findAllPatients(req,res,next);
});

patientRouter.get('/patients/:patientId',(req,res,next)=>{
    doccon.findPatientRecordById(req,res,next);
});

patientRouter.get('/patients',(req,res,next)=>{
    doccon.findPatientsByName(req,res,next);
});


// Delete requests
patientRouter.delete('/patients/:id',(req,res,next)=>{
    doccon.deletePatientRecord(req,res,next);
});

// Export the router
export default patientRouter;
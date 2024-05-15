// Import necessary modules
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import DoctorRepository from "../model/doctor.repository.js";
import jwtAuth from "../../../middleware/jwt.middleware.js";
import { ApplicationError } from "../../../error_handler/application.error.js";
import dotenv from "dotenv";

// dotenv configuration
dotenv.config();

// Create controller class
export default class DoctorController {
  // Create constructor
  constructor() {
    this.docRepo = new DoctorRepository();
  }

  // Controller method to handle user registration
  async signUp(req, res, next) {
    // Get the data from request body
    const { name, email, password } = req.body;
    try {
      // Encrypt the password
      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = { name, email, hashedPassword };
      // Send resource created successfully response
      const result = await this.docRepo.registerDoctor(newUser);
      return res.status(201).json({
        success: true,
        msg: "User registered successfully",
        details: result,
      });
    } catch (error) {
      // If the user enters duplicate credentials
      if (error.name === "MongoServerError" && error.code === 11000) {
        res.status(400).send({
          success: false,
          error: "email already registered",
        });
      }
      next(error);
    }
  }

  // Controller method to handle user login
  async signIn(req, res, next) {
    try {
      // 1. Find user by email.
      const user = await this.docRepo.findByEmail(req.body.email);
      if (!user) {
        return res.status(400).send("Incorrect Credentials");
      } else {
        // 2. Compare password with hashed password.
        const result = await bcrypt.compare(req.body.password, user.password);
        if (result) {
          // 3. Create token.
          const token = jwt.sign(
            {
              userID: user._id,
              email: user.email,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: "1h",
            }
          );
          // 4. Send token.
          return res.status(200).cookie("jwtToken", token, {maxAge:1000*60*60*2, httpOnly:true}).json({success:true,token:token});
        } else {
          return res
            .status(400)
            .json({ success: false, error: "Incorrect Credentials" });
        }
      }
    } catch (err) {
      // Handling error
      return next(new ApplicationError(400,err));
      return res.status(400).json({success:false,error:"Something went wrong while trying to login the user"});
    }
  }

  // Controller method to handle logout user request
  async logoutUser(req, res, next) {
    res
      .status(200)
      .cookie("jwtToken", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      })
      .json({ success: true, msg: "logout successful" });
  }

  // Controller method to reset a user password
  async resetPassword(req, res, next) {
    const token = req.cookies.jwtToken;
    try {
      console.log("this is token", token);

      const isverified = jwt.verify(token,
        process.env.JWT_SECRET);
      console.log("isverified", isverified);
      if (isverified) {
        const email = isverified.email;
        const { newPassword } = req.body;
        const user = await this.docRepo.findByEmail(email);
        console.log(user);
        if (!user) {
          return res
            .status(401)
            .json({
              success: false,
              error: "User not found , first register yourself",
            });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        user.password = hashedPassword;
        await user.save();
        res
          .status(200)
          .json({ success: true, msg: "Password reset successfully" });
      } else {
        res
          .status(200)
          .json({
            success: false,
            msg: "please enter the valid token or your token has been expired",
          });
      }
    } catch (err) {
      // Handling error
      return next(new ApplicationError(400,err));
    }
  }

  // Controller method to handle patient's registration
  async registerPatient(req, res, next) {
    console.log(req.body);
    try {
      // First check if the patient with the enterd phone number already exists
      const patient = await this.docRepo.findByPhoneNumber(
        req.body.phoneNumber
      );
      if (patient) {
        // Return patient details if already exist
        return res.status(200).json({
          success: false,
          msg: "Patient with the entered credentials already exist",
          patient_info: patient,
        });
      } else {
        // If the patient doesn't exist
        const newPatient = await this.docRepo.registerPatientRepo(req.body);
        // Return the success status
        return res
          .status(201)
          .json({
            success: true,
            msg: "Patient registered successfully!",
            patient_info: newPatient,
          });
      }
    } catch (error) {
      // Handling error
      return next(new ApplicationError(400,err));
      return res.status(400).json({success:false,error:"Something went wrong while trying to register the patient"});
    }
  }

  // Controller method to handle patient's report creation
  async createReport(req, res, next) {
    // Get the userId from payload
    const userID = req.userID;
    // Get patientid from request parameters
    const { id } = req.params;
    // Get date of creation and status from request body
    const { creationDate, status } = req.body;
    console.log(userID);
    console.log(id);
    console.log(req.body);
    try {
      const report = await this.docRepo.createReportRepo(
        userID,
        id,
        creationDate,
        status
      );
      // Return resource created status
      return res
        .status(201)
        .json({
          success: true,
          msg: "Report created successfully",
          report: report,
        });
    } catch (error) {
      // Handling duplicate key error
      if (error.name === "MongoServerError" && error.code === 11000) {
        res.status(400).json({
          success: false,
          error:
            "A report with the provided credentials already exist, you can create a new report with different patientId",
        });
      }
      // Handling error
      return next(new ApplicationError(400,err));
      return res.status(400).json({success:false,error:"Something went wrong while trying to create report for the patient"});
    }
  }

  // Controller method that handles all the reports related to a single patient
  async allReports(req, res, next) {
    // Patient id from request parameters
    const { id } = req.params;
    try {
      const reports = await this.docRepo.allReports(id);
      if (reports) {
        return res.status(200).json({ success: true, reports: reports });
      }
    } catch (error) {
      // Handling error
      return next(new ApplicationError(400,err));
      return res.status(400).json({success:false,error:"Something went wrong while trying to fetch the reports"});
    }
  }

  // Controller method that handles reports based on their status
  async getReportByStatus(req, res, next) {
    const { status } = req.params;
    try {
      // Fetching the reports from doctor repo
      const reports = await this.docRepo.reportBasedOnStatus(status);
      if (reports) {
        return res.status(200).json({ success: true, reports: reports });
      }
    } catch (error) {
      // Handling error
      return next(new ApplicationError(400,err));
      return res.status(400).json({success:false,error:"Something went wrong while trying to fetch report"});
    }
  }

  // Controller method that handles Patient's records deletion
  async deletePatientRecord(req, res, next) {
    // Fetching the id from request parameters
    const { id } = req.params;
    try {
      const result = await this.docRepo.deletePatientRecord(id);
      if (result) {
        return res
          .status(200)
          .json({
            success: true,
            msg: "Patient records deleted successfully!",
          });
      }
      return res
        .status(400)
        .json({ success: false, msg: "Incorrect id maybe" });
    } catch (error) {
      // Handling error
      return next(new ApplicationError(400,err));
      return res.status(400).json({success:false,error:"Something went wrong while trying to delete the patient's record"});
    }
  }

  // Controller method that handles Doctor's record deletion
  async deleteDoctorRecord(req, res, next) {
    // Fetching doctor's id from request parameters
    const { doctorId } = req.params;
    try {
      const result = await this.docRepo.deleteDoctorRecord(doctorId);
      if (result) {
        return res
          .status(200)
          .json({
            success: true,
            msg: "Doctor's record got deleted successfully!",
          });
      }
      return res.status(400).json({ success: false, msg: "Incorrect id" });
    } catch (error) {
      // Handling error
      return next(new ApplicationError(400,err));
      return res.status(400).json({success:false,error:"Something went wrong while trying to delete the doctor's record"});
    }
  }

  // Controller method that return the patient details based on their id
  async findPatientRecordById(req, res, next) {
    // Fetching patient id from request parameters
    const { patientId } = req.params;
    try {
      const result = await this.docRepo.findPatientById(patientId);
      if (result) {
        return res.status(200).json({ success: true, patient: result });
      }
      return res.status(400).json({ success: false, msg: "Incorrect id" });
    } catch (error) {
      // Handling Bad Requests
      // Handling error
      return next(new ApplicationError(400,err));
      return res.status(400).json({success:false,error:"Something went wrong while trying to search for the patient"});
    }
  }

  // Controller method that return all patient details
  async findAllPatients(req, res, next) {
    try {
      const result = await this.docRepo.searchAllPatients();
      if (result) {
        return res.status(200).json({ success: true, patient: result });
      }
      return res.status(400).json({ success: false, msg: "Incorrect id" });
    } catch (error) {
      // Handling error
      return next(new ApplicationError(400,err));
      return res.status(400).json({success:false,error:"Something went wrong while trying to find the patients"});
    }
  }

  // Controller method that return all patient details
  async findPatientsByName(req, res, next) {
    try {
      console.log(req.body);
      const result = await this.docRepo.findPatientByName(req.body);
      console.log(result);
      if (result) {
        return res.status(200).json({ success: true, patient: result });
      }
      return res.status(400).json({ success: false, msg: "Nothing found" });
    } catch (error) {
      // Handling error
      return next(new ApplicationError(400,err));
      return res.status(400).json({success:false,error:"Something went wrong while trying to fetch the patient details"});
    }
  }
}

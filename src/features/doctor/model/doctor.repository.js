// Import mongoose
import mongoose from "mongoose";

// Import internal modules
import doctorSchema from "./doctor.schema.js";
import patientSchema from "../../patient/model/patient.schema.js";
import reportSchema from "../../report/model/report.schema.js";
import { ApplicationError } from "../../../error_handler/application.error.js";

// Create model
const doctorModel = mongoose.model("doctor", doctorSchema);

// Create patient's model
const patientModel = mongoose.model("patient", patientSchema);

// Create report's model
const reportModel = mongoose.model("report", reportSchema);
// Repository Class
export default class DoctorRepository {
  // Function that registers a user
  async registerDoctor(data) {
    // Create and save the user
    console.log(data);
    const newUser = new doctorModel({
      name: "Dr." + data.name,
      email: data.email,
      password: data.hashedPassword,
    });
    const savedUser = newUser.save();
    return savedUser;
  }

  // Function that finds a user by their email
  async findByEmail(email) {
    console.log(email);
      const user = await doctorModel.findOne({ email });
      console.log(user);
      return user;
  }

  // Function that resets a user's password
  async resetPassword(userID, hashedPassword) {
    let user = await doctorModel.findById(userID);
      user.password = hashedPassword;
      user.save();
  }

  // Function responsible for registering a patient in the database
  async registerPatientRepo(data) {
    const newPatient = new patientModel({
      name: data.name,
      age: data.age,
      gender: data.gender,
      phoneNumber: data.phoneNumber,
    });
    const savedPatient = await newPatient.save();
    return savedPatient;
  }

  // Find patient by their phone number
  async findByPhoneNumber(phno) {
    // Find the patient in the database and return the result
    const patient = await patientModel.findOne({ phoneNumber: phno });
    return patient;
  }

  // Function that is responsible for patient's report creation
  async createReportRepo(userId, id, creationDate, status) {
    // Find doctor name
    const doctorName = await doctorModel.findById(userId);
    console.log(doctorName.name);

    // find patient by id
    const patient = await patientModel.findById(id);
    if (patient) {
      // New report creation
      const newReport = new reportModel({
        doctorId: userId,
        patientId: id,
        createdBy:doctorName.name,
        patientName: patient.name,
        dateOfCreation: creationDate,
        status: status,
      });
      // Saving the report
      const savedReport = newReport.save();
      // Push the saved report to the patient model
      console.log(newReport._id);
      console.log(patient.reports);
      patient.reports.push(newReport._id);
      await patient.save();
      console.log(patient);
      // Return the saved report
      return savedReport;
    }
  }

  // Function that returns all the reports for a given patient id
  async allReports(patientId) {
    // Checking if the patient exists
    const patient = await patientModel.findById(patientId);
    // If the patient exists
    if (patient) {
      // Find all the reports for the given patient id
      const reportByPatientId = await reportModel.find({
        patientId: patientId,
      });
      return reportByPatientId;
    }
  }

  // Function that filters reports based on the status
  async reportBasedOnStatus(status) {
    // Find reports with the provided status
    const reports = await reportModel.find({ status: status });
    return reports;
  }

  // Function that deletes the patient record
  async deletePatientRecord(patientId) {
    // Checking if the patient exists
    const patient = await patientModel.findById(patientId);
    if (patient) {
      patient.reports.forEach(async (report) => {
        // Deleting all the reports corresponding to the patient
        await reportModel.findByIdAndDelete(report._id);
      });
      // Deleting the patient
      const deletedPatient = await patientModel.findByIdAndDelete(patientId);
      return deletedPatient;
    }
  }

  // Function that deletes Doctor's record
  async deleteDoctorRecord(doctorId) {
    // Checking if the doctor exist
    const doctor = await doctorModel.findById(doctorId);
    // If doctor exist ,delete the doctor's record
    if (doctor) {
      const deletedDoctorRecord = await doctorModel.findByIdAndDelete(
        doctorId
      );
      return deletedDoctorRecord;
    } else {
      return "nothing found";
    }
  }

  // Function that returns all patients in the database
  async searchAllPatients() {
    // Finding all patients and saving the data in a constant
    const patients = await patientModel.find();
    return patients;
  }

  // Function that finds a patient by their id
  async findPatientById(patientId) {
      // Checking if the patient with the provided id exists in the database
      const patient = await patientModel.findById(patientId);
      return patient;
  }

  // Function that finds all patients with similar names
  async findPatientByName(patientName) {
    // Finding patients by name
    const patients = await patientModel.find({ name: patientName.name });
    console.log(patients);
    return patients;
  }
}

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Modal, Form } from "react-bootstrap";
import moment from "moment";

const DoctorPatients = () => {
  const [doctorId, setDoctorId] = useState(""); // Logged-in doctor ID
  const [patients, setPatients] = useState([]); // Past patients
  const [filteredPatients, setFilteredPatients] = useState([]); // Filtered patients based on search
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]); // Prescription details for selected patient
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [searchTerm, setSearchTerm] = useState(""); // Search term for filtering patients

  useEffect(() => {
    const loggedInDoctorId = JSON.parse(sessionStorage.getItem("DocBook"))?.id;
    if (loggedInDoctorId) {
      setDoctorId(loggedInDoctorId);
      fetchCompletedAppointments(loggedInDoctorId);
    }
  }, []);

  const fetchCompletedAppointments = async (doctorId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/appointments?doctorId=${doctorId}&status=Accepted`);
      const uniquePatients = [];

      // Loop through appointments and fetch unique patients
      for (const appointment of response.data) {
        // Only add a patient if they are not already in the list
        if (!uniquePatients.some((p) => p.patientId === appointment.patientId)) {
          const patientRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/patients/${appointment.patientId}`);
          uniquePatients.push({
            ...patientRes.data,
            appointmentDate: appointment.date,
            appointmentTime: appointment.slot,
          });
        }
      }

      setPatients(uniquePatients); // Set all patients
      setFilteredPatients(uniquePatients); // Set filtered patients based on search
    } catch (error) {
      console.error("Error fetching completed appointments:", error);
    }
  };

  const handleViewReport = async (patientId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/medicalReports?patientId=${patientId}`);
      const reportsWithAppointments = await Promise.all(
        response.data.map(async (report) => {
          const appointmentRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/appointments/${report.appointmentId}`);
          return {
            ...report,
            appointmentDate: appointmentRes.data.date, // Fetch appointment date
            appointmentTime: appointmentRes.data.slot, // Fetch appointment time
          };
        })
      );

      setPrescriptions(reportsWithAppointments); // Set prescriptions with appointment details
      setSelectedPatient(patientId); // Set selected patient for the modal
      setShowModal(true); // Show the modal
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
    }
  };

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase(); // Convert search term to lowercase
    setSearchTerm(searchTerm); // Update search term
    const filtered = patients.filter((patient) =>
      patient.username.toLowerCase().includes(searchTerm) // Filter patients by name
    );
    setFilteredPatients(filtered); // Update filtered patients
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center" style={{ color: "#0056b3" }}>Past Patients</h2>

      {/* Search input field */}
      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search by patient name..."
          value={searchTerm}
          onChange={handleSearch} // Handle search input changes
        />
      </Form.Group>

      {/* Patients Table */}
      <Table bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Patient Name</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredPatients.map((patient, index) => (
            <tr key={index}>
              <td>{patient.username}</td>
              <td>{patient.email}</td>
              <td>
                <Button variant="primary" onClick={() => handleViewReport(patient.id)}>
                  View Report
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Viewing Reports */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Patient Reports</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {prescriptions.length ? (
            prescriptions.map((prescription, index) => (
              <div key={index} className="p-3 border rounded mb-3">
                <h5>Appointment Date: {prescription.appointmentDate}</h5>
                <h5>Appointment Time: {prescription.appointmentTime}</h5>
                <p><strong>Description:</strong> {prescription.description || "N/A"}</p>
                <p><strong>Next Appointment:</strong> {prescription.nextAppointmentDate ? moment(prescription.nextAppointmentDate).format("DD-MM-YYYY") : "Not Scheduled"}</p>

                <h6>Medicines</h6>
                <Table bordered>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Dosage</th>
                      <th>Meal Timing</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prescription.medicines.map((med, idx) => (
                      <tr key={idx}>
                        <td>{med.name}</td>
                        <td>{med.dosage}</td>
                        <td>{med.mealTiming}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ))
          ) : (
            <p>No reports found for this patient.</p>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DoctorPatients;

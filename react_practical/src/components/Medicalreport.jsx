import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Table, Button, Form } from "react-bootstrap";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable"; 
import moment from "moment"; // For date formatting

const UserPrescription = () => {
  const [patientId, setPatientId] = useState(""); 
  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [doctorName, setDoctorName] = useState("");

  useEffect(() => {
    const loggedInPatientId = JSON.parse(sessionStorage.getItem("DocBook"))?.id;
    if (loggedInPatientId) {
      setPatientId(loggedInPatientId);
      fetchPrescriptions(loggedInPatientId);
    } else {
      console.error("No patient ID found in sessionStorage");
    }
  }, []);

  const fetchPrescriptions = async (id) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/medicalReports?patientId=${id}`);
      
      const patientRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/patients/${id}`); // Fetch patient details

      const prescriptionsWithDetails = await Promise.all(
        response.data.map(async (prescription) => {
          const doctorRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/doctors/${prescription.doctorId}`);
          const appointmentRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/appointments/${prescription.appointmentId}`);

          return {
            ...prescription,
            doctorName: doctorRes.data.username,
            appointmentDate: appointmentRes.data.date,
            appointmentTime: appointmentRes.data.slot,
            patientName: patientRes.data.username,  
            patientId: patientRes.data.id,  
            patientAge: patientRes.data.age, 
            patientGender: patientRes.data.gender, 
          };
        })
      );

      setPrescriptions(prescriptionsWithDetails);
      setFilteredPrescriptions(prescriptionsWithDetails);
    } catch (error) {
      console.error("Error fetching medical reports:", error);
    }
  };

  const handleSearch = () => {
    const filtered = prescriptions.filter((prescription) =>
      prescription.doctorName.toLowerCase().includes(doctorName.toLowerCase())
    );
    setFilteredPrescriptions(filtered);
  };

  const generatePDF = (prescription) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Medical Prescription", 14, 20);

    doc.setFontSize(12);
    doc.text(`Patient Name: ${prescription.patientName || "N/A"}`, 14, 30);
    doc.text(`Patient ID: ${prescription.patientId || "N/A"}`, 14, 40);
    doc.text(`Age: ${prescription.patientAge || "N/A"}`, 14, 50);
    doc.text(`Gender: ${prescription.patientGender || "N/A"}`, 14, 60);

    doc.text(`Doctor Name: Dr. ${prescription.doctorName}`, 14, 75);
    doc.text(`Appointment Date: ${moment(prescription.date).format("DD-MM-YYYY")}`, 14, 85);
    doc.text(`Appointment Time: ${prescription.appointmentTime}`, 14, 95);
    doc.text(`Description: ${prescription.description || "N/A"}`, 14, 105);

    if (prescription.nextAppointmentDate) {
      doc.text(`Next Appointment Date: ${moment(prescription.nextAppointmentDate).format("DD-MM-YYYY")}`, 14, 115);
    }

    // Medicines Table
    autoTable(doc, {
      startY: 125,
      head: [["Medicine Name", "Dosage", "Meal Timing"]],
      body: prescription.medicines.map((med) => [med.name, med.dosage, med.mealTiming]),
    });

    doc.save(`Prescription_${prescription.appointmentId}.pdf`);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4" style={{ color: "#0056b3" }}>My Prescriptions</h2>

      {/* Search Form */}
      <div className="mb-4">
        <Form>
          <Form.Group controlId="doctorName">
            <Form.Label>Search by Doctor Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter doctor's name"
              value={doctorName}
              style={{ width: "260px", marginBottom: "10px" }}
              onChange={(e) => setDoctorName(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" onClick={handleSearch}>
            Search
          </Button>
        </Form>
      </div>

      {filteredPrescriptions.length === 0 ? (
        <h4 className="text-center mt-4">No Medical Reports Found</h4>
      ) : (
        filteredPrescriptions.map((prescription, index) => (
          <Card key={index} className="p-4 mb-4 shadow-lg rounded">
            <Table bordered hover responsive>
              <tbody>
                <tr>
                  <td><strong>Doctor Name:</strong></td>
                  <td>Dr. {prescription.doctorName}</td>
                </tr>
                <tr>
                  <td><strong>Appointment Date:</strong></td>
                  <td>{moment(prescription.appointmentDate).format("DD-MM-YYYY")}</td>
                </tr>
                <tr>
                  <td><strong>Appointment Time:</strong></td>
                  <td>{prescription.appointmentTime}</td>
                </tr>
                <tr>
                  <td><strong>Description:</strong></td>
                  <td>{prescription.description || "N/A"}</td>
                </tr>
                <tr>
                  <td><strong>Next Appointment Date:</strong></td>
                  <td>{prescription.nextAppointmentDate ? moment(prescription.nextAppointmentDate).format("DD-MM-YYYY") : "Not Scheduled"}</td>
                </tr>
              </tbody>
            </Table>

            <h5>Medicines</h5>
            <Table bordered hover responsive>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Dosage</th>
                  <th>Meal Timing</th>
                </tr>
              </thead>
              <tbody>
                {prescription.medicines.map((medicine, idx) => (
                  <tr key={idx}>
                    <td>{medicine.name}</td>
                    <td>{medicine.dosage}</td>
                    <td>{medicine.mealTiming}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* PDF Button */}
            <Button variant="danger" onClick={() => generatePDF(prescription)} style={{ width: "100%", marginTop: "10px" }}>
              Download as PDF
            </Button>
          </Card>
        ))
      )}
    </div>
  );
};

export default UserPrescription;

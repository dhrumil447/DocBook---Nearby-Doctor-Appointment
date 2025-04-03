import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { Card, Table, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";

const Prescription = () => {
  const { id } = useParams(); // appointmentId from URL
  const [prescription, setPrescription] = useState(null);
  const [patient, setPatient] = useState(null);
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch prescription data
        const prescRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/medicalReports?appointmentId=${id}`);
        if (prescRes.data.length === 0) {
          alert("Prescription not found!");
          return;
        }
        const prescriptionData = prescRes.data[0];
        setPrescription(prescriptionData);

        // Fetch patient data
        const patientRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/patients/${prescriptionData.patientId}`);
        setPatient(patientRes.data);

        // Fetch appointment details
        const appointmentRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/appointments/${id}`);
        setAppointment(appointmentRes.data);
      } catch (err) {
        console.error("Error fetching prescription details:", err);
      }
    };

    fetchData();
  }, [id]);

  const handleDeleteMedicine = async (index) => {
    try {
      const updatedMedicines = prescription.medicines.filter((_, i) => i !== index);
      await axios.patch(`${import.meta.env.VITE_BASE_URL}/medicalReports/${prescription.id}`, { medicines: updatedMedicines });
      setPrescription((prev) => ({ ...prev, medicines: updatedMedicines }));
      toast.success("Medicine deleted successfully!");
    } catch (err) {
      console.error("Error deleting medicine:", err);
      toast.error("Failed to delete medicine.");
    }
  };

  const handlePrint = () => {
    let olddata = document.body.innerHTML
    document.body.innerHTML = document.getElementById('data').innerHTML
    window.print();
    document.body.innerHTML = olddata
  };

  if (!prescription || !patient || !appointment) {
    return <h4 className="text-center mt-4">Loading...</h4>;
  }

  return (
    <div className="container mt-4 p-2" id="data">
      <Card className="p-3">
        <h3 className="text-center fw-bold">Prescription Details</h3>

        {/* Patient Details */}
        <h5 className="mt-3">Patient Information</h5>
        <div className="text-center mt-3">
          <Button variant="primary" className="float-end mb-2" onClick={handlePrint}>Print Medical Report</Button>
        </div>
        <Table bordered>
          <tbody>
            <tr><td><strong>Name:</strong></td><td>{patient.username}</td></tr>
            <tr><td><strong>Email:</strong></td><td>{patient.email}</td></tr>
            <tr><td><strong>Phone:</strong></td><td>{patient.phone}</td></tr>
          </tbody>
        </Table>

        {/* Appointment Details */}
        <h5 className="mt-3">Appointment Information</h5>
        <Table bordered>
          <tbody>
            <tr><td><strong>Date:</strong></td><td>{appointment.date}</td></tr>
            <tr><td><strong>Time Slot:</strong></td><td>{appointment.slot}</td></tr>
          </tbody>
        </Table>

        {/* Prescription Details */}
        <h5 className="mt-3">Prescription</h5>
        <Table bordered>
          <thead>
            <tr>
              <th>Medicine Name</th>
              <th>Dosage</th>
              <th>Meal Timing</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {prescription.medicines.map((med, index) => (
              <tr key={index}>
                <td>{med.name}</td>
                <td>{med.dosage}</td>
                <td>{med.mealTiming}</td>
                <td>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteMedicine(index)}>
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Additional Details */}
        <h5 className="mt-3">Additional Information</h5>
        <Table bordered>
          <tbody>
            <tr><td><strong>Description:</strong></td><td>{prescription.description}</td></tr>
            <tr><td><strong>Next Appointment Date:</strong></td><td>{prescription.nextAppointmentDate || "Not Scheduled"}</td></tr>
          </tbody>
        </Table>

        {/* Print Button */}
        
      </Card>
    </div>
  );
};

export default Prescription;

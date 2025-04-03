import React, { useEffect, useState } from "react";
import axios from "axios";
import emailjs from "@emailjs/browser";
import { useNavigate } from "react-router";
import { Card, Button, Table, Modal, Form } from "react-bootstrap";
import { toast } from "react-toastify";

const ViewAppointment = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [newMedicine, setNewMedicine] = useState({ name: "", dosage: "", mealTiming: "" });
  const [description, setDescription] = useState("");
  const [nextAppointmentDate, setNextAppointmentDate] = useState("");

  useEffect(() => {
    const doctorId = JSON.parse(sessionStorage.getItem("DocBook"))?.id;
    if (!doctorId) {
      navigate("/login");
      return;
    }

    const fetchAppointments = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/appointments?doctorId=${doctorId}`);
        const appointmentsWithPatients = await Promise.all(
          res.data.map(async (appt) => {
            const patientRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/patients/${appt.patientId}`);

              // Fetch payment details
              let paymentMethod = "Not Paid";
              let razorpayId = "-";
              try {
                const paymentRes = await axios.get(`http://localhost:1000/Payment?appointmentId=${appt.id}`);
                if (paymentRes.data.length > 0) {
                  paymentMethod = paymentRes.data[0].paymentMethod;
                  razorpayId = paymentRes.data[0].razorpayId || "-";
                }
              } catch (error) {
                console.error("Error fetching payment details:", error);
              }
  
            return {
              ...appt,
              patientName: patientRes.data.username,
              patientPhone: patientRes.data.phone,
              patientEmail: patientRes.data.email,
              paymentMethod,
              razorpayId,
            };
          })
        );
        setAppointments(appointmentsWithPatients);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      }
    };
    fetchAppointments();
  }, [navigate]);

  const updateAppointmentStatus = async (id, status, patientEmail, patientName, appointmentDate, appointmentTime) => {
    try {
      await axios.patch(`${import.meta.env.VITE_BASE_URL}/appointments/${id}`, { status });

      if (status === "Accepted" && patientEmail) {
        emailjs.send("service_rl0f4za", "template_zodqxou", {
            email: patientEmail,
            patient_name: patientName,
            appointment_date: appointmentDate,
            appointment_time: appointmentTime,
          }, { publicKey: "SwJM3G57VeGq0uvhd" }
        ).then((response) => {
            console.log("Email sent successfully:", response);
            toast.success("Email sent successfully!");
          }).catch((error) => {
            console.error("Error sending email:", error);
            toast.error(`Error sending email: ${error.text || "Unknown error"}`);
          });
      }

      setAppointments((prev) =>
        prev.map((appt) => (appt.id === id ? { ...appt, status } : appt))
      );
    } catch (err) {
      console.error("Error updating appointment status:", err);
    }
  };

  const addMedicine = () => {
    if (!newMedicine.name || !newMedicine.dosage || !newMedicine.mealTiming) {
      toast.error("All fields are required.");
      return;
    }
    setMedicines([...medicines, newMedicine]);
    setNewMedicine({ name: "", dosage: "", mealTiming: "" });
  };

  const handleSubmitPrescription = async () => {
    if (medicines.length === 0) {
      toast.error("Please add at least one medicine.");
      return;
    }
  
    try {
      const doctorId = JSON.parse(sessionStorage.getItem("DocBook"))?.id;
      const appointmentId = selectedAppointment.id;
      const patientId = selectedAppointment.patientId;
  
      // Check if medical report already exists
      const existingReports = await axios.get(`${import.meta.env.VITE_BASE_URL}/medicalReports?appointmentId=${appointmentId}`);
      
      let updatedMedicines = [...medicines]; // Start with new medicines
  
      if (existingReports.data.length > 0) {
        const existingReport = existingReports.data[0]; // Get existing report
        updatedMedicines = [...existingReport.medicines, ...medicines]; // Merge old + new medicines
  
        // Update existing report
        await axios.patch(`${import.meta.env.VITE_BASE_URL}/medicalReports/${existingReport.id}`, {
          medicines: updatedMedicines,
          description,
          nextAppointmentDate,
        });
  
        toast.success("Prescription updated successfully!");
      } else {
        // Create new report
        await axios.post(`${import.meta.env.VITE_BASE_URL}/medicalReports`, {
          appointmentId,
          patientId,
          doctorId,
          medicines,
          description,
          nextAppointmentDate,
        });
  
        toast.success("Prescription & Medical Report saved successfully!");
      }
  
      setShowModal(false);
      setMedicines([]);
      setDescription("");
      setNextAppointmentDate("");
    } catch (err) {
      console.error("Error saving prescription:", err);
      toast.error("Failed to save prescription. Try again.");
    }
  };
  
  
  

  return (
    <div className="container mt-4">
      <Card className="p-3">
        <h4 className="text-center fw-bold">Doctor Appointments</h4>
        {appointments.length > 0 ? (
          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>Patient Name</th>
               
                <th>Phone</th>
                <th>Date</th>
                <th>Time Slot</th>
                <th>Payment</th>
              
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt.id}>
                  <td>{appt.patientName}</td>
               
                  <td>{appt.patientPhone}</td>
                  <td>{appt.date}</td>
                  <td>{appt.slot}</td>
                  <td>{appt.paymentMethod}<br/>{appt.razorpayId}</td>
                  <td>
                    {appt.status === "Accepted" ? (
                      <>
                        <Button variant="success" className="btn-sm" disabled>Accepted</Button>
                        <Button
                          variant="info"
                          className="ms-2 btn-sm "
                          onClick={() => {
                            setSelectedAppointment(appt);
                            setShowModal(true);
                          }}
                        >
                          Write Prescription
                        </Button>
                        <Button
                      variant="primary"
                      className="ms-2 btn-sm"
                      onClick={() => navigate(`/doctor/prescription/${appt.id}`)}
                    >
                      View Prescription
                    </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="primary"
                          className="me-2"
                          onClick={() =>
                            updateAppointmentStatus(
                              appt.id,
                              "Accepted",
                              appt.patientEmail,
                              appt.patientName,
                              appt.date,
                              appt.slot
                            )
                          }
                        >
                          Accept
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => updateAppointmentStatus(appt.id, "Canceled")}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="text-center mt-3">No appointments found.</p>
        )}
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Write Prescription</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {medicines.map((med, index) => (
              <div key={index} className="mb-2">
                <strong>{med.name}</strong> - {med.dosage}, {med.mealTiming},
              </div>
            ))}
            <Form.Group>
              <Form.Label>Medicine Name</Form.Label>
              <Form.Control type="text" value={newMedicine.name} onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Dosage Frequency</Form.Label>
              <Form.Control as="select" value={newMedicine.dosage} onChange={(e) => setNewMedicine({ ...newMedicine, dosage: e.target.value })}>
                <option value="">Select</option>
                <option value="Once a day">Once a day</option>
                <option value="Twice a day">Twice a day</option>
                <option value="Thrice a day">Thrice a day</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Meal Timing</Form.Label>
              <Form.Control as="select" value={newMedicine.mealTiming} onChange={(e) => setNewMedicine({ ...newMedicine, mealTiming: e.target.value })}>
                <option value="">Select</option>
                <option value="Before Meals">Before Meals</option>
                <option value="After Meals">After Meals</option>
              </Form.Control>
            </Form.Group>
            <Button className="mt-2" onClick={addMedicine}>Add Medicine</Button>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Next Appointment Date</Form.Label>
              <Form.Control type="date" value={nextAppointmentDate} min={new Date().toISOString().split('T')[0]} onChange={(e) => setNextAppointmentDate(e.target.value)} />
            </Form.Group>
            <Button className="mt-3" onClick={handleSubmitPrescription}>Submit</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ViewAppointment;
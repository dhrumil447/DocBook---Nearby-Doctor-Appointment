import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Table, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const AdminViewAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchDate, setSearchDate] = useState("");

  // Convert YYYY-MM-DD to DD-MM-YYYY
  const formatDate = (date) => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/appointments`);
        
        const appointmentsWithDetails = await Promise.all(
          res.data.map(async (appt) => {
            try {
              const patientRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/patients/${appt.patientId}`);
              const doctorRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/doctors/${appt.doctorId}`);
              const paymentRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/Payment?appointmentId=${appt.id}`);

              // Check if payment data exists
              const paymentData = paymentRes.data.length > 0 ? paymentRes.data[0] : { razorpayId: "N/A", paymentMethod: "N/A" };

              return {
                ...appt,
                patientName: patientRes.data.username,
                patientPhone: patientRes.data.phone,
                patientEmail: patientRes.data.email,
                doctorName: doctorRes.data.username,
                formattedDate: formatDate(appt.date),
                razorpayId: paymentData.razorpayId,
                paymentMethod: paymentData.paymentMethod,
              };
            } catch (err) {
              console.error("Error fetching details:", err);
              return { 
                ...appt, 
                patientName: "Unknown", 
                doctorName: "Unknown", 
                patientPhone: "-", 
                patientEmail: "-", 
                formattedDate: formatDate(appt.date),
                razorpayId: "N/A",
                paymentMethod: "N/A",
              };
            }
          })
        );

        setAppointments(appointmentsWithDetails);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      }
    };

    fetchAppointments();
  }, []);

  // Cancel appointment
  const cancelAppointment = async (id) => {
    try {
      await axios.patch(`${import.meta.env.VITE_BASE_URL}/appointments/${id}`, { status: "Canceled" });
      setAppointments((prev) =>
        prev.map((appt) => (appt.id === id ? { ...appt, status: "Canceled" } : appt))
      );
      toast.success("Appointment canceled successfully!");
    } catch (err) {
      console.error("Error canceling appointment:", err);
      toast.error("Failed to cancel appointment.");
    }
  };

  // Filter Appointments based on search query & date
  const filteredAppointments = appointments.filter((appt) => {
    return (
      (appt.id.toString().includes(searchQuery) || 
      appt.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appt.patientName.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (searchDate ? appt.date === formatDate(searchDate) : true)
    );
  });

  // Generate PDF Report
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Doctor Appointments Report", 14, 10);

    const tableColumn = ["App.ID", "Patient", "Doctor", "Date", "Time Slot", "Payment Method", "Payment ID", "Status"];
    const tableRows = [];

    filteredAppointments.forEach(appt => {
      const rowData = [
        appt.id,
        appt.patientName,
        `Dr. ${appt.doctorName}`,
        appt.formattedDate,
        appt.slot,
        appt.paymentMethod,
        appt.razorpayId,
        appt.status || "Pending"
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 20 });

    doc.save("Appointments_Report.pdf");
  };

  return (
    <div className="container mt-4">
      <Card className="p-3" style={{ fontSize: "13px" }}>
        <h4 className="text-center fw-bold">All Doctor Appointments (Admin View)</h4>

        <div className="d-flex gap-2">
          <Form.Control
            type="text"
            placeholder="Search by ID, Doctor Name, or Patient Name..."
            className="mt-3 mb-3"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Form.Control
            type="date"
            className="mt-3 mb-3"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
          />
          <Button className="mt-3 mb-3" onClick={generatePDF} variant="success">Download PDF</Button>
        </div>

        {filteredAppointments.length > 0 ? (
          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>App.ID</th>
                <th>Patient Name</th>
                <th>Dr. Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Date</th>
                <th>Time Slot</th>
                <th>Payment Method/ID</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appt) => (
                <tr key={appt.id}>
                  <td>{appt.id}</td>
                  <td>{appt.patientName}</td>
                  <td>Dr. {appt.doctorName}</td>
                  <td>{appt.patientEmail}</td>
                  <td>{appt.patientPhone}</td>
                  <td>{appt.date}</td>
                  <td>{appt.slot}</td>
                  <td>{appt.paymentMethod}<br/>{appt.razorpayId}</td>
                  <td>{appt.status || "Pending"}</td>
                  <td>
                    {appt.status === "Canceled" ? (
                      <Button variant="danger" disabled> Canceled </Button>
                    ) : (
                      <Button variant="danger" onClick={() => cancelAppointment(appt.id)}>
                        Cancel
                      </Button>
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
    </div>
  );
};

export default AdminViewAppointments;

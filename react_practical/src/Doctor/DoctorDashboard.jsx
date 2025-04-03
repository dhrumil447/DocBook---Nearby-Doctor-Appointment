import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Row, Col, Table } from "react-bootstrap";
import moment from "moment";

const DoctorDashboard = () => {
  const [doctorId, setDoctorId] = useState(""); // Logged-in doctor ID
  const [todayAppointments, setTodayAppointments] = useState(0);
  const [totalAppointments, setTotalAppointments] = useState([]); // Initialize as an array
  const [totalPatients, setTotalPatients] = useState(0);
  const [revenue, setRevenue] = useState(0); // Total revenue

  useEffect(() => {
    const loggedInDoctorId = JSON.parse(sessionStorage.getItem("DocBook"))?.id;
    if (loggedInDoctorId) {
      setDoctorId(loggedInDoctorId);
      fetchDashboardData(loggedInDoctorId);
    }
  }, []);

 const fetchDashboardData = async (doctorId) => {
  try {
    // Fetch today's appointments
    const todayResponse = await axios.get(`${import.meta.env.VITE_BASE_URL}/appointments?doctorId=${doctorId}&date=${moment().format("YYYY-MM-DD")}`);
    setTodayAppointments(todayResponse.data.length);

    // Fetch total appointments
    const totalAppointmentsResponse = await axios.get(`${import.meta.env.VITE_BASE_URL}/appointments?doctorId=${doctorId}`);
    setTotalAppointments(totalAppointmentsResponse.data);

    // Fetch total patients (only those with "Accepted" appointments)
    const acceptedAppointments = totalAppointmentsResponse.data.filter((appointment) => appointment.status === "Accepted");
    const uniquePatients = Array.from(new Set(acceptedAppointments.map((appointment) => appointment.patientId)))
      .map((patientId) => acceptedAppointments.find((appointment) => appointment.patientId === patientId));
    setTotalPatients(uniquePatients.length);

    // Calculate total revenue (sum of doctor fees for all accepted appointments)
    const totalRevenue = acceptedAppointments.reduce((sum, appointment) => {
      // Convert doctorFees (string) to number using parseFloat
      const fee = parseFloat(appointment.doctorFees);
      if (!isNaN(fee)) {
        return sum + fee; // Add the fee to the total revenue
      }
      return sum; // If it's not a valid number, skip it
    }, 0); // Initial value is 0 for sum
    setRevenue(totalRevenue); // Set total revenue in the state
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  }
};

  

  return (
    <div className="container mt-4">
      <h2 className="text-center" style={{ color: "#0056b3" }}>Doctor Dashboard</h2>

      <Row className="mt-4">
        {/* Today's Appointments */}
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Today's Appointments</Card.Title>
              <Card.Text>{todayAppointments}</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Total Appointments */}
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Total Appointments</Card.Title>
              <Card.Text>{totalAppointments.length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Total Patients with Accepted Appointments */}
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Total Patients</Card.Title>
              <Card.Text>{totalPatients}</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Total Revenue */}
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Total Revenue</Card.Title>
              <Card.Text>{revenue}</Card.Text> {/* Display revenue */}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Detailed Table for Appointments */}
     
    </div>
  );
};

export default DoctorDashboard;

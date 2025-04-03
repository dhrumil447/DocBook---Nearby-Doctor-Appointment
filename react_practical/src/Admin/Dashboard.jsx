import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Col, Container, Row } from "react-bootstrap";
import { FaUserMd, FaUsers, FaMoneyBillWave, FaStar, FaClipboardList, FaCashRegister } from "react-icons/fa";

const AdminDashboard = () => {
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalOnlinePayments, setTotalOnlinePayments] = useState(0);
  const [totalCODPayments, setTotalCODPayments] = useState(0);
  const [topDoctor, setTopDoctor] = useState(null);
  const [highestRatedDoctor, setHighestRatedDoctor] = useState(null);

  useEffect(() => {
    fetchDoctors();
    fetchPatients();
    fetchPayments();
    fetchTopDoctor();
    fetchHighestRatedDoctor();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/doctors`);
      setTotalDoctors(res.data.length);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/patients`);
      setTotalPatients(res.data.length);
    } catch (err) {
      console.error("Error fetching patients:", err);
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/payments`);
      const payments = res.data || [];

      const onlineTotal = payments.filter((p) => p.method === "Online").reduce((sum, p) => sum + p.amount, 0);
      const codTotal = payments.filter((p) => p.method === "COD").reduce((sum, p) => sum + p.amount, 0);

      setTotalOnlinePayments(onlineTotal);
      setTotalCODPayments(codTotal);
    } catch (err) {
      console.error("Error fetching payments:", err);
    }
  };

  const fetchTopDoctor = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/appointments`);
      const appointments = res.data || [];

      const doctorCount = appointments.reduce((acc, app) => {
        acc[app.doctorId] = (acc[app.doctorId] || 0) + 1;
        return acc;
      }, {});

      const topDoctorId = Object.keys(doctorCount).reduce((a, b) => (doctorCount[a] > doctorCount[b] ? a : b), null);

      if (topDoctorId) {
        const doctorRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/doctors/${topDoctorId}`);
        setTopDoctor(doctorRes.data);
      }
    } catch (err) {
      console.error("Error fetching top doctor:", err);
    }
  };

  const fetchHighestRatedDoctor = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/reviews`);
      const reviews = res.data || [];

      const doctorRatings = reviews.reduce((acc, review) => {
        acc[review.doctorId] = acc[review.doctorId] || { total: 0, count: 0 };
        acc[review.doctorId].total += review.rating;
        acc[review.doctorId].count += 1;
        return acc;
      }, {});

      const highestRatedId = Object.keys(doctorRatings).reduce((a, b) =>
        doctorRatings[a].total / doctorRatings[a].count > doctorRatings[b].total / doctorRatings[b].count ? a : b
      );

      if (highestRatedId) {
        const doctorRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/doctors/${highestRatedId}`);
        setHighestRatedDoctor({ ...doctorRes.data, rating: (doctorRatings[highestRatedId].total / doctorRatings[highestRatedId].count).toFixed(1) });
      }
    } catch (err) {
      console.error("Error fetching highest-rated doctor:", err);
    }
  };

  return (
    <Container className="mt-4">
      <h3 className="mb-4">Admin Dashboard</h3>
      <Row>
        <Col md={4}>
          <Card className="shadow-lg p-3">
            <Card.Body className="d-flex align-items-center">
              <FaUserMd size={40} className="text-primary me-3" />
              <div>
                <h5>Total Doctors</h5>
                <h3>{totalDoctors}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-lg p-3">
            <Card.Body className="d-flex align-items-center">
              <FaUsers size={40} className="text-success me-3" />
              <div>
                <h5>Total Patients</h5>
                <h3>{totalPatients}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-lg p-3">
            <Card.Body className="d-flex align-items-center">
              <FaMoneyBillWave size={40} className="text-warning me-3" />
              <div>
                <h5>Total Online Payments</h5>
                <h3>₹{totalOnlinePayments}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={4}>
          <Card className="shadow-lg p-3">
            <Card.Body className="d-flex align-items-center">
              <FaCashRegister size={40} className="text-danger me-3" />
              <div>
                <h5>Total COD Payments</h5>
                <h3>₹{totalCODPayments}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-lg p-3">
            <Card.Body className="d-flex align-items-center">
              <FaClipboardList size={40} className="text-info me-3" />
              <div>
                <h5>Most Appointments</h5>
                <h6>{topDoctor ? `Dr. ${topDoctor.username}` : "No data"}</h6>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-lg p-3">
            <Card.Body className="d-flex align-items-center">
              <FaStar size={40} className="text-warning me-3" />
              <div>
                <h5>Highest Rated Doctor</h5>
                <h6>{highestRatedDoctor ? `Dr. ${highestRatedDoctor.username} (${highestRatedDoctor.rating} ⭐)` : "No data"}</h6>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, Form } from "react-bootstrap";

const AdminReview = () => {
  const [reviews, setReviews] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    fetchReviews();
    fetchDoctors();
    fetchPatients();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/reviews`);
      setReviews(res.data || []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/doctors`);
      setDoctors(res.data || []);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/patients`);
      setPatients(res.data || []);
    } catch (err) {
      console.error("Error fetching patients:", err);
    }
  };

  const handleUpdateStatus = async (reviewId, status) => {
    try {
      await axios.patch(`${import.meta.env.VITE_BASE_URL}/reviews/${reviewId}`, {
        status: status,
      });
      fetchReviews();
    } catch (err) {
      console.error(`Error updating review status to ${status}:`, err);
    }
  };

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find((doc) => doc.id === doctorId);
    return doctor ? doctor.username : "Unknown Doctor";
  };

  const getPatientName = (patientId) => {
    const patient = patients.find((pat) => pat.id === patientId);
    return patient ? patient.username : "Unknown Patient";
  };

  return (
    <div className="container mt-4">
      <h3>Admin Review Management</h3>

      {/* Filter Dropdown */}
      <Form.Group className="mb-3">
        <Form.Label>Filter Reviews:</Form.Label>
        <Form.Select onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Canceled">Canceled</option>
        </Form.Select>
      </Form.Group>

      {/* Review Table */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Doctor Name</th>
            <th>Patient Name</th>
            <th>Rating</th>
            <th>Review</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews
            .filter((review) => filterStatus === "All" || review.status === filterStatus)
            .map((review) => (
              <tr key={review.id}>
                <td>{getDoctorName(review.doctorId)}</td>
                <td>{getPatientName(review.patientId)}</td>
                <td>{review.rating} ⭐</td>
                <td>{review.comment}</td>
                <td>{review.status}</td>
                <td>
                  {review.status === "Pending" && (
                    <>
                      <Button variant="success" size="sm" onClick={() => handleUpdateStatus(review.id, "Approved")}>
                        Approve
                      </Button>{" "}
                      <Button variant="danger" size="sm" onClick={() => handleUpdateStatus(review.id, "Canceled")}>
                        Cancel
                      </Button>
                    </>
                  )}
                  {review.status === "Approved" && (
                    <Button variant="warning" size="sm" onClick={() => handleUpdateStatus(review.id, "Canceled")}>
                      Cancel Approval
                    </Button>
                  )}
                  {review.status === "Canceled" && (
                    <Button variant="primary" size="sm" onClick={() => handleUpdateStatus(review.id, "Approved")}>
                      Re-Approve
                    </Button>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminReview;

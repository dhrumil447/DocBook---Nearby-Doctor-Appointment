import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table } from "react-bootstrap";

const DoctorReviews = () => {
  const [reviews, setReviews] = useState([]);
    const [patients, setPatients] = useState([]);
  
  const doctorId = JSON.parse(sessionStorage.getItem("DocBook"))?.id;

   const fetchPatients = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/patients`);
        setPatients(res.data || []);
      } catch (err) {
        console.error("Error fetching patients:", err);
      }
    };
  const getPatientName = (patientId) => {
    const patient = patients.find((pat) => pat.id === patientId);
    return patient ? patient.username : "Unknown Patient";
  };
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/reviews`);
        const approvedReviews = res.data.filter(
          (review) => review.status === "Approved" && review.doctorId === doctorId
        );
        setReviews(approvedReviews);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };
    fetchPatients();

    if (doctorId) {
      fetchReviews();
    }
  }, [doctorId]);

  return (
    <Container className="mt-4">
      <h2 className="fw-bold text-center">Your Patient Reviews</h2>
      {reviews.length === 0 ? (
        <p className="text-center">No reviews available.</p>
      ) : (
        <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>Sr.NO</th>
            <th>Patient Name</th>
            <th>Rating</th>
            <th>Review</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review, index) => (
            <tr key={review.id}>
              <td>{index + 1}</td>
              <td>{getPatientName(review.patientId)}</td>
              <td>{review.rating} ⭐</td>
              <td>{review.comment}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      )}
    </Container>
  );
};

export default DoctorReviews;

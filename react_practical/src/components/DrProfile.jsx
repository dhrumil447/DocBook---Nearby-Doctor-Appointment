import React, { useEffect, useState } from "react";
import { Modal, Button, Card, Row, Col, Form } from "react-bootstrap";
import { MdVerified, MdStar, MdStarBorder } from "react-icons/md";
import axios from "axios";

const DoctorProfileModal = ({ show, handleClose, doctor }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [patientName, setPatientName] = useState("");

  useEffect(() => {
    if (doctor) {
      fetchReviews();
    }
  }, [doctor]);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/reviews?doctorId=${doctor.id}`);
      const reviewsWithNames = await Promise.all(
        res.data.map(async (review) => {
          try {
            const patientRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/patients/${review.patientId}`);
            return { ...review, patientName: patientRes.data.username };
          } catch (err) {
            console.error("Error fetching patient details:", err);
            return { ...review, patientName: "Unknown" };
          }
        })
      );

      setReviews(reviewsWithNames);
      calculateAverageRating(reviewsWithNames);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) {
      setAverageRating(0);
      return;
    }
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    setAverageRating(totalRating / reviews.length);
  };

 

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Doctor Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {doctor && (
          <Card className="shadow p-3 rounded">
            <Row>
              <Col md={4} className="text-center">
                <img
                  src={doctor.profileimg}
                  alt="Profile"
                  className="rounded mb-3"
                  style={{ width: "150px", height: "150px", objectFit: "cover" }}
                />
                <h5 className="fw-bold">Dr. {doctor.username}</h5>
                <MdVerified className="mb-1" /> Medical Registration Verified
                <p className="text-muted">{doctor.specialization}</p>
                <p><strong>Average Rating:</strong> {averageRating.toFixed(1)} ⭐ ({reviews.length} reviews)</p>
              </Col>
              <Col md={8}>
                <Row className="mb-2">
                  <Col><strong>Email:</strong> {doctor.email}</Col>
                  <Col><strong>Phone:</strong> {doctor.phone}</Col>
                </Row>
                <Row className="mb-2">
                  <Col><strong>Gender:</strong> {doctor.gender}</Col>
                  <Col><strong>Age:</strong> {doctor.age}</Col>
                </Row>
                <Row className="mb-2">
                  <Col><strong>Qualification:</strong> {doctor.qualification}</Col>
                  <Col><strong>Experience:</strong> {doctor.experience} yrs</Col>
                </Row>
                <Row className="mb-2">
                  <Col><strong>Clinic Name:</strong> {doctor.clinicName}</Col>
                  <Col><strong>Fees:</strong> ₹{doctor.fees}</Col>
                </Row>
                <Row className="mb-2">
                  <Col><strong>Clinic Address:</strong> {doctor.clinicAddress}</Col>
                </Row>
              </Col>
            </Row>
          </Card>
        )}
        {/* Display Reviews */}
        <h5 className="mt-4">Patient Reviews</h5>
{reviews.length === 0 ? (
  <p>No reviews yet.</p>
) : (
  <Row>
    {reviews.map((review, index) => (
      <Col md={6} key={index} className="mb-2">
        <Card className="p-2 h-100">
          <p><strong>{review.patientName}</strong></p>
          <p>
            {Array.from({ length: 5 }, (_, i) => (
              i < review.rating ? <MdStar key={i} className="text-warning" /> : <MdStarBorder key={i} />
            ))}
          </p>
          <p>{review.comment}</p>
          <small className="text-muted">{new Date(review.date).toLocaleString()}</small>
        </Card>
      </Col>
    ))}
  </Row>
)}

      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DoctorProfileModal;

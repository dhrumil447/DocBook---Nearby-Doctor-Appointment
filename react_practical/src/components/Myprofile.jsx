import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, Button, Nav, Badge, Modal, Form } from 'react-bootstrap';
import { FaUserEdit, FaTrash, FaSignOutAlt, FaCalendarCheck, FaStar } from 'react-icons/fa';

const PatientProfile = () => {
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState({ recent: [], past: [], older: [] });
  const [activeTab, setActiveTab] = useState("profile");
  const [reviewedAppointments, setReviewedAppointments] = useState({});
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const patientData = JSON.parse(sessionStorage.getItem("DocBook"));
    if (!patientData?.id) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [patientRes, appointmentsRes, reviewsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BASE_URL}/patients/${patientData.id}`),
          axios.get(`${import.meta.env.VITE_BASE_URL}/appointments?patientId=${patientData.id}`),
          axios.get(`${import.meta.env.VITE_BASE_URL}/reviews?patientId=${patientData.id}`)
        ]);

        setPatient(patientRes.data);

        const reviewedMap = {};
        reviewsRes.data.forEach(review => {
          reviewedMap[review.appointmentId] = true;
        });
        setReviewedAppointments(reviewedMap);

        const appointmentsWithDoctors = await Promise.all(
          appointmentsRes.data.map(async (appointment) => {
            try {
              const doctorRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/doctors/${appointment.doctorId}`);
              return {
                ...appointment,
                doctor: doctorRes.data,
                convertedDate: new Date(appointment.date.split("-").reverse().join("-"))
              };
            } catch {
              return {
                ...appointment,
                doctor: { username: "Unknown", specialization: "Unknown", clinicName: "N/A", clinicAddress: "N/A" }
              };
            }
          })
        );

        const now = new Date();
        const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
        const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));

        setAppointments({
          recent: appointmentsWithDoctors.filter(app => app.convertedDate >= oneWeekAgo),
          past: appointmentsWithDoctors.filter(app => app.convertedDate < oneWeekAgo && app.convertedDate >= oneMonthAgo),
          older: appointmentsWithDoctors.filter(app => app.convertedDate < oneMonthAgo),
        });

      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [navigate]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAppointment) return;

    const reviewData = {
      doctorId: selectedAppointment.doctorId,
      patientId: patient.id,
      appointmentId: selectedAppointment.id,
      rating,
      comment,
      status:"Pending",
      date: new Date().toISOString(),
    };

    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/reviews`, reviewData);
      setReviewedAppointments(prev => ({ ...prev, [selectedAppointment.id]: true }));
      setShowReviewModal(false);
      setRating(0);
      setComment("");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review.");
    }
  };

  const renderAppointments = (appointmentsList = [], title) => (
    <div>
      <h5 className="fw-bold mt-3">{title}</h5>
      {appointmentsList.length === 0 ? (
        <p>No {title.toLowerCase()} found.</p>
      ) : (
        appointmentsList.map((appointment) => (
          <Card key={appointment.id} className="mb-3 shadow-sm">
            <Card.Body>
              <h5 className="fw-bold">{appointment.doctor.username}</h5>
              <p><strong>Specialization:</strong> {appointment.doctor.specialization}</p>
              <p><strong>Clinic Name:</strong> {appointment.doctor.clinicName}</p>
              <p><strong>Clinic Address:</strong> {appointment.doctor.clinicAddress}</p>
              <p><strong>Date:</strong> {appointment.date} | <strong>Time:</strong> {appointment.slot}</p>
              <Badge bg={appointment.status === "Accepted" ? "success" : appointment.status === "Cancelled" ? "danger" : "warning"}>
                {appointment.status}
              </Badge>
              {appointment.status === "Accepted" && (
                <Button
                  variant={reviewedAppointments[appointment.id] ? "secondary" : "success"}
                  className="float-end"
                  onClick={() => {
                    setSelectedAppointment(appointment);
                    setShowReviewModal(true);
                  }}
                  disabled={reviewedAppointments[appointment.id]}
                >
                  {reviewedAppointments[appointment.id] ? "Reviewed" : "Give Review"}
                </Button>
              )}
             
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );

  return (
    <div>
      <Card className="p-4" style={{ background: '#fdfaee', border: "0px", borderRadius: "10px" }}>
        <Card.Body>
          <Nav variant="tabs" activeKey={activeTab} onSelect={setActiveTab}>
            <Nav.Item>
              <Nav.Link eventKey="profile"><FaUserEdit /> Profile</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="appointments"><FaCalendarCheck /> Appointments</Nav.Link>
            </Nav.Item>
          </Nav>

          <div className="p-3">
            {activeTab === "profile" && patient && (
              <div>
                <h4 className="fw-bold text-primary">{patient.username}</h4>
                <p><strong>Age:</strong> {patient.age}</p>
                <p><strong>Gender:</strong> {patient.gender}</p>
                <p><strong>Phone:</strong> {patient.phone}</p>
                <p><strong>Email:</strong> {patient.email}</p>
                <Button variant="primary" className="mt-3" onClick={() => navigate(`/edit-profile/${patient.id}`)}>
                  <FaUserEdit /> Edit Profile
                </Button>
              </div>
            )}

            {activeTab === "appointments" && (
              <div>
                {renderAppointments(appointments.recent, "Upcoming Appointments")}
                {renderAppointments(appointments.past, "Past Appointments (Last Week)")}
                {renderAppointments(appointments.older, "Older Appointments (1+ Month)")}
              </div>
            )}
          </div>
        </Card.Body>
      </Card>

      <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Give Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleReviewSubmit}>
            <Form.Group>
              <Form.Label>Rating:</Form.Label>
              <div className="d-flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    size={24}
                    className="me-2"
                    color={star <= rating ? "gold" : "gray"}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Comment:</Form.Label>
              <Form.Control as="textarea" rows={3} value={comment} onChange={(e) => setComment(e.target.value)} />
            </Form.Group>
            <Button type="submit" variant="primary" className="mt-3">Submit Review</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PatientProfile;

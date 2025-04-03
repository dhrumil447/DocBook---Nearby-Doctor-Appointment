import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, Col, Container, Row, Form, InputGroup, ListGroup } from "react-bootstrap";
import { MdVerified } from "react-icons/md";
import { FaEye, FaFilter } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import SlotSelectionModal from "./SlotSelectionModal";
import DoctorProfileModal from "./DrProfile";

const Finddoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [slots, setSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [reviews, setReviews] = useState([]);


  const getData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/doctors`);
      const doctorList = Array.isArray(res.data) ? res.data : res.data.doctors || [];
      setDoctors(doctorList);
      setFilteredDoctors(doctorList);
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setDoctors([]);
      setFilteredDoctors([]);
    }
  };

  const getSlots = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/slots`);
      setSlots(res.data || []);
    } catch (err) {
      console.error("Error fetching slots:", err);
      setSlots([]);
    }
  };

  useEffect(() => {
    getData();
    getSlots();
  }, []);

  const filterDoctors = () => {
    let updatedList = doctors;
    if (selectedCity) {
      updatedList = updatedList.filter(
        (doctor) =>
          doctor.city === selectedCity || doctor.clinicAddress.includes(selectedCity)
      );
    }
    if (selectedSpecialization) {
      updatedList = updatedList.filter((doctor) => doctor.specialization === selectedSpecialization);
    }

    if (searchName) {
      updatedList = updatedList.filter(
        (doctor) => doctor.username.toLowerCase().includes(searchName.toLowerCase())
      );
    }
    setFilteredDoctors(updatedList);
  };

  useEffect(() => {
    filterDoctors();
  }, [selectedCity, selectedSpecialization,searchName]);

  const handleViewProfile = (doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
  };

  const handleBookAppointment = (doctor) => {
    const patientId = JSON.parse(sessionStorage.getItem("DocBook"))?.id;
    if (!patientId) {
      navigate("/login");
      return;
    }
    setSelectedDoctor(doctor);
    const doctorSlots = slots.find(slot => slot.doctor_id === doctor.id);
    setSelectedSlots(doctorSlots ? doctorSlots.availableSlots : []);
    setShowSlotModal(true);
  };

  const specializations = [...new Set(doctors.map(doc => doc.specialization))];

  

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/reviews`);
      const approvedReviews = res.data.filter((review) => review.status === "Approved");
      setReviews(approvedReviews);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

const getAverageRating = (doctorId) => {
  const doctorReviews = reviews.filter((review) => review.doctorId === doctorId);
  if (doctorReviews.length === 0) return "No reviews yet";
  
  const totalRating = doctorReviews.reduce((sum, review) => sum + review.rating, 0);
  return `${(totalRating / doctorReviews.length).toFixed(1)} ⭐ (${doctorReviews.length} reviews)`;
};

useEffect(() => {
  fetchReviews();
}, []);


  return (
    <div>
      <Container fluid>
        <div
          style={{
            backgroundImage: "url('./src/assets/finddr.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "400px",
            display: "flex",
            color: "black",
            position: "relative",
            width: "100%",
          }}
        >
          <Container className="ms-5" style={{ marginTop: "100px" }}>
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <h2 className="fw-bold text-dark">Find the Right Doctor for Your Needs</h2>
              <p className="text-secondary">Quickly connect with expert healthcare professionals.</p>

              <Row className=" mt-4">
                <Col xs={12} md={8} lg={6}>
                  <InputGroup>
                  <Form.Control
    type="text"
    placeholder="Search by Doctor Name"
    value={searchName}
    onChange={(e) => setSearchName(e.target.value)}
  />
                    <Form.Select onChange={(e) => setSelectedCity(e.target.value)}>
                      <option value="" disabled>City</option>
                      <option value="Prahlad Nagar">Prahlad Nagar</option>
                              <option value="Gota">Gota</option>
                              <option value="Naroda">Naroda</option>
                              <option value="Satellite">Satellite</option>
                              <option value="Bopal">Bopal</option>
                              <option value="Maninagar">Maninagar</option>
                              <option value="Navrangpura">Navrangpura</option>
                              <option value="Vastrapur">Vastrapur</option>
                              <option value="Naranpura">Naranpura</option>
                              <option value="Chandkheda">Chandkheda</option>
                              <option value="Thaltej">Thaltej</option>
                              <option value="SG Highway">SG Highway</option>
                              <option value="Ashram Road">Ashram Road</option>
                              <option value="Memnagar">Memnagar</option>
                              <option value="Ellisbridge">Ellisbridge</option>
                              <option value="Shahibaug">Shahibaug</option>
                              <option value="Kalupur">Kalupur</option>
                              <option value="Isanpur">Isanpur</option>
                              <option value="Vasna">Vasna</option>
                              <option value="Jodhpur">Jodhpur</option>
                              <option value="Paldi">Paldi</option>
                              <option value="Ranip">Ranip</option>
                              <option value="Narol">Narol</option>
                              <option value="Vatva">Vatva</option>
                              <option value="Odhav">Odhav</option>
                              <option value="Sarkhej">Sarkhej</option>
                    </Form.Select>
                    <Form.Select onChange={(e) => setSelectedSpecialization(e.target.value)}>
                      <option value="">Doctor / Specialization</option>
                      {specializations.map((spec, index) => (
                        <option key={index} value={spec}>{spec}</option>
                      ))}
                    </Form.Select>
                  </InputGroup>
                </Col>
              </Row>
            </motion.div>
          </Container>
        </div>

        <Container fluid>
          <p className="mt-5 fs-5 fw-bold">Book appointments with minimum wait-time & verified doctor details</p>
          <Row className="m-5">
            <Col md={9}>
              {filteredDoctors.length > 0 && filteredDoctors.filter(doctor => doctor.status === "Accept").map((doctor, index) => (
                <Col md={11} sm={12} key={index} className="mb-4">
                  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
                    <Card className="d-flex flex-row align-items-center p-2 shadow-sm rounded-4 mb-2" style={{ height: "250px" }}>
                      <Card.Img variant="left" src={doctor.profileimg} className="me-3" style={{ width: "150px", height: "200px", objectFit: "cover", borderRadius: "8px" }} />
                      <Card.Body>
                        <Card.Title className="fw-bold mb-1">Dr. {doctor.username}</Card.Title>
                        <MdVerified className="mb-1" /> Medical Registration Verified
                        <Card.Text className="text-muted mb-1">{doctor.specialization}</Card.Text>
                        <Card.Text className="text-secondary">Consultation Fees {doctor.fees} </Card.Text>
                        <Card.Text className="text-secondary">
  Average Rating: {getAverageRating(doctor.id)}
</Card.Text>

                        <Card.Text className="text-secondary">Clinic Address: {doctor.clinicAddress}</Card.Text>
                      </Card.Body>
                      <Col md={3}>
                        <Button variant="info" size="sm" className="me-2 mt-3" onClick={() => handleViewProfile(doctor)}>
                          <FaEye /> View Profile
                        </Button>
                        <Button size="sm" className="mt-3" style={{ backgroundColor: "rgb(255, 240, 75)", border: "0px", color: "black" }} onClick={() => handleBookAppointment(doctor)}>
                          Book Appointment
                        </Button>
                      </Col>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Col>
            <Col md={3} className="shadow-lg p-4 rounded bg-white">
      <h5 className="fw-bold d-flex align-items-center">
        <FaFilter className="me-2 text-primary" /> Filter by Specialization
      </h5>
      <ListGroup className="mb-4">
        <ListGroup.Item 
          action 
          onClick={() => setSelectedSpecialization("")} 
          active={!selectedSpecialization}
          className="text-center"
        >
          All Specializations
        </ListGroup.Item>
        {specializations.map((spec, index) => (
          <ListGroup.Item 
            key={index} 
            action 
            onClick={() => setSelectedSpecialization(spec)} 
            active={selectedSpecialization === spec}
            className="text-center"
          >
            {spec}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Col>
          </Row>
        </Container>

        <DoctorProfileModal show={showModal} handleClose={() => setShowModal(false)} doctor={selectedDoctor} />
        <SlotSelectionModal show={showSlotModal} handleClose={() => setShowSlotModal(false)} slots={selectedSlots} doctor={selectedDoctor}/>
      </Container>
    </div>
  );
};

export default Finddoctor;

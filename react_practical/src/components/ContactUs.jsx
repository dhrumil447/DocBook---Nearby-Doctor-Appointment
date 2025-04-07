import React, { useState } from "react";
import axios from "axios"; // ✅ Import axios
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { toast } from "react-toastify";

const ContactUs = () => {
  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (e) => {
    setContactData({ ...contactData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/contacts`, contactData);
      toast("Message submitted successfully!");
      setContactData({ name: "", email: "", message: "" }); // Clear form
    } catch (error) {
      console.error("Error submitting message:", error);
      toast("Something went wrong. Try again.");
    }
  };

  return (
    <Container fluid style={{ backgroundColor: "#fdfaee", minHeight: "100vh", padding: "50px" }}>
      <Row className="justify-content-center">
        <Col md={5} className="mb-4">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Card style={{ backgroundColor: "#fff0bb", borderRadius: "12px", padding: "20px", boxShadow: "5px 5px 15px rgba(0,0,0,0.1)" }}>
              <h2 className="text-center mb-4" style={{ color: "#444" }}>Contact Us</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={contactData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={contactData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="message"
                    value={contactData.message}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Your message"
                    required
                  />
                </Form.Group>
                <Button variant="warning" className="w-100" style={{ backgroundColor: "#FFF04B", border: "none" }} type="submit">
                  Submit
                </Button>
              </Form>
            </Card>
          </motion.div>
        </Col>

        {/* Right Column - Location Info remains same */}
        <Col md={5} className="mb-4">
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Card style={{ backgroundColor: "#fff0bb", borderRadius: "12px", padding: "20px", boxShadow: "5px 5px 15px rgba(0,0,0,0.1)" }}>
              <h3 className="text-center mb-4" style={{ color: "#444" }}>Our Location</h3>
              <p><FaMapMarkerAlt color="red" /> 123 Street, Prahlad Nagar, Ahmedabad, India</p>
              <p><FaPhone color="green" /> +91 98765 43210</p>
              <p><FaEnvelope color="blue" /> support@docbook.com</p>
              <p><FaClock color="orange" /> Mon - Sat: 9 AM - 6 PM</p>
              <div className="mt-3">
                <iframe
                  title="Google Map"
                  src="https://www.google.com/maps/embed?pb=!1m18..."
                  width="100%"
                  height="250"
                  style={{ border: 0, borderRadius: "8px" }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactUs;

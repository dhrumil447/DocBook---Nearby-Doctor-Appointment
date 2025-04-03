import React from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";

const ContactUs = () => {
  return (
    <Container fluid style={{ backgroundColor: "#fdfaee", minHeight: "100vh", padding: "50px" }}>
      <Row className="justify-content-center">
        <Col md={5} className="mb-4">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Card style={{ backgroundColor: "#fff0bb", borderRadius: "12px", padding: "20px", boxShadow: "5px 5px 15px rgba(0,0,0,0.1)" }}>
              <h2 className="text-center mb-4" style={{ color: "#444" }}>Contact Us</h2>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter your name" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" placeholder="Enter your email" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Message</Form.Label>
                  <Form.Control as="textarea" rows={3} placeholder="Your message" />
                </Form.Group>
                <Button variant="warning" className="w-100" style={{ backgroundColor: "#FFF04B", border: "none" }}>
                  Submit
                </Button>
              </Form>
            </Card>
          </motion.div>
        </Col>

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
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3683.7220326977326!2d72.5115356749521!3d22.576243732499413!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e9b21f9a92121%3A0x9e313b7a60e4d97e!2sPrahlad%20Nagar%2C%20Ahmedabad%2C%20Gujarat%20380015!5e0!3m2!1sen!2sin!4v1711771234567"
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
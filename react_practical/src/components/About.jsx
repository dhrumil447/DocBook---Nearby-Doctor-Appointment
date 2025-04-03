import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";
import { FaUserMd, FaCalendarCheck, FaHeadset, FaLock, FaHospital, FaHeartbeat, FaFileMedical, FaShieldAlt } from "react-icons/fa";

const AboutDocBook = () => {
  return (
    <div style={{ backgroundColor: "#fff0bb", minHeight: "100vh", padding: "20px" }}>
      <Container>
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{ textAlign: "center", fontWeight: "bold" }}
        >
          About DocBook
        </motion.h1>

        {/* Mission & Vision Section */}
        <Row className="my-4">
          <Col md={6}>
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}>
              <Card style={{ backgroundColor: "#FFF04B", color: "#333", padding: "20px", borderRadius: "10px" }}>
                <Card.Body>
                  <Card.Title style={{ fontWeight: "bold" }}>Our Mission</Card.Title>
                  <Card.Text>
                    Our mission is to connect patients with nearby verified doctors seamlessly, ensuring trust and efficiency.
                  </Card.Text>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>

          <Col md={6}>
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}>
              <Card style={{ backgroundColor: "#FFF04B", color: "#333", padding: "20px", borderRadius: "10px" }}>
                <Card.Body>
                  <Card.Title style={{ fontWeight: "bold" }}>Our Vision</Card.Title>
                  <Card.Text>
                    To be the most trusted digital platform for effortless doctor appointment booking and medical consultations.
                  </Card.Text>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>

        {/* Key Features Section */}
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} style={{ textAlign: "center", color: "#333", fontWeight: "bold", marginTop: "20px" }}>
          Key Features
        </motion.h2>

        <Row className="my-4">
          {[
            { icon: <FaUserMd size={30} />, title: "Verified Doctors", text: "All doctors are verified to ensure quality healthcare." },
            { icon: <FaCalendarCheck size={30} />, title: "Easy Booking", text: "Book appointments with a single click." },
            { icon: <FaHeadset size={30} />, title: "24/7 Support", text: "We are here to help you anytime." },
            { icon: <FaLock size={30} />, title: "Secure Payments", text: "All transactions are encrypted and safe." },
            { icon: <FaHospital size={30} />, title: "Multi-Specialty Clinics", text: "Connect with specialists from various fields." },
            { icon: <FaHeartbeat size={30} />, title: "Health Monitoring", text: "Track your medical history and vitals easily." },
            { icon: <FaFileMedical size={30} />, title: "Digital Prescriptions", text: "Get prescriptions online for hassle-free treatment." },
            { icon: <FaShieldAlt size={30} />, title: "Privacy Protection", text: "Your data remains confidential and secure." },
          ].map((feature, index) => (
            <Col md={3} key={index} className="mb-4">
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: index * 0.2 }}>
                <Card style={{ backgroundColor: "#fff", color: "#333", padding: "15px", borderRadius: "10px", textAlign: "center", height:"180px" }}>
                  <Card.Body>
                    <div style={{ color: "#FFF04B" }}>{feature.icon}</div>
                    <Card.Title style={{ fontWeight: "bold" }}>{feature.title}</Card.Title>
                    <Card.Text>{feature.text}</Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* Why Choose DocBook? Section */}
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} style={{ textAlign: "center", color: "#333", fontWeight: "bold", marginTop: "20px" }}>
          Why Choose DocBook?
        </motion.h2>

        <Row className="my-4">
          <Col md={12}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
              <Card style={{ backgroundColor: "#FFF04B", color: "#333", padding: "20px", borderRadius: "10px" }}>
                <Card.Body>
                  <Card.Text>
                    DocBook simplifies the process of finding the best doctors nearby. With a user-friendly interface, real-time appointment booking, and comprehensive doctor verification, we ensure that your healthcare journey is smooth and hassle-free. Our platform integrates cutting-edge security measures to protect your data while offering convenient digital prescriptions and health records. Whether you need a consultation, a routine check-up, or emergency care, DocBook is your go-to healthcare companion.
                  </Card.Text>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AboutDocBook;
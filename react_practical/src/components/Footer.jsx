import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { motion } from "framer-motion";
import { hr } from "framer-motion/client";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-black py-4 "
      style={{ fontSize: "16px",backgroundColor: "#fdfaee"  }}
    ><hr/>
      <Container>
        <Row className="text-center text-md-start">
          {/* Branding */}
          <Col md={4} className="mb-3">
            <h5 className="fw-bold">DocBook</h5>
            <p>Your trusted healthcare companion.</p>
          </Col>

          {/* Quick Links */}
          <Col md={4} className="mb-3">
            <h5 className="fw-bold">Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/finddoctor" className="text-black text-decoration-none">Find a Doctor</a></li>
              <li><a href="/appointments" className="text-black text-decoration-none">Appointments</a></li>
              <li><a href="/contact" className="text-black text-decoration-none">Contact Us</a></li>
              <li><a href="/about" className="text-black text-decoration-none">About Us</a></li>
            </ul>
          </Col>

          {/* Social Media */}
          <Col md={4} className="text-center text-md-end">
            <h5 className="fw-bold">Follow Us</h5>
            <motion.div
              className="d-flex justify-content-center justify-content-md-end gap-3 text-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <a href="#" className="text-black fs-4"><FaFacebook /></a>
              <a href="#" className="text-black fs-4"><FaTwitter /></a>
              <a href="#" className="text-black fs-4"><FaInstagram /></a>
              <a href="#" className="text-black fs-4"><FaLinkedin /></a>
            </motion.div>
          </Col>
        </Row>

        <hr className="border-secondary mt-4" />

        {/* Copyright */}
        <Row>
          <Col className="text-center text-black">
            <p className="mb-0">&copy; {new Date().getFullYear()} DocBook. All Rights Reserved.</p>
          </Col>
        </Row>
      </Container>
    </motion.footer>
  );
};

export default Footer;

import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";

const ForgotPasswordModal = ({ show, handleClose }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleForgot = async (e) => {
    e.preventDefault();
    try {
      let userType = null;
      let user = null;

      // 1. Check in patients
      const patientRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/patients?email=${email}`);
      if (patientRes.data.length > 0) {
        userType = "patients";
        user = patientRes.data[0];
      }

      // 2. If not in patients, check in doctors
      if (!user) {
        const doctorRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/doctors?email=${email}`);
        if (doctorRes.data.length > 0) {
          userType = "doctors";
          user = doctorRes.data[0];
        }
      }

      if (!user) {
        setMessage("Email not found in our system.");
        return;
      }

      // Generate token and update user
      const token = Math.random().toString(36).substr(2);
      await axios.put(`${import.meta.env.VITE_BASE_URL}/${userType}/${user.id}`, {
        ...user,
        resetToken: token,
      });

      const resetLink = `http://localhost:7777/reset-password/${token}`;
      setMessage(`<a href="${resetLink}" target="_blank" rel="noopener noreferrer">${resetLink}</a>`);
      toast.success("Reset link generated!");

    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Forgot Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleForgot}>
          <Form.Group>
            <Form.Label>Enter your registered email</Form.Label>
            <Form.Control
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Button type="submit" variant="primary" className="mt-3 w-100">
            Send Reset Link
          </Button>
        </Form>

        {message && (
          <div className="mt-3 fw-bold" dangerouslySetInnerHTML={{ __html: message }} />
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ForgotPasswordModal;

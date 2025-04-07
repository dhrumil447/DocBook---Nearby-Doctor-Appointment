import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router"; // Fixed import
import { useForm } from 'react-hook-form';
import axios from "axios";
import ForgotPasswordModal from "./ForgotPasswordModal"; // Import modal

const Login = () => {
  const [show, setShow] = useState(false);
  const [showForgot, setShowForgot] = useState(false); // Modal state
  const navigate = useNavigate();
  const { register, handleSubmit, setFocus, formState: { errors } } = useForm();

  useEffect(() => {
    setFocus('email');
  }, [setFocus]);

  const loginUser = async (data) => {
    try {
      const patientRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/patients?email=${data.email}`);

      if (patientRes.data.length > 0) {
        const patient = patientRes.data[0];
        if (patient.password === data.password) {
          const { id, email, username, isAdmin } = patient;
          sessionStorage.setItem("DocBook", JSON.stringify({ id, email, username, isAdmin, isLoggedIn: true }));
          toast.success("Logged in Successfully");
          navigate(isAdmin ? '/admin' : '/');
        } else {
          toast.error("Invalid Credentials");
        }
      } else {
        const doctorRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/doctors?email=${data.email}`);

        if (doctorRes.data.length > 0) {
          const doctor = doctorRes.data[0];
          if (doctor.password === data.password) {
            const { id, email, username } = doctor;
            sessionStorage.setItem("DocBook", JSON.stringify({ id, email, username, isDoctor: true, isLoggedIn: true }));
            toast.success(`Logged in Successfully ${doctor.username}`);
            navigate('/doctor');
          } else {
            toast.error("Invalid Credentials");
          }
        } else {
          toast.error("Email not found");
        }
      }

    } catch (err) {
      toast.error("Login failed: " + err.message);
    }
  };

  return (
    <>
      <Container className="mt-5">
        <Card style={{
          maxWidth: "900px",
          margin: "auto",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}>
          <Row>
            <Col md={5} className="d-flex align-items-center justify-content-center">
              <div className="p-4">
                <video width="600" autoPlay loop muted height={300}>
                  <source src="https://res.cloudinary.com/dhrumil7/video/upload/v1743702698/log_jvllzo.mp4" type="video/mp4" />
                </video>
              </div>
            </Col>

            <Col md={7}>
              <h3 className="text-center text-warning fw-bold mt-3">Login Here</h3>
              <hr />
              <Form onSubmit={handleSubmit(loginUser)}>
                <Form.Group className="form-floating mb-4 mt-3">
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    {...register('email', { required: true })}
                  />
                  <Form.Label>Enter Email</Form.Label>
                  {errors.email && <span className="text-danger">Email is required</span>}
                </Form.Group>

                <Form.Group className='mb-3'>
                  <InputGroup>
                    <Form.Control
                      type={show ? "text" : "password"}
                      placeholder="Enter Password"
                      style={{ height: '55px' }}
                      {...register('password', { required: true })}
                    />
                    <Button variant='light' className='border' onClick={() => setShow(!show)}>
                      {show ? <BsEye /> : <BsEyeSlash />}
                    </Button>
                  </InputGroup>
                  {errors.password && <span className="text-danger">Password is required</span>}
                </Form.Group>

                <Button variant="warning" type="submit" className="w-100 fw-bold text-black">
                  Login
                </Button>

                <p className="text-end mt-3" style={{ fontSize: "13px" }}>
                  Don't have an account? <a href="/Register">Create a New Account</a>
                </p>

                <p className="text-end" style={{ fontSize: "13px" }}>
                  <span
                    style={{ cursor: "pointer", color: "#007bff" }}
                    onClick={() => setShowForgot(true)}
                  >
                    Forgot Password?
                  </span>
                </p>
              </Form>
            </Col>
          </Row>
        </Card>
      </Container>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal show={showForgot} handleClose={() => setShowForgot(false)} />
    </>
  );
};

export default Login;

import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { toast } from 'react-toastify';
import { Link, useNavigate } from "react-router"; 
import axios from "axios";
import { useForm } from 'react-hook-form'; 

const Login = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, setFocus, formState: { errors } } = useForm();

  // Focus email input on page load
  useEffect(() => {
    setFocus('email');
  }, [setFocus]);

  const loginUser = async (data) => {
    try {
      // 1. Check in patients table
      const patientRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/patients?email=${data.email}`);
  
      if (patientRes.data.length > 0) {
        const patient = patientRes.data[0];
        if (patient.password === data.password) {
          const { id, email, username, isAdmin } = patient;
  
          sessionStorage.setItem("DocBook", JSON.stringify({ id,email, username, isAdmin, isLoggedIn: true }));
  
          toast.success("Logged in Successfully ");
  
          navigate(isAdmin ? '/admin' : '/');  // Ternary for admin or normal user
        } else {
          toast.error("Invalid Credentials");
        }
  
      } else {
        // 2. If not patient, check in doctors table
        const doctorRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/doctors?email=${data.email}`);
  
        if (doctorRes.data.length > 0) {
          const doctor = doctorRes.data[0];
          if (doctor.password === data.password) {
            const { id, email, username } = doctor;
  
            sessionStorage.setItem("DocBook", JSON.stringify({ id, email, username, isDoctor: true, isLoggedIn: true }));
  
            toast.success(`Logged in Successfully ${doctor.username}`);
  
            navigate('/doctor');  // Redirect doctor
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
            <Col md={5} style={{display: "flex",alignItems: "center",justifyContent: "center",}}>
           
            <div className="p-4">
              <video width="600" autoPlay loop muted height={300}>
                <source src="https://res.cloudinary.com/dhrumil7/video/upload/v1743702698/log_jvllzo.mp4" type="video/mp4"  />
               
              </video>
            </div>
            </Col>

            <Col md={7}>
              <h3 style={{ textAlign: "center", color: "#FFF40B", fontWeight: "bold", marginTop: "30px" }}>Login Here</h3>
              <hr />
              <Form onSubmit={handleSubmit(loginUser)}>
                <Row>
                  <Col md={12}>
                    <Form.Group className="form-floating mb-4 mt-3">
                      <Form.Control type="email" placeholder="" {...register('email', { required: true })}/>
                      <Form.Label>Enter Email</Form.Label>
                      {errors.email && <span className="text-danger">Email is required</span>}
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <Form.Group className='mb-3'>
                      <InputGroup>
                        <Form.Control
                          type={show ? "text" : "password"} placeholder="Enter Password" style={{ height: '55px' }} {...register('password', { required: true })}/>
                        <Button variant='light' className='border' onClick={() => setShow(!show)}>
                          {show ? <BsEye /> : <BsEyeSlash />}
                        </Button>
                      </InputGroup>
                      {errors.password && <span className="text-danger">Password is required</span>}
                    </Form.Group>
                  </Col>
                </Row>

                <Button variant="warning" type="submit" style={{ width: '100%', fontSize: '16px', fontWeight: 'bold', color: 'black' }}>
                  Login
                </Button>

                <p className="text-md-center mt-3" style={{ textAlign: "right", fontSize: "13px" }}>
                  Don't have an account? <Link to="/Register">Create a New Account</Link>
                </p>
              </Form>
            </Col>
          </Row>
        </Card>
      </Container>
    </>
  );
};

export default Login;

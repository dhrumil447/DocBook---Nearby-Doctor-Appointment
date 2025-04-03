import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { selectpatients } from "../redux/patientSlice";

const EditPatient = () => {
  const [patient, setPatient] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const patients = useSelector(selectpatients);
  const patientEdit = patients.find((item) => item.id == id);
  const redirect = useNavigate();

  useEffect(() => {
    if (id) {
      setPatient({ ...patientEdit });
    } else {
      setPatient({
        username: "",
        email: "",
        phone: "",
        gender: "",
        age: "",
      });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, phone, gender, age } = patient;
    const pattern = /^[\w\.]+\@[\w]+\.[a-zA-Z]{3}$/;

    if (!username || !email || !phone || !gender || !age) {
      toast.error("Please fill all the fields");
    } else if (!pattern.test(email)) {
      toast.error("Invalid email");
    } else if (id) {
      try {
        await axios.put(`${import.meta.env.VITE_BASE_URL}/patients/${id}`, {
          ...patient,
          createdAt: patientEdit.createdAt,
          editedAt: new Date(),
        });
        toast.success("Patient details updated");
        redirect("/admin/patient");
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  return (
    <>
    <Container className="mt-3">
    <Row>
        <Col md={12}>
          <h3 className="text-info" style={{ textAlign: "left", fontWeight: "bold" }}>
            Edit Patients Details
            <button type="button" onClick={() => redirect('/admin/patient')} className="btn btn-info float-end">
              View Patient
            </button>
          </h3>
          <hr />
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="form-floating mb-3">
              <Form.Control
                type="text"
                name="fullName"
                placeholder=""
                value={patient.username}
                onChange={(e) =>
                  setPatient({ ...patient, username: e.target.value })
                }
              ></Form.Control>
              <Form.Label className="form-label">Enter Name</Form.Label>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="form-floating mb-3">
              <Form.Control
                type="email"
                name="email"
                placeholder=""
                value={patient.email}
                onChange={(e) =>
                  setPatient({ ...patient, email: e.target.value })
                }
              ></Form.Control>
              <Form.Label className="form-label">Enter Email</Form.Label>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={5}>
            <Form.Group className="form-floating mb-3">
              <Form.Control
                type="phone"
                name="phone"
                placeholder=""
                value={patient.phone}
                onChange={(e) =>
                  setPatient({ ...patient, phone: e.target.value })
                }
              ></Form.Control>
              <Form.Label className="form-label">Enter Phone Number</Form.Label>
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group className="form-floating mb-3">
              <Form.Control
                type="text"
                name="age"
                placeholder=""
                value={patient.age}
                onChange={(e) =>
                  setPatient({ ...patient, age: e.target.value })
                }
              ></Form.Control>
              <Form.Label className="form-label">Enter Age</Form.Label>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className=" mb-3">
              <Form.Select
                name="gender"
                style={{ height: "57px" }}
                value={patient.gender}
                onChange={(e) =>
                  setPatient({ ...patient, gender: e.target.value })
                }
              >
                <option value="" disabled>Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Button type="submit" className="btn-info" style={{ width: '100%', fontSize: '16px', fontWeight: 'bold', color: 'black', border: 0 }}>
                      {isLoading ? (
                        <div className="d-flex justify-content-center">
                          <div className="spinner-border" role="status"></div>
                        </div>
                      ) : 'Update Patient'}
                    </Button>
      </Form>
      </Col>
      </Row>
      </Container>
      </>
  );
};

export default EditPatient;

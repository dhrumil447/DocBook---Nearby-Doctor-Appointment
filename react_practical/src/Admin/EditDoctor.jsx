import { Button } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import { toast } from 'react-toastify';
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectdoctors } from "../redux/doctorSlice";

const EditDoctor = () => {
  const redirect = useNavigate();
  const [doctor, setDoctor] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { id } = useParams();
  const doctors = useSelector(selectdoctors);
  const doctorEdit = doctors.find(item => item.id == id);

  useEffect(() => {
    if (id) {
      setDoctor({ ...doctorEdit });
    } else {
      setDoctor({
        username: '',
        email: '',
        phone: '',
        gender: '',
        age: '',
        clinicName: '',
        clinicAddress: '',
        specialization: '',
        qualification: '',
        experience: '',
        fees: '',
        profileimg: '',
        status:'Pending',
        isDoctors: true
      });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, phone, gender, age, clinicName, clinicAddress, specialization, qualification, profileimg, experience, fees } = doctor;
    const pattern = /^[\w\.]+\@[\w]+\.[a-zA-Z]{3}$/;

    if (!username || !email || !phone || !gender || !age || !clinicName || !clinicAddress || !specialization || !qualification || !profileimg || !experience || !fees) {
      toast.error("Please fill all the fields");
    } else if (!pattern.test(email)) {
      toast.error("Invalid email");
    } else if (id) {
      // Update doctor
      try {
        await axios.put(`${import.meta.env.VITE_BASE_URL}/doctors/${id}`, {
          ...doctor,
          createdAt: doctorEdit.createdAt,
          editedAt: new Date()
        });
        toast.success("Doctor details updated");
        redirect('/admin/view');
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  const handleImage = async (e) => {
    const img = e.target.files[0];
    const ext = ["image/jpg", "image/jpeg", "image/png", "image/gif", "image/webp", "image/jfif", "image/avif"];

    if (!img) {
      toast.error("Please choose an image");
    } else if (img.size > 1048576) {
      toast.error("File size exceeded");
    } else if (!ext.includes(img.type)) {
      toast.error("Invalid file extension");
    } else {
      setIsLoading(true);
      const data = new FormData();
      data.append("file", img);
      data.append("cloud_name", "dhrumil7");
      data.append("upload_preset", "DocBook");
      data.append("folder", "Doctors");

      try {
        const res = await axios.post("https://api.cloudinary.com/v1_1/dhrumil7/image/upload", data);
        setDoctor({ ...doctor, profileimg: res.data.url });
        setIsLoading(false);
      } catch (err) {
        toast.error(err.message);
        setIsLoading(false);
      }
    }
  };

  return (
    <Container className="mt-3">
      <Row>
        <Col md={12}>
          <h3 className="text-info" style={{ textAlign: "left", fontWeight: "bold" }}>
            Edit Doctor
            <button type="button" onClick={() => redirect('/admin/view')} className="btn btn-info float-end">
              View Doctor
            </button>
          </h3>
          <hr />
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={4}>
                <Form.Group className="form-floating mb-2">
                  <Form.Control type="text" placeholder="" value={doctor.username} onChange={(e) => setDoctor({ ...doctor, username: e.target.value })} />
                  <Form.Label>Enter Name</Form.Label>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="form-floating mb-2">
                  <Form.Control type="email" placeholder="" value={doctor.email} onChange={(e) => setDoctor({ ...doctor, email: e.target.value })} />
                  <Form.Label>Enter Email</Form.Label>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="form-floating mb-2">
                  <Form.Control type="text" placeholder="" value={doctor.phone} onChange={(e) => setDoctor({ ...doctor, phone: e.target.value })} />
                  <Form.Label>Enter Phone Number</Form.Label>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={2}>
                <Form.Group className="form-floating mb-2">
                  <Form.Control type="text" placeholder="" value={doctor.age} onChange={(e) => setDoctor({ ...doctor, age: e.target.value })} />
                  <Form.Label>Enter Age</Form.Label>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-2">
                  <Form.Select value={doctor.gender} onChange={(e) => setDoctor({ ...doctor, gender: e.target.value })} style={{ height: '57px' }}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Select value={doctor.specialization} onChange={(e) => setDoctor({ ...doctor, specialization: e.target.value })} style={{ height: '57px' }}>
                  <option value="" disabled>Select Specialization</option>
                              <option>General Physician</option>
                              <option>Cardiologist</option>
                              <option>Dermatologist</option>
                              <option>Neurologist</option>
                              <option>Orthopedic Surgeon</option>
                              <option>Pediatrician</option>
                              <option>Psychiatrist</option>
                              <option>ENT Specialist</option>
                              <option>Gynecologist</option>
                              <option>Dentist</option>
                              <option>Urologist</option>
                              <option>Radiologist</option>
                              <option>Oncologist</option>
                              <option>Ophthalmologist</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-2">
                  <Form.Select value={doctor.qualification} onChange={(e) => setDoctor({ ...doctor, qualification: e.target.value })} style={{ height: '57px' }}>
                  <option value="" disabled>Select Qualification</option>
                      <option>MBBS</option>
                      <option>MD (Doctor of Medicine)</option>
                      <option>MS (Master of Surgery)</option>
                      <option>BDS (Bachelor of Dental Surgery)</option>
                      <option>MDS (Master of Dental Surgery)</option>
                      <option>DNB (Diplomate of National Board)</option>
                      <option>DM (Doctorate of Medicine)</option>
                      <option>M.Ch (Master of Chirurgiae)</option>
                      <option>BHMS (Homeopathy)</option>
                      <option>BAMS (Ayurveda)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="form-floating mb-2">
                  <Form.Control type="number" placeholder="" value={doctor.experience} onChange={(e) => setDoctor({ ...doctor, experience: e.target.value })} />
                  <Form.Label>Experience (Years)</Form.Label>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="form-floating mb-2">
                  <Form.Control type="number" placeholder="" value={doctor.fees} onChange={(e) => setDoctor({ ...doctor, fees: e.target.value })} />
                  <Form.Label>Consultation Fees</Form.Label>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="form-floating mb-2">
                  <Form.Control type="text" placeholder="" value={doctor.clinicName} onChange={(e) => setDoctor({ ...doctor, clinicName: e.target.value })} />
                  <Form.Label>Clinic Name</Form.Label>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="form-floating mb-2">
                  <Form.Control type="text" placeholder="" value={doctor.clinicAddress} onChange={(e) => setDoctor({ ...doctor, clinicAddress: e.target.value })} />
                  <Form.Label>Clinic Address</Form.Label>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-2">Profile Photo
                  <Form.Control type="file" accept='image/*' onChange={handleImage} />
                </Form.Group>
              </Col>
            </Row>

            <Button type="submit" className="btn-info" style={{ width: '100%', fontSize: '16px', fontWeight: 'bold', color: 'black', border: 0 }}>
              {isLoading ? (
                <div className="d-flex justify-content-center">
                  <div className="spinner-border" role="status"></div>
                </div>
              ) : 'Update Doctor'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default EditDoctor;

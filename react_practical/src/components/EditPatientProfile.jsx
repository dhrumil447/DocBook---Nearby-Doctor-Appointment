import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';
import { Form, Button, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';

const EditPatientProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    age: "",
    gender: "",
    phone: "",
    email: ""
  });

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/patients/${id}`);
        setFormData(res.data);
      } catch (error) {
        console.error("Error fetching patient:", error);
        alert("Failed to load patient data.");
      }
    };
    fetchPatient();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${import.meta.env.VITE_BASE_URL}/patients/${id}`, formData);
      toast("Profile updated successfully!");
      navigate('/profile'); // Change to your actual route
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <Card className="p-4 mt-4 mx-auto" style={{ maxWidth: "600px", background: "#fffef2", borderRadius: "10px" }}>
      <Card.Body>
        <h3 className="fw-bold mb-4 text-primary">Edit Profile</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Age</Form.Label>
            <Form.Control
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Gender</Form.Label>
            <Form.Select name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <div className="d-flex justify-content-between">
            <Button variant="success" type="submit">Save Changes</Button>
            <Button variant="secondary" onClick={() => navigate('/patient-profile')}>Cancel</Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default EditPatientProfile;

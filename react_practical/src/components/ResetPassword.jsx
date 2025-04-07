import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Form, Button, Container, Card } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState(""); // patients or doctors
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        // 1. Check patients
        const patientRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/patients?resetToken=${token}`);
        if (patientRes.data.length > 0) {
          setUserType("patients");
          setUserId(patientRes.data[0].id);
          setLoading(false);
          return;
        }

        // 2. Check doctors
        const doctorRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/doctors?resetToken=${token}`);
        if (doctorRes.data.length > 0) {
          setUserType("doctors");
          setUserId(doctorRes.data[0].id);
          setLoading(false);
          return;
        }

        toast.error("Invalid or expired reset link");
        navigate("/login");
      } catch (err) {
        toast.error("Error checking reset link");
      }
    };

    checkToken();
  }, [token, navigate]);

  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/${userType}/${userId}`);
      const updatedUser = { ...res.data, password: newPassword, resetToken: "" }; // Clear token

      await axios.put(`${import.meta.env.VITE_BASE_URL}/${userType}/${userId}`, updatedUser);

      toast.success("Password updated successfully!");
      navigate("/login");
    } catch (err) {
      toast.error("Something went wrong!");
    }
  };

  if (loading) return <p className="text-center mt-5">Verifying reset link...</p>;

  return (
    <Container className="mt-5 col-md-6">
      <Card className="p-4 shadow">
        <h4 className="text-center">Reset Your Password</h4><hr />
        <Form onSubmit={handleReset}>
          <Form.Group>
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button type="submit" className="mt-4 w-100" variant="success">
            Update Password
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default ResetPassword;

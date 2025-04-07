import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import emailjs from '@emailjs/browser';

const AdminContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

 
  const SERVICE_ID = 'service_rl0f4za';
  const TEMPLATE_ID = 'template_d6hsovm';
  const PUBLIC_KEY = 'SwJM3G57VeGq0uvhd';

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/contacts`);
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    };
    fetchMessages();
  }, []);

  const handleReplyClick = (msg) => {
    setSelectedMsg(msg);
    setReplyText('');
    setShowModal(true);
  };

  const handleSendReply = async () => {
    const templateParams = {
      user_name: selectedMsg.name,
      user_email: selectedMsg.email,
      message: replyText
    };

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
      setAlert({ show: true, type: 'success', message: 'Reply sent successfully via EmailJS!' });
    } catch (error) {
      setAlert({ show: true, type: 'danger', message: 'Failed to send reply via EmailJS.' });
    }

    setShowModal(false);
  };

  return (
    <Container className="my-5">
      <h3 className="mb-4">Contact Messages</h3>

      {alert.show && (
        <Alert variant={alert.type} onClose={() => setAlert({ show: false })} dismissible>
          {alert.message}
        </Alert>
      )}

      {messages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Message</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg, index) => (
              <tr key={msg.id}>
                <td>{index + 1}</td>
                <td>{msg.name}</td>
                <td>{msg.email}</td>
                <td>{msg.message}</td>
                <td>
                  <Button variant="primary" size="sm" onClick={() => handleReplyClick(msg)}>
                    Reply
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Reply Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Reply to {selectedMsg?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Reply Message</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="success" onClick={handleSendReply}>Send Reply</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminContactMessages;

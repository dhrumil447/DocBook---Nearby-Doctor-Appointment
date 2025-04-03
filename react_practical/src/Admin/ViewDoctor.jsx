import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPenAlt, FaTrash, FaUserCheck, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { selectdoctors, store_doctors } from '../redux/doctorSlice';
import { Modal, Button, Card, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';

const ViewDoctor = () => {
  const [selectedDoctor, setSelectedDoctor] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const redirect = useNavigate();
  const doctors = useSelector(selectdoctors);

  const getData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/doctors`);
      const doctorList = Array.isArray(res.data.doctors) ? res.data.doctors : res.data;
      dispatch(store_doctors(doctorList));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleDelete = async(id)=>{
    if(window.confirm("are you sure to delete this??")){
      try{
        await axios.delete(`${import.meta.env.VITE_BASE_URL}/doctors/${id}`)
        toast.success("doctor deleted successfully")
        setIsDeleted(!isDeleted)
      }
      catch(err){toast.error(err)}
  }
}

  const handleApprove = async (id) => {
    try {
      await axios.patch(`${import.meta.env.VITE_BASE_URL}/doctors/${id}`, { status: "Accept" });
      getData();
      toast.success("Doctor approved!");
    } catch (err) {
      console.log(err);
    }
  };

  const handleViewProfile = (doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
  };

  const handleAcceptStatus = async () => {
    if (!selectedDoctor) return;
    setLoading(true);
    try {
      await axios.patch(`${import.meta.env.VITE_BASE_URL}/doctors/${selectedDoctor.id}`, { status: "Accept" });
      getData();
      setShowModal(false);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <div className='mt-3'>
      <h3 className='text-info'>View Doctor</h3>
      <hr />
      <div className="table-responsive">
        <table className="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th>Sr. No</th>
              <th>Name</th>
              <th>Specialization</th>
              <th>Fees</th>
              <th>Clinic</th>
              <th>Status</th>
              <th>View Doctor Profile</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.length === 0 ? (
              <tr>
                <td colSpan={8} className='text-center'>No Doctor Found</td>
              </tr>
            ) : doctors.map((doctor, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{doctor.username}</td>
                <td>{doctor.specialization}</td>
                <td>&#8377;{doctor.fees}</td>
                <td>{doctor.clinicName}</td>
                <td>
                  <span className={`badge ${doctor.status === "Accept" ? 'bg-success' : 'bg-warning text-dark'}`}>
                    {doctor.status}
                  </span>
                </td>
                <td>
                  <button
                    className='btn btn-info me-2'
                    onClick={() => handleViewProfile(doctor)}
                  >
                    <FaEye />
                  </button>
                  <button
                    className='btn btn-success me-2'
                    onClick={() => handleApprove(doctor.id)}
                    disabled={doctor.status === "Accept"}
                  >
                    <FaUserCheck />
                  </button>
                </td>
                <td>
                  <button
                    className='btn btn-success me-2'
                    onClick={() => redirect(`/admin/doctor/edit/${doctor.id}`)}
                  >
                    <FaPenAlt />
                  </button>
                  <button
                    className='btn btn-danger'
                    onClick={() => handleDelete(doctor.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Doctor Profile Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Doctor Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDoctor && (
            <Card className="shadow p-3 rounded">
              <Row>
                <Col md={12} className="text-center">
                  <img
                    src={selectedDoctor.profileimg}
                    alt="Profile"
                    className="rounded mb-3"
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  />
                  <h5 className="fw-bold">Dr. {selectedDoctor.username}</h5>
                  <p className="text-muted">{selectedDoctor.specialization}</p>
                  <p><strong>Status:</strong> <span className={`badge ${selectedDoctor.status === 'Accept' ? 'bg-success' : 'bg-warning text-dark'}`}>{selectedDoctor.status}</span></p>
                
                  <Row className="mb-2">
                    <Col><strong>Email:</strong> {selectedDoctor.email}</Col>
                    <Col><strong>Phone:</strong> {selectedDoctor.phone}</Col>
                  </Row>
                  <Row className="mb-2">
                    <Col><strong>Gender:</strong> {selectedDoctor.gender}</Col>
                    <Col><strong>Age:</strong> {selectedDoctor.age}</Col>
                  </Row>
                  <Row className="mb-2">
                    <Col><strong>Qualification:</strong> {selectedDoctor.qualification}</Col>
                    <Col><strong>Experience:</strong> {selectedDoctor.experience} yrs</Col>
                  </Row>
                  <Row className="mb-2">
                    <Col><strong>Clinic Name:</strong> {selectedDoctor.clinicName}</Col>
                    <Col><strong>Fees:</strong> ₹{selectedDoctor.fees}</Col>
                  </Row>
                  <Row className="mb-2">
                    <Col><strong>Available Days:</strong> {selectedDoctor.availableDays || 'Not Provided'}</Col>
                    <Col><strong>Available Time:</strong> {selectedDoctor.availableTime || 'Not Provided'}</Col>
                  </Row>
                  <Row className="mb-2">
                    <Col><strong>Clinic Address:</strong> {selectedDoctor.clinicAddress}</Col>
                  </Row>
                  
                  <hr />
                  <br/> <br/> <br/>
                  <p className="fw-bold">Identity Proof:</p>
                  <img
                    src={selectedDoctor.identityproof}
                    alt="Identity Proof"
                    style={{ width: '100%', maxWidth: '100%' }}
                    className="rounded"
                  /><hr/>

                  <p className="fw-bold">Degree Certificate:</p>
                  <img
                    src={selectedDoctor.degreeProof}
                    alt="Identity Proof"
                    style={{ width: '100%', maxWidth: '100%' }}
                    className="rounded"
                  /><hr/>
                 
                  <p className="fw-bold"> Clinic Registration Proof:</p>
                  <img
                    src={selectedDoctor.clinicRegProof}
                    alt="Identity Proof"
                    style={{ width: '100%', maxWidth: '100%' }}
                    className="rounded"
                  /><hr/>
                </Col>
              </Row>
            </Card>
          )}
        </Modal.Body>
        <Modal.Footer>
          {selectedDoctor && selectedDoctor.status !== 'Accept' && (
            <Button variant="success" onClick={handleAcceptStatus} disabled={loading}>
              {loading ? 'Updating...' : 'Accept Doctor'}
            </Button>
          )}
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewDoctor;

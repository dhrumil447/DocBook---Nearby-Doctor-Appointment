import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";

const SlotSelectionModal = ({ show, handleClose, slots, doctor }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [doctorFee, setDoctorFee] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (doctor?.id) {
      fetchDoctorDetails(doctor.id);
    }
    fetchPatientDetails();
    setLoading(false);
  }, [doctor?.id]);

  // Fetch Doctor Details
  const fetchDoctorDetails = async (doctorId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/doctors/${doctorId}`);
      if (response.ok) {
        const data = await response.json();
        setDoctorFee(data.fees);
      } else {
        toast.error("Failed to fetch doctor details");
      }
    } catch (error) {
      console.error("Error fetching doctor details:", error);
      toast.error("Error fetching doctor details");
    }
  };

  // Fetch Patient Details
  const fetchPatientDetails = async () => {
    const patientData = JSON.parse(sessionStorage.getItem("DocBook"));
    if (!patientData) {
      toast.error("User not logged in or session expired.");
      return;
    }
    const patientId = patientData.id;
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/patients/${patientId}`);
      if (response.ok) {
        const data = await response.json();
        setPatientName(data.username);
        setPatientPhone(data.phone);
        setPatientEmail(data.email);
      } else {
        toast.error("Failed to fetch patient details");
      }
    } catch (error) {
      console.error("Error fetching patient details:", error);
      toast.error("Error fetching patient details");
    }
  };

  // Select Appointment Slot
  const handleSlotSelect = (date, slot) => {
    setSelectedSlot(slot);
    setSelectedDate(date);
  };

  // Book Appointment
  const handleBookAppointment = () => {
    if (selectedSlot) {
      setShowPaymentOptions(true);
    } else {
      toast.error("Please select a slot first.");
    }
  };

  // Store Appointment and Payment Details
  const storeAppointment = async (paymentMethod, razorpayId = "") => {
    const patientData = JSON.parse(sessionStorage.getItem("DocBook"));
    if (!patientData) {
      toast.error("User not logged in or session expired.");
      return;
    }
    const patientId = patientData.id;

    const appointmentData = {
      doctorId: doctor.id,
      patientId,
      date: selectedDate,
      slot: selectedSlot,
      status: "Pending",
      doctorFees: doctorFee,
      patientName,
      patientPhone,
      patientEmail,
    };

    try {
      const appointmentResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentData),
      });

      if (appointmentResponse.ok) {
        const appointment = await appointmentResponse.json(); // Get created appointment

        // Now store payment details
        const paymentData = {
          patientId,
          doctorId: doctor.id,
          appointmentId: appointment.id, // Store appointment ID
          amount: doctorFee,
          paymentMethod,
          razorpayId,
          paymentDate: new Date().toISOString(),
        };

        const paymentResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/Payment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(paymentData),
        });

        if (paymentResponse.ok) {
          toast.success("Appointment booked and payment recorded successfully!");
          handleClose();
        } else {
          toast.error("Appointment booked, but failed to record payment.");
        }
      } else {
        toast.error("Failed to book appointment.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error processing appointment and payment.");
    }
  };

  // Handle Online Payment via Razorpay
  const handleOnlinePayment = () => {
    const options = {
      key: "rzp_test_ovDgkuzi6Z5Udw",
      amount: doctorFee * 100,
      currency: "INR",
      name: "DocBook",
      description: "Appointment Payment",
      handler: function (response) {
        toast.success("Payment Successful!");
        storeAppointment("Pay Online", response.razorpay_payment_id);
      },
      prefill: {
        name: patientName,
        email: patientEmail,
        contact: patientPhone,
      },
      theme: { color: "#3399cc" },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Select an Appointment Slot</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!showPaymentOptions ? (
          <>
            {slots && Object.keys(slots).length > 0 ? (
              Object.keys(slots).map((date, index) => (
                <div key={index} className="mb-2">
                  <h5>{slots[date].day} ({date})</h5>
                  {slots[date].slots.map((slot, i) => (
                    <Button
                      key={i}
                      variant={selectedSlot === slot && selectedDate === date ? "warning" : "outline-warning"}
                      className="m-1"
                      onClick={() => handleSlotSelect(date, slot)}
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              ))
            ) : (
              <p>No slots available for this doctor.</p>
            )}
          </>
        ) : (
          <>
            <h5 className="text-center mb-3">Choose Payment Method</h5>
            <div className="d-flex justify-content-around">
              <Button
                variant="outline-success"
                className="p-3"
                onClick={() => storeAppointment("Pay on Counter")}
              >
                Pay on Counter
              </Button>
              <Button
                variant="outline-primary"
                className="p-3"
                onClick={handleOnlinePayment}
              >
                Pay Online
              </Button>
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        {!showPaymentOptions ? (
          <Button
            style={{ backgroundColor: "rgb(255, 240, 75)", border: "0px", color: "black" }}
            onClick={handleBookAppointment}
          >
            Book Appointment
          </Button>
        ) : null}
        <Button variant="secondary" onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SlotSelectionModal;

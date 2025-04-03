import axios from "axios";
import React, { useState, useEffect } from "react";
import { Button, Container, Row, Col, Card, Form } from "react-bootstrap";
import { toast } from "react-toastify";

const DrSetslot = () => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [dateSlots, setDateSlots] = useState({});
  const [activeDate, setActiveDate] = useState(null);
  const [existingSlotsId, setExistingSlotsId] = useState(null);

  const timeSlots = [
    "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "01:00 PM - 02:00 PM",
    "02:00 PM - 03:00 PM",
    "03:00 PM - 04:00 PM",
    "04:00 PM - 05:00 PM",
    "05:00 PM - 06:00 PM"
  ];

  const doctorId = JSON.parse(sessionStorage.getItem("DocBook"))?.id;

  useEffect(() => {
    if (!doctorId) {
      toast.error("Doctor ID not found. Please log in.");
      return;
    }

    const fetchSlots = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/slots?doctor_id=${doctorId}`);
        if (response.data.length > 0) {
          let fetchedSlots = response.data[0].availableSlots || {};
          let filteredSlots = {};

          const today = formatDate(new Date().toISOString().split("T")[0]);
          const currentHour = new Date().getHours();

          // Remove expired slots
          Object.entries(fetchedSlots).forEach(([date, slotData]) => {
            if (date >= today) {
              const validSlots = slotData.slots.filter((slot) => {
                const slotHour = convertTo24HourFormat(slot.split(" - ")[0]);
                return !(date === today && slotHour <= currentHour);
              });

              if (validSlots.length > 0) {
                filteredSlots[date] = { ...slotData, slots: validSlots };
              }
            }
          });

          setExistingSlotsId(response.data[0].id);
          setDateSlots(filteredSlots);
          setSelectedDates(Object.keys(filteredSlots).sort());

          // Update backend if expired slots were removed
          if (JSON.stringify(filteredSlots) !== JSON.stringify(fetchedSlots)) {
            await axios.put(`${import.meta.env.VITE_BASE_URL}/slots/${response.data[0].id}`, {
              doctor_id: doctorId,
              availableSlots: filteredSlots,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching slots:", error);
      }
    };

    fetchSlots();
  }, [doctorId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB").split("/").join("-");
  };

  const getDayFromDate = (dateString) => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return daysOfWeek[new Date(dateString).getDay()];
  };

  const addDate = (event) => {
    const rawDate = event.target.value;
    if (!rawDate) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight

    const selectedDate = new Date(rawDate);
    selectedDate.setHours(0, 0, 0, 0); // Reset time to midnight

    if (selectedDate < today) {
      toast.warn("You cannot select a past date!");
      return;
    }

    const formattedDate = formatDate(rawDate);

    if (selectedDates.includes(formattedDate)) {
      toast.warn("Date already selected!");
      return;
    }

    const day = getDayFromDate(rawDate);
    const updatedDates = [...selectedDates, formattedDate].sort();

    setSelectedDates(updatedDates);
    setDateSlots({
      ...dateSlots,
      [formattedDate]: { day, slots: [] },
    });
    setActiveDate(formattedDate);
  };

  const toggleSlotSelection = (date, slot) => {
    if (!dateSlots[date]) return;

    const today = formatDate(new Date().toISOString().split("T")[0]);
    if (date === today) {
      const currentHour = new Date().getHours();
      const slotHour = convertTo24HourFormat(slot.split(" - ")[0]);

      if (slotHour <= currentHour) {
        toast.warn("Cannot select a past time slot for today!");
        return;
      }
    }

    const slots = dateSlots[date].slots || [];
    const updatedSlots = slots.includes(slot) ? slots.filter((s) => s !== slot) : [...slots, slot];

    setDateSlots({
      ...dateSlots,
      [date]: { ...dateSlots[date], slots: updatedSlots },
    });
  };

  const convertTo24HourFormat = (time) => {
    const [hour, minute] = time.split(":").map(Number);
    return time.includes("PM") && hour !== 12 ? hour + 12 : hour;
  };

  const saveSlots = async () => {
    if (!doctorId) {
      toast.error("Doctor ID not found. Please log in.");
      return;
    }

    const filteredDateSlots = Object.fromEntries(Object.entries(dateSlots).filter(([date, slotData]) => slotData.slots.length > 0));
    const filteredSelectedDates = Object.keys(filteredDateSlots);

    setSelectedDates(filteredSelectedDates);
    setDateSlots(filteredDateSlots);

    const data = {
      doctor_id: doctorId,
      availableSlots: filteredDateSlots,
    };

    try {
      if (existingSlotsId) {
        await axios.put(`${import.meta.env.VITE_BASE_URL}/slots/${existingSlotsId}`, data);
        toast.success("Slots updated successfully!");
      } else {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/slots`, data);
        if (response.status === 201 || response.status === 200) {
          setExistingSlotsId(response.data.id);
          toast.success("Slots saved successfully!");
        }
      }
    } catch (err) {
      console.error("Error saving slots:", err);
      toast.error(err.response?.data?.message || "Error saving slots.");
    }
  };

  return (
    <Container className="mt-4">
    <Card className="p-4 shadow-sm border-0 rounded">
      <h4 className="fw-bold text-center mb-4">Set Your Available Dates & Time Slots</h4>
      
      <Row>
        {/* Date Picker & Selected Dates */}
        <Col md={4}>
          <Form.Group>
            <Form.Control type="date" onChange={addDate} className="mb-3 shadow-sm" />
          </Form.Group>
          <Card className="p-3 shadow-sm">
            <h6 className="text-center fw-bold mb-2">Selected Dates</h6>
            {selectedDates.length > 0 ? selectedDates.map((date) => (
              <Button
                key={date}
                className={`mt-2 w-100 ${activeDate === date ? "btn-success" : "btn"}`}
                onClick={() => setActiveDate(date)}
              >
                {date} ({dateSlots[date]?.day})
              </Button>
            )) : <p className="text-muted text-center">No dates selected</p>}
          </Card>
        </Col>

        {/* Time Slots */}
        <Col md={4}>
          {activeDate && (
            <Card className="p-3 shadow-sm">
              <h6 className="fw-bold text-center">Time Slots for {activeDate} ({dateSlots[activeDate]?.day})</h6>
              <div className="d-flex flex-wrap justify-content-center">
                {timeSlots.map((slot) => (
                  <Button
                    key={slot}
                    className="m-1"
                    variant={dateSlots[activeDate]?.slots?.includes(slot) ? "success" : "outline-dark"}
                    onClick={() => toggleSlotSelection(activeDate, slot)}
                  >
                    {slot}
                  </Button>
                ))}
              </div>
            </Card>
          )}
        </Col>

        {/* Selected Schedule */}
        <Col md={4}>
          <Card className="p-3 shadow-sm">
            <h6 className="fw-bold text-center">Selected Schedule</h6>
            {selectedDates.length > 0 ? selectedDates.map((date) => (
              <div key={date} className="mb-2">
                <strong>{date} ({dateSlots[date]?.day}):</strong>
                <p className="mb-0 text-muted">{dateSlots[date]?.slots?.length > 0 ? dateSlots[date].slots.join(", ") : "No slots selected"}</p>
              </div>
            )) : <p className="text-muted text-center">No schedule set</p>}
          </Card>
        </Col>
      </Row>

      {/* Save Button */}
      <div className="text-center mt-4">
        <Button variant="primary" size="lg" onClick={saveSlots} className="shadow-sm">
          {existingSlotsId ? "Update Slots" : "Save Slots"}
        </Button>
      </div>
    </Card>
  </Container>
  );
};

export default DrSetslot;

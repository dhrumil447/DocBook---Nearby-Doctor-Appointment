import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Table, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [doctorPayments, setDoctorPayments] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorPatients, setDoctorPatients] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const paymentRes = await axios.get("http://localhost:1000/Payment");
        const paymentsWithDetails = await Promise.all(
          paymentRes.data.map(async (payment) => {
            let doctorName = "Unknown";
            let patientName = "Unknown";

            try {
              const doctorRes = await axios.get(`http://localhost:1000/doctors/${payment.doctorId}`);
              doctorName = doctorRes.data.username;
            } catch (error) {
              console.error("Error fetching doctor details:", error);
            }

            try {
              const patientRes = await axios.get(`http://localhost:1000/patients/${payment.patientId}`);
              patientName = patientRes.data.username;
            } catch (error) {
              console.error("Error fetching patient details:", error);
            }

            return { ...payment, doctorName, patientName };
          })
        );

        setPayments(paymentsWithDetails);
        calculateDoctorPayments(paymentsWithDetails);
      } catch (err) {
        console.error("Error fetching payments:", err);
        toast.error("Error fetching payments");
      }
    };

    fetchPayments();
  }, []);

  const calculateDoctorPayments = (payments) => {
    const groupedPayments = payments.reduce((acc, pay) => {
      if (!acc[pay.doctorName]) {
        acc[pay.doctorName] = {
          doctorId: pay.doctorId,
          doctorName: pay.doctorName,
          totalAppointments: 0,
          totalPayment: 0,
          cashPayment: 0,
          onlinePayment: 0,
        };
      }

      acc[pay.doctorName].totalAppointments += 1;
      acc[pay.doctorName].totalPayment += pay.amount;

      if (pay.paymentMethod === "Pay on Counter") {
        acc[pay.doctorName].cashPayment += pay.amount;
      } else {
        acc[pay.doctorName].onlinePayment += pay.amount;
      }

      return acc;
    }, {});

    setDoctorPayments(Object.values(groupedPayments));
  };

  const handleDoctorClick = (doctorId, doctorName) => {
    setSelectedDoctor(doctorName);

    const filteredPatients = payments
      .filter((pay) => pay.doctorId === doctorId)
      .reduce((acc, pay) => {
        if (!acc[pay.patientName]) {
          acc[pay.patientName] = {
            patientName: pay.patientName,
            totalAppointments: 0,
            totalPayment: 0,
            cashPayment: 0,
            onlinePayment: 0,
          };
        }

        acc[pay.patientName].totalAppointments += 1;
        acc[pay.patientName].totalPayment += pay.amount;

        if (pay.paymentMethod === "Pay on Counter") {
          acc[pay.patientName].cashPayment += pay.amount;
        } else {
          acc[pay.patientName].onlinePayment += pay.amount;
        }

        return acc;
      }, {});

    setDoctorPatients(Object.values(filteredPatients));
  };

  const downloadDoctorPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Doctor-wise Payment Report", 14, 15);

    const tableColumn = ["Doctor ID", "Doctor Name", "Total Appointments", "Total Payment", "Cash Payment", "Online Payment"];
    const tableRows = doctorPayments.map((doc) => [
      doc.doctorId,
      doc.doctorName,
      doc.totalAppointments,
      `${doc.totalPayment}`,
      `${doc.cashPayment}`,
      `${doc.onlinePayment}`,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      styles: {
        fontSize: 10,
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
        halign: "center",
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontSize: 12,
        fontStyle: "bold",
      },
    });

    doc.save("Doctor-Payment-Report.pdf");
  };

  const downloadPatientPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(`${selectedDoctor} - Patient Payment Report`, 14, 15);

    const tableColumn = ["Patient Name", "Total Appointments", "Total Payment", "Cash Payment", "Online Payment"];
    const tableRows = doctorPatients.map((pat) => [
      pat.patientName,
      pat.totalAppointments,
      `${pat.totalPayment}`,
      `${pat.cashPayment}`,
      `${pat.onlinePayment}`,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      styles: {
        fontSize: 10,
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
        halign: "center",
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontSize: 12,
        fontStyle: "bold",
      },
    });

    doc.save(`${selectedDoctor}_Patient_Report.pdf`);
  };

  const filteredDoctors = doctorPayments.filter((doc) =>
    doc.doctorName.toLowerCase().includes(search.toLowerCase()) || doc.doctorId.toString().includes(search)
  );

  return (
    <div className="container mt-4">
      <Card className="p-3">
        <h4 className="text-center fw-bold">Doctor-wise Payment Summary</h4>

        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Search by Doctor Name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" onClick={downloadDoctorPDF} className="mb-3">
          Download Doctor PDF
        </Button>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Doctor ID</th>
              <th>Doctor Name</th>
              <th>Total Appointments</th>
              <th>Total Payment </th>
              <th>Cash Payment </th>
              <th>Online Payment </th>
            </tr>
          </thead>
          <tbody>
            {filteredDoctors.map((doc) => (
              <tr key={doc.doctorId} onClick={() => handleDoctorClick(doc.doctorId, doc.doctorName)} style={{ cursor: "pointer" }}>
                <td>{doc.doctorId}</td>
                <td>{doc.doctorName}</td>
                <td>{doc.totalAppointments}</td>
                <td>₹{doc.totalPayment}</td>
                <td>₹{doc.cashPayment}</td>
                <td>₹{doc.onlinePayment}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        {selectedDoctor && <Button onClick={downloadPatientPDF}>Download Patient PDF</Button>}
      </Card>
    </div>
  );
};

export default AdminPayments;

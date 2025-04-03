import { Container, Button, Row, Col, Card } from "react-bootstrap";
import { FaUsersViewfinder, FaUserDoctor, FaCalendarCheck } from "react-icons/fa6";
import { FaClinicMedical } from "react-icons/fa";
import { NavLink } from "react-router";
import { FcSearch } from "react-icons/fc";
import { motion } from "framer-motion";

const Home = () => {
  const specialties = [
    { title: "Tooth pain, cavity, gum issue", url: "https://res.cloudinary.com/dhrumil7/image/upload/v1743702392/dentist_n2hwun.png" },
    { title: "Acne, pimple or skin issues", url: "https://res.cloudinary.com/dhrumil7/image/upload/v1743702393/Dermatologist_l49tsx.png" },
    { title: "Cold, cough or fever", url: "https://res.cloudinary.com/dhrumil7/image/upload/v1743702401/GeneralPhysician_u3krth.png" },
    { title: "Child not feeling well", url: "https://res.cloudinary.com/dhrumil7/image/upload/v1743702392/child_w7gro7.png" },
    { title: "Depression or anxiety", url: "https://res.cloudinary.com/dhrumil7/image/upload/v1743702392/depression_oombcx.png" },
    { title: "Period doubts or Pregnancy", url: "https://res.cloudinary.com/dhrumil7/image/upload/v1743702407/pregnancy_dmheu8.png" },
  ];

  const steps = [
    { text: "Step 1", text1: "Search by City & Specialization", icon: <FcSearch className="fs-1" /> },
    { text: "Step 2", text1: "View Trusted Profiles", icon: <FaUserDoctor className="fs-1" /> },
    { text: "Step 3", text1: "Book Appointment Instantly", icon: <FaCalendarCheck className="fs-1" /> },
    { text: "Step 4", text1: "Visit Stress-Free", icon: <FaClinicMedical className="fs-1" /> },
  ];

  const backgroundStyle = {
    backgroundImage: "url('https://res.cloudinary.com/dhrumil7/image/upload/v1743702393/doctor_djhnaf.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    height:"400px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    color: "black",
    position: "relative",
  };

  return (
    <>
      {/* Background Image Section */}
      <div style={backgroundStyle}>
        <motion.div
          initial={{ opacity: 0, y: -150 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2 }}
          style={{ marginRight:"650px" }}
        >
          <h2>Your Health, Your Doctor, Your Choice!</h2>
          <p>Book Appointments with Top Doctors Anytime, Anywhere.</p>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} transition={{ duration: 0.3 }}>
            <Button as={NavLink} to="/Finddoctor" className="btn btn-warning btn-lg">
              <FaUsersViewfinder /> Find Doctor
            </Button>
          </motion.div>
        </motion.div>
      </div>

    
      <Container className="mt-5 mb-5">
        <h4 className="text-center mb-4">Top-searched Specialties</h4>
        <Row className="justify-content-center">
          {specialties.map((specialty, index) => (
            <Col xs={6} md={2} key={index}>
              <motion.div whileHover={{ scale: 1.1 }} 
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: index * 0.2 }}>
                <Card className="text-center p-3" style={{ borderRadius: "50%", backgroundColor: "#fff0bb" }}>
                  <Card.Body>
                    <Card.Img variant="top" src={specialty.url} className="rounded-circle" /> 
                  </Card.Body>
                </Card>
                <Card.Title className="fs-6 text-center mt-2">{specialty.title}</Card.Title>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>

      <Container fluid className="py-5" style={{ backgroundColor: "#fdfaee" }}>
        <h4 className="text-center mb-5">How DocBook Works</h4>
        <Row className="justify-content-center">
          {steps.map((step, index) => (
            <Col xs={7} md={2} key={index}>
              <motion.div whileHover={{ scale: 1.1 }} initial={{ opacity: 0, x: 250 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}>
                <Card className="text-center p-3" style={{ borderRadius: "10px", backgroundColor: "#fff0bb", height: "180px" }}>
                  <Card.Body>
                    <Card.Title>{step.text}</Card.Title>
                    {step.icon}
                    <Card.Text>{step.text1}</Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default Home;

import { Button } from "react-bootstrap";
import React, { useState } from "react"; 
import { Card, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { toast } from 'react-toastify';
import { Link, useNavigate } from "react-router";
import axios from "axios";

const Doctorreg = () => {
  const redirect =  useNavigate()
  const [isLoading,setIsLoading] = useState(false)
  const [show, setShow] = useState(false);
  const [doctor, setUser] = useState({
    username: '',
    email: '',
    password: '',
    cpassword: '',
    phone: '',
    gender: '',
    age: '',
    clinicName: '',
    clinicAddress: '',
    city:'',
    specialization: '',
    qualification: '',
    experience: '',
    fees: '',
    profileimg:'',
    identityproof:'',
    degreeProof:'',
    clinicRegProof:'',
    status:'Pending',
    isDoctors:true
  });

  const handleSubmit = async(e) => {
    e.preventDefault();
    let { username, email, password, cpassword, phone, gender, age, clinicName, clinicAddress, specialization, qualification, profileimg, identityproof, degreeProof, clinicRegProof, experience, fees} = doctor;
    let pattern = /^[\w\.]+\@[\w]+\.[a-zA-Z]{3}$/;

    if (!username || !email || !password || !phone || !gender || !age ||  !clinicName || !clinicAddress || !specialization || !qualification || !profileimg || !identityproof  || !degreeProof || !clinicRegProof || !experience || !fees) {
      toast.error("Please fill all the fields");
    } else if (!pattern.test(email)) {
      toast.error("Invalid email");
    } else if (password !== cpassword) {
      toast.error("Passwords do not match");
    } else{

      try{
        await axios.post(`${import.meta.env.VITE_BASE_URL}/doctors`, {...doctor, createdAt:new Date()})

        toast.success("registered successfully")
        redirect('/login')
      }
      catch(err){toast.error(err)}
      }
    }
  
    const handleImage =  async(e ,fieldName)=>{
      // console.log(e.target.files[0])
      let img = e.target.files[0]
      let ext = ["image/jpg","image/jpeg","image/png","image/gif","image/webp","image/jfif","image/avif",]

      if(img==undefined){toast.error("please choose image")}
      else if(img.size > 1048576) toast.error("File size exceeded (Max 1MB)")
      else if(!ext.includes(img.type))toast.error("invalid extension")
      else {
        setIsLoading(true)  
        const data =  new FormData()
        data.append("file",img)
        data.append("cloud_name","dhrumil7")
        data.append("upload_preset","DocBook")
        data.append("folder","Doctors") 
        try{
            const res = await axios.post("https://api.cloudinary.com/v1_1/dhrumil7/image/upload" , data)
            const imageUrl = res.data.url;

            // Dynamically update the specific field in state
            setUser(prev => ({ ...prev, [fieldName]: imageUrl }));
            setIsLoading(false);
            toast.success(`${fieldName} uploaded successfully`);
        }
        catch(err){toast.error(err.message);setIsLoading(false)}
      }
    }

  return (
    <Container className="mt-5 mb-5">
      <Card style={{
        maxWidth: "900px",
        margin: "auto",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)"
      }}>
        <Row>
          <Col md={12}>
            <h3 style={{ textAlign: "left", color: "#FFF40B", fontWeight: "bold" }}>Doctor Register</h3>
            <p style={{ textAlign: "right", fontSize: "15px" }}>
              Are you a Patient? <Link to="/Register" className="text-decoration-none">Register Here</Link>
            </p>
            <hr />
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={4}>
                  <Form.Group className="form-floating mb-3">
                    <Form.Control type="text" name="fullName" placeholder="" value={doctor.username}
                      onChange={(e) => setUser({ ...doctor, username: e.target.value })} />
                    <Form.Label className="form-label">Enter Name</Form.Label>
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group className="form-floating mb-3">
                    <Form.Control type="email" name="email" placeholder="" value={doctor.email}
                      onChange={(e) => setUser({ ...doctor, email: e.target.value })} />
                    <Form.Label className="form-label">Enter Email</Form.Label>
                  </Form.Group>
                </Col>
              
                <Col md={4}>
                  <Form.Group className="form-floating mb-3">
                    <Form.Control type="text" name="phone" placeholder="" value={doctor.phone}
                      onChange={(e) => setUser({ ...doctor, phone: e.target.value })} />
                    <Form.Label className="form-label">Enter Phone Number</Form.Label>
                  </Form.Group>
                </Col>
                </Row>

                <Row>
                <Col md={2}>
                  <Form.Group className="form-floating mb-3">
                    <Form.Control type="text" name="age" placeholder="" value={doctor.age}
                      onChange={(e) => setUser({ ...doctor, age: e.target.value })} />
                    <Form.Label className="form-label">Enter Age</Form.Label>
                  </Form.Group>
                </Col>

                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Select name="gender" style={{ height: '57px' }} value={doctor.gender}
                      onChange={(e) => setUser({ ...doctor, gender: e.target.value })}>
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Select name="specialization" style={{ height: '57px' }} value={doctor.specialization}
                      onChange={(e) => setUser({ ...doctor, specialization: e.target.value })}>
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

                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Select name="qualification" style={{ height: '57px' }} value={doctor.qualification}
                      onChange={(e) => setUser({ ...doctor, qualification: e.target.value })}>
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
              </Row>

              <Row>
                <Col md={3}>
                  <Form.Group className="form-floating mb-3">
                    <Form.Control type="number" placeholder="" value={doctor.experience} onChange={(e) => setUser({ ...doctor, experience: e.target.value })} />
                    <Form.Label>Experience (Years)</Form.Label>
                  </Form.Group>
                </Col>

                <Col md={3}>
                  <Form.Group className="form-floating mb-3">
                    <Form.Control type="number" placeholder="" value={doctor.fees} onChange={(e) => setUser({ ...doctor, fees: e.target.value })} />
                    <Form.Label>Consultation Fees</Form.Label>
                  </Form.Group>
                </Col>
             
                <Col md={6}>
                  <Form.Group className="form-floating mb-3">
                    <Form.Control type="text" name="clinicName" placeholder="" value={doctor.clinicName}
                      onChange={(e) => setUser({ ...doctor, clinicName: e.target.value })} />
                    <Form.Label className="form-label">Clinic Name</Form.Label>
                  </Form.Group>
                </Col>
                </Row>

                <Row>
                <Col md={12}>
                  <Form.Group className="form-floating mb-3">
                    <Form.Control type="text" name="clinicAddress" placeholder="" value={doctor.clinicAddress}
                      onChange={(e) => setUser({ ...doctor, clinicAddress: e.target.value })} />
                    <Form.Label className="form-label">Clinic Address</Form.Label>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className='mb-3'>
                    <InputGroup>
                      <Form.Control type={show ? "text" : "password"} name="password" placeholder="Create Password"
                        style={{ height: '55px' }} value={doctor.password}
                        onChange={(e) => setUser({ ...doctor, password: e.target.value })} />
                      <Button variant='light' className='border' onClick={() => setShow(!show)}>
                        {show ? <BsEye /> : <BsEyeSlash />}
                      </Button>
                    </InputGroup>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className='mb-3'>
                    <InputGroup>
                      <Form.Control type={show ? "text" : "password"} name="cpassword" placeholder="Confirm Password"
                        style={{ height: '55px' }} value={doctor.cpassword}
                        onChange={(e) => setUser({ ...doctor, cpassword: e.target.value })} />
                      <Button variant='light' className='border' onClick={() => setShow(!show)}>
                        {show ? <BsEye /> : <BsEyeSlash />}
                      </Button>
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row><hr/>
                <h3 className="mb-3">Upload Your Original Document </h3>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                  <Form.Label>Profile Photo</Form.Label>
                    <Form.Control type="file" name="Profile Photo" accept='image/*'onChange={(e) => handleImage(e, "profileimg")} />
                  </Form.Group>
                </Col>
             
                <Col md={6}>
                  <Form.Group className="mb-3">
                  <Form.Label>Identity Proof (Aadhar / DL / Voter ID / Govt. ID)</Form.Label>
                    <Form.Control type="file" name="Identity Proof" accept='image/*' onChange={(e) => handleImage(e, "identityproof")}/>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                  <Form.Label>Degree Certificate</Form.Label>
                    <Form.Control type="file" name="Identity Proof" accept='image/*' onChange={(e) => handleImage(e, "degreeProof")}/>
                  </Form.Group>
                </Col>
           
                <Col md={6}>
                  <Form.Group className="mb-3">
                  <Form.Label>Clinic Registration Proof</Form.Label>
                    <Form.Control type="file" name="Identity Proof" accept='image/*' onChange={(e) => handleImage(e, "clinicRegProof")}/>
                  </Form.Group>
                </Col>
              </Row>

            


              <Button variant="warning" type="submit"
                style={{ width: '100%', fontSize: '16px', fontWeight: 'bold', color: 'black' }}>
                Register
              </Button>

              <p className="text-md-center mt-3" style={{ textAlign: "right", fontSize: "13px" }}>
                Already have an account? <Link to="/Login" className="text-decoration-none">Log In</Link>
              </p>
            </Form>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default Doctorreg;

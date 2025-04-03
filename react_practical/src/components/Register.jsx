import { Button } from "react-bootstrap";
import React, { useState } from "react"; 
import { Card, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { toast } from 'react-toastify'
import { Link, useNavigate } from "react-router";
import axios from "axios";

const Register = () => {
   const redirect =  useNavigate()
      const [user,setUser] = useState({username:'',email:'',password:'',cpassword:'',phone: '',gender: '',age: '',isPatients:true})
    const [show,setShow] = useState(false)
    const handleSubmit = async(e)=>{
      e.preventDefault()
      let {username,email,password,cpassword,phone,gender,age} = user
      let pattern = /^[\w\.]+\@[\w]+\.[a-zA-Z]{3}$/
      if(!username || !email || !password || !phone || !gender || !age) {
        toast.error("please fill all the fields")
      }
      else if(!pattern.test(email)){
        toast.error("invalid email")
      }
      else if(password != cpassword){
        toast.error("password not match")
      }
      else{

        try{
          await axios.post(`${import.meta.env.VITE_BASE_URL}/patients`, {...user, createdAt:new Date()})
  
          toast.success("registered successfully")
          redirect('/Login')
        }
        catch(err){toast.error(err)}
        }
      }

  return (
    <>
      <Container className="mt-5">
        <Card
          style={{
            maxWidth: "900px",
            margin: "auto",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
            
          <Row>
            <Col md={5} style={{display: "flex",alignItems: "center",justifyContent: "center",}}>
              <img src="./src/assets/illustration.png" alt="Doctor" style={{ width: "100%", borderRadius: "10px" }}/>
            </Col>

            <Col md={7}>
              <h3 style={{ textAlign: "left",color: "#FFF40B",fontWeight: "bold",}}>Patient Register</h3>
              <p style={{ textAlign:"right" , fontSize:"15px"}}>Are you a dctor?<Link to="/doctorreg"  className="text-decoration-none"> Register Here</Link></p><hr />
              <Form onSubmit={handleSubmit}>

                <Row>
                  <Col md={6}>
                    <Form.Group className="form-floating mb-3">
                      <Form.Control type="text" name="fullName" placeholder=""  value={user.username} 
                  onChange={(e)=>setUser({...user, username:e.target.value})}></Form.Control>
                      <Form.Label className="form-label">Enter Name</Form.Label>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="form-floating mb-3">
                      <Form.Control type="email" name="email" placeholder=""  value={user.email} 
                  onChange={(e)=>setUser({...user, email:e.target.value})}></Form.Control>
                      <Form.Label className="form-label">Enter Email</Form.Label>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                    <Col md={5}>
                    <Form.Group className="form-floating mb-3">
                        <Form.Control type="phone" name="phone" placeholder="" value={user.phone} 
                  onChange={(e)=>setUser({...user, phone:e.target.value})}></Form.Control>
                        <Form.Label className="form-label">Enter Phone Number</Form.Label>
                    </Form.Group>
                    </Col>

                    <Col md={3}>
                    <Form.Group className="form-floating mb-3">
                        <Form.Control type="text" name="age" placeholder=""  value={user.age} 
                  onChange={(e)=>setUser({...user, age:e.target.value})}></Form.Control>
                        <Form.Label className="form-label">Enter Age</Form.Label>
                    </Form.Group>
                    </Col>
                    <Col md={4}>

                    <Form.Group className=" mb-3">
                        <Form.Select name="gender" style={{height:'57px'}} value={user.gender} onChange={(e)=>setUser({...user, gender:e.target.value})}>
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                        </Form.Select>
                    </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                    <Form.Group className='mb-3'>
                        <InputGroup>
                            <Form.Control type={`${show ? "text" : "password" }`} name="password" placeholder="Create Password"  style={{height:'55px'}} value={user.password} onChange={(e)=>setUser({...user, password:e.target.value})}></Form.Control>
                            <Button variant='light' className='border'  onClick={()=>setShow(!show)}> {show ? <BsEye/> :  <BsEyeSlash/>}</Button>
                        </InputGroup>
                     </Form.Group>
                    </Col>
            
                    <Col md={6}>
                    <Form.Group className='mb-3'>
                        <InputGroup>
                            <Form.Control type={`${show ? "text" : "password" }`} name="password" placeholder="Confirm Password" style={{height:'55px'}} value={user.cpassword} onChange={(e)=>setUser({...user, cpassword:e.target.value})}></Form.Control>
                            <Button variant='light' className='border' onClick={()=>setShow(!show)}> {show ? <BsEye/> :  <BsEyeSlash/>}</Button>
                        </InputGroup>
                    </Form.Group>
                    </Col>
                </Row>
                <Button variant="warning" type="submit" style={{ width: '100%', fontSize: '16px', fontWeight: 'bold', color: 'black' }}>
                Register
              </Button>
                              <p className="text-md-center mt-3" style={{ textAlign:"right" , fontSize:"13px"}}>Already have an account?<Link to="/Login"  className="text-decoration-none"> Log In</Link></p>
              
              </Form>
            </Col>
          </Row>
        
        </Card>
      </Container>
    </>
  );
};

export default Register;

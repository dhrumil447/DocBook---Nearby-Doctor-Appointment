import { useEffect, useState } from 'react';
import {Button} from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { BiLogInCircle } from 'react-icons/bi';
import { FaCircleUser } from "react-icons/fa6";
import { TbLogout } from "react-icons/tb";
import { TbReportMedical } from "react-icons/tb";
import { TiUser } from "react-icons/ti";
import { NavLink, Outlet, useNavigate } from 'react-router';
// import { useForm } from 'react-hook-form'; 
import { ShowOnLogin, ShowOnLogout } from './hiddenlinks';
import { toast } from 'react-toastify';


const Header = () => {

  const redirect =  useNavigate()
  const handleLogout = ()=>{
    if(sessionStorage.getItem("DocBook") != null){
      sessionStorage.removeItem("DocBook")
      toast.success("loggedout successfully")
      redirect('/') } }
  const [username,setUsername] = useState("")
  useEffect(()=>{
    if(sessionStorage.getItem("DocBook") != null){
      let obj = JSON.parse(sessionStorage.getItem("DocBook"))
      setUsername(obj.username)
    }
  },[sessionStorage.getItem("DocBook")])
  
  return (
  <>
   <Navbar expand="lg" style={{backgroundColor: "#fdfaee"}} >
      <Container fluid>     
        <Navbar.Brand href="#home" className='fs-3 fw-bold ms-3' style={{color:'#FFF04b' , fontFamily:"cursive"}}>DocBook</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/">Home</Nav.Link>
            <Nav.Link as={NavLink} to="/finddoctor" >Find Doctors</Nav.Link>
            {/* <Nav.Link as={NavLink} to="/Appointments">Appointments</Nav.Link> */}
            <Nav.Link as={NavLink} to="/About">About Us</Nav.Link>
            <Nav.Link as={NavLink} to="/Contact">Contact Us</Nav.Link>

            <ShowOnLogin>
            <FaCircleUser className='ms-3 mt-1' style={{fontSize:'35px'}}/>
            <NavDropdown title={`Welcome ${username}`} id="basic-nav-dropdown" className='me-3'>
              <NavDropdown.Item as={NavLink} to="/profile"><TiUser style={{fontSize:'23px', marginRight:'5px'}} />My Profile</NavDropdown.Item><NavDropdown.Divider />
              <NavDropdown.Item as={NavLink} to="/medicalreport"><TbReportMedical style={{fontSize:'23px', marginRight:'5px'}} />My Medical Report
              </NavDropdown.Item><NavDropdown.Divider />

              <NavDropdown.Item  onClick={handleLogout}><TbLogout style={{fontSize:'23px', marginRight:'5px', marginLeft:'2px'}}/>LogOut</NavDropdown.Item>
            </NavDropdown>
            </ShowOnLogin>

            <ShowOnLogout>
          <Button  as={NavLink} to="/Login" style={{backgroundColor:"#FFF04B" , border:"2px solid #FFF04B" , color:"Black"}}><BiLogInCircle></BiLogInCircle> LogIn</Button>
          </ShowOnLogout>
            
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  </>
  )
}

export default Header
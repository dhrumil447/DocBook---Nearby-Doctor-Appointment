import React from 'react'
import { Nav, Offcanvas } from 'react-bootstrap'
import { FaBookMedical, FaComment, FaPaypal, FaUserMd } from "react-icons/fa";
import { FaHome, FaList, FaPenFancy, FaShoppingBag, FaThList, FaUser } from 'react-icons/fa'
import { FaMessage } from 'react-icons/fa6';
import { NavLink } from 'react-router'
const Sidebar = ({show,setShow}) => {
  const links =  [
    {url:'/admin' ,text:'Dashboard' , icon:<FaHome/>},
    {url:'/admin/patient' ,text:'Manage Patients' , icon:<FaUser/>},
    {url:'/admin/view' ,text:'Manage Doctors' , icon:<FaUserMd/>},
    {url:'/admin/viewap' ,text:'Manage Appointment' , icon:<FaBookMedical/>},
    {url:'/admin/review' ,text:'Manage Review' , icon:<FaComment/>},
    {url:'/admin/payment' ,text:'All Payments' , icon:<FaPaypal/>},
    {url:'/admin/contact-messages' ,text:'View ContactUs' , icon:<FaMessage/>}

  ]
  return (
    <>  <div className="d-none d-md-flex flex-column text-white p-3 " 
       style={{ width: "250px",height:"1100px", backgroundColor:'lightblue' }}>
        <h4 className="text-center text-black">Admin</h4><hr style={{color:"black"}}/>
        <Nav className="flex-column">
          {links.map((link,index)=>
             <Nav.Link as={NavLink} key={index} to={link.url} className="text-black mb-4">
             <span className='me-1'> {link.icon}</span> {link.text}
           </Nav.Link>
          )}
       

         </Nav>
      </div>

      <Offcanvas show={show} onHide={()=>setShow(false)} className="bg-dark text-white">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Admin Panel</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
          {links.map((link,index)=>
             <Nav.Link as={NavLink} key={index} to={link.url} className="text-white mb-4">
             <span className='me-2'> {link.icon}</span> {link.text}
           </Nav.Link>
          )} </Nav>
        </Offcanvas.Body>
        </Offcanvas>
    </>
  )
}

export default Sidebar

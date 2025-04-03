import React from 'react'
import {  NavLink } from 'react-router'
import { FaBook, FaClock, FaCommentMedical, FaHome, FaSplotch, FaSteam, FaTiktok, FaTimes, FaUserMd } from 'react-icons/fa'
import { Nav, Offcanvas } from 'react-bootstrap'
import { FaTimeline } from 'react-icons/fa6'

const Drsidebar = ({show,setShow}) => {
      const links =  [
        {url:'/doctor/dashboard' ,text:'Dashboard' , icon:<FaHome/>},
        {url:'/doctor/setslot' ,text:'Set Slot' , icon:<FaClock/>},
        {url:'/doctor/ap' ,text:'View Appointment' , icon:<FaBook/>},
        {url:'/doctor/patient' ,text:'View Patient' , icon:<FaUserMd/>},
        {url:'review' ,text:'View Review' , icon:<FaCommentMedical/>},
        // {url:'/admin/users' ,text:'Manage Orders' , icon:<FaThList/>},
        // {url:'/admin/orders' ,text:'Manage Users' , icon:<FaUser/>},
      ]
  return (
    <>
        <div className="d-none d-md-flex flex-column text-white p-3 " 
            style={{ width: "250px" , backgroundColor:'darkblue' }}>
            <h4 className="text-center text-white">Doctor Panel</h4><hr style={{color:"white"}}/>
            <Nav className="flex-column">
                {links.map((link,index)=>
                <Nav.Link as={NavLink} key={index} to={link.url} className="text-white mb-4">
                    <span className='me-1'> {link.icon}</span> {link.text}
                </Nav.Link>
                )}
            </Nav>
        </div>

      <Offcanvas show={show} onHide={()=>setShow(false)} className="bg-dark text-white">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Doctor Panel</Offcanvas.Title>
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

export default Drsidebar

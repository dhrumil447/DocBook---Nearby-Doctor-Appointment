import React from 'react'
import { Button, Navbar } from 'react-bootstrap'
import { FaBars } from 'react-icons/fa6'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'

const Drnavbar = ({setShow}) => {
const redirect =  useNavigate()
const handleLogout = ()=>{
    if(sessionStorage.getItem("DocBook") != null){
      sessionStorage.removeItem("DocBook")
      toast.success("loggedout successfully")
      redirect('/') } }

let {username:drname} = JSON.parse(sessionStorage.getItem("DocBook"))
 
  return (
      <Navbar style={{backgroundColor:"white"}}  className="px-3 d-flex justify-content-between">
    <div className="d-flex align-items-center">
      <button className="btn btn-outline-light d-md-none" onClick={()=>setShow(true)}>
        <FaBars/>
      </button>
      <Navbar.Brand  className="ms-2 fw-bold">Doctor Panel</Navbar.Brand>
    </div>
    <div className="d-flex align-items-center">
      <span className="text-black me-3">Welcome!! Dr. {drname}</span>
      <Button variant="outline-dark" onClick={handleLogout} >Logout</Button>
  </div>
  </Navbar>
  )
}

export default Drnavbar

import React from 'react'
import { Button, Navbar } from 'react-bootstrap'
import { FaBars } from 'react-icons/fa'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'

const AdminNavbar = ({setShow}) => {
  const redirect =  useNavigate()
  const handleLogout = ()=>{
    if(sessionStorage.getItem("DocBook") != null){
      sessionStorage.removeItem("DocBook")
      toast.success("loggedout successfully")
      redirect('/') } }

  return (
    <Navbar style={{backgroundColor:"lightgray"}}  className="px-3 d-flex justify-content-between">
    <div className="d-flex align-items-center">
      <button className="btn btn-outline-light d-md-none" onClick={()=>setShow(true)}>
        <FaBars />
      </button>
      <Navbar.Brand  className=" ms-2">Admin Panel</Navbar.Brand>
    </div>
    <div className="d-flex align-items-center">
      <span className="text-black me-3">Welcome, Admin</span>
      <Button variant="outline-dark" onClick={handleLogout} >Logout</Button>
  </div>
  </Navbar>
  )
}

export default AdminNavbar

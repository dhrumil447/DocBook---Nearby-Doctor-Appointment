import React, { useState } from 'react'
import Sidebar from './Sidebar'
import { Container } from 'react-bootstrap'
import { Outlet } from 'react-router'
import AdminNavbar from './AdminNavbar'

const AdminLayout = () => {
  const [show,setShow] = useState(false)
  return (
    <div className="d-flex vh-100">
            <Sidebar show={show} setShow={setShow}/>
      <div className="flex-grow-1">
       <AdminNavbar setShow={setShow}/>
       <Container><Outlet/></Container>
      </div>
    </div>
  )
}

export default AdminLayout

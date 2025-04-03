import React, { useState } from 'react'
import Drsidebar from './Drsidebar'
import Drnavbar from './Drnavbar'
import { Container } from 'react-bootstrap'
import { Outlet } from 'react-router'

const Doctorpanel = () => {

   const [show,setShow] = useState(false)
  return (
      <div className='d-flex vh-100'>
        <Drsidebar show={show} setShow={setShow}/>
          <div className="flex-grow-1">
            <Drnavbar setShow={setShow}/><hr/>
            <Container><Outlet/></Container>
          </div>
      </div>
    
  )
}

export default Doctorpanel

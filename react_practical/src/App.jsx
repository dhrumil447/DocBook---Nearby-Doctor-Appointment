import React from 'react'
// import './App.css'
// import Header from './components/Header'
// import Home from './components/Home'
import { Outlet } from "react-router"
import { Bounce, ToastContainer } from 'react-toastify'
import SplashCursor from './SplashCursor'



const App = () => {
  return (
    <>
    <ToastContainer
position="top-right"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick={false}
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
transition={Bounce}
/>



{/* <SplashCursor/> */}
       <Outlet/>
    </>
  )
}

export default App

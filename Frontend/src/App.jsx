import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './index.css'
import Header from './ownComponent/Header'
import Hero from './ownComponent/Hero'
import Features from './ownComponent/Cards'
import AdminDashboard from './ownComponent/AdminDashboard'
import StudentDashboard from './ownComponent/StudentDashboard'
import Aboutus from './ownComponent/Aboutus'
import Footer from './ownComponent/Footer'
import LoginPage from './ownComponent/Login'
import Adminregestration from './ownComponent/Adminregestration'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StudentRegistration from './ownComponent/StudentRegestration'




function App() {
  const [count, setCount] = useState(0)

  return (
    <>
   
    
    
     <Header></Header>
    <Hero></Hero>
  <Features></Features>
  <Aboutus></Aboutus>
  <Footer></Footer> 
  <Adminregestration></Adminregestration>
  <AdminDashboard></AdminDashboard>
  <LoginPage></LoginPage>
  <StudentRegistration></StudentRegistration>
  <StudentDashboard></StudentDashboard>
    </>
  )
}

export default App





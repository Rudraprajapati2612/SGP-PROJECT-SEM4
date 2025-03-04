import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './index.css'
import Header from './ownComponent/Header'
import Hero from './ownComponent/Hero'
import Features from './ownComponent/Cards'
import AdminDashboard from './ownComponent/AdminDashboard'





function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Header></Header>
    <Hero></Hero>
  <Features></Features>
  {/* <AdminDashboard></AdminDashboard> */}
  
    </>
  )
}

export default App





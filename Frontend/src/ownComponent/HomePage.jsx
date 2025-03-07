import React from 'react'
import Header from './Header'
import Hero from './Hero'
import Footer from './Footer'
import Features from './Cards'
import Aboutus from './Aboutus'

const HomePage = () => {
  return (
    <div>
        <Header/>
        <Hero/>
        <Features/>
        <Aboutus/>
        <Footer/>
    </div>
  )
}

export default HomePage
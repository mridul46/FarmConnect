import React from 'react'
import Navbar from "../components/layout/Navbar";
import HeroSection from "../components/home/HeroSection";
import StatsSection from "../components/home/StatsSection";
import FeaturesSection from "../components/home/FeaturesSection";
import HowItWorks from "../components/home/HowItWorks";
import BenefitsSection from "../components/home/BenefitsSection";
import TestimonialsSection from "../components/home/TestimonialsSection";
import CTASection from "../components/home/CTASection";
import Footer from "../components/layout/Footer";
import { useNavigate } from 'react-router-dom'
const Home = () => {
  const navigate=useNavigate()
   const handleStartShopping = () => {
    navigate("/products");
  };

  const handlefarmerLogin= ()=>{
     navigate("/farmer");
  }

  return (
    <div className="min-h-screen bg-white">
     <Navbar/>
      <HeroSection onStartShopping={handleStartShopping}  farmerLogin={handlefarmerLogin}/>
      <StatsSection />
      <FeaturesSection />
      <HowItWorks />
      <BenefitsSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  )
}

export default Home
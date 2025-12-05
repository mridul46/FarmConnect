import React from 'react'
import Navbar from "../Components/layout/Navbar";
import HeroSection from "../Components/home/HeroSection";
import StatsSection from "../Components/home/StatsSection";
import FeaturesSection from "../Components/home/FeaturesSection";
import HowItWorks from "../Components/home/HowItWorks";
import BenefitsSection from "../Components/home/BenefitsSection";
import TestimonialsSection from "../Components/home/TestimonialsSection";
import CTASection from "../Components/home/CTASection";
import Footer from "../Components/layout/Footer/";
import { useNavigate } from 'react-router-dom'
const Home = () => {
  const navigate=useNavigate()
   const handleStartShopping = () => {
    navigate("/products");
  };

  const handlefarmerLogin= ()=>{
     navigate("/farmer/dashboard");
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
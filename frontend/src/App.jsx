// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom'; // ✅ no BrowserRouter here
import Navbar from './Components/Navbar';
import HomePage from './Pages/HomePage';
import Services from './Pages/Services';
import Portfolio from './Pages/Portfolio';
import Catalogue from './Pages/Catalogue';
import ForgotPassword from './Pages/ForgotPassword';
import ReferEarn from './Pages/ReferEarn';
import BlogPage from './Pages/BlogPage';
import BlogDetailPage from './Pages/BlogDetailPage';
import ProjectTracking from './Pages/ProjectTracking';
import CostEstimator from './Pages/CostEstimator';
import FAQ from './Pages/FAQ';
import Offers from './Pages/Offers.jsx';
import KitchenDesigner from './Pages/KitchenDesigner';
import Login from './Pages/Login';
import Register from './Pages/Register';
import ReferAndEarn from './Pages/Dashboard/ReferAndEarn';
import PrivateRoute from './Components/PrivateRoute';

import Footer from './Components/Footer';
import Chatbot from './Components/Chatbot.jsx';
import About from './Components/AboutSection.jsx';
import './App.css'; // ✅ Import global styles
function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/about" element={<About />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/services" element={<Services />} />
        <Route path="/catalogue" element={<Catalogue />} />
        <Route path="/offers" element={<Offers />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <ReferAndEarn />
            </PrivateRoute>
          }
        />
        {/* <Route path='/ReferAndEarn' element={<ReferAndEarn />} /> */}
        <Route path="/refer-earn" element={<ReferEarn />} />
        <Route path="/track-project" element={<ProjectTracking />} />
        <Route path="/cost-estimator" element={<CostEstimator />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/kitchen-designer" element={<KitchenDesigner />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogDetailPage />} />
      </Routes>
      <Footer />
      <Chatbot />
    </div>
  );
}

export default App;

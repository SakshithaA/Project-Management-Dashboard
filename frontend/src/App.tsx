/*import { useState } from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Analytics from './pages/Analytics'
import POCs from './pages/POCs'
import AddProject from './pages/forms/AddProject'
import AddPOC from './pages/forms/AddPOC'
import ReportGenerate from './pages/ReportGenerate'
import './App.css'
import api from './services/api'
import Dashboard from "./pages/Dashboard";

export default function App() {
return (
  <div className="bg-gray-100 min-h-screen">
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/pocs" element={<POCs />} />
        <Route path="/addproject" element={<AddProject />} />
        <Route path="/addpoc" element={<AddPOC />} />
        <Route path="/report" element={<ReportGenerate />} />
      </Routes>
    </Router>
  </div>
)}


*/
import Home from "./pages/Home";

export default function App() {

  
  return (
    <div className="bg-gray-100 min-h-screen">
      <Home />
    </div>
  );
}

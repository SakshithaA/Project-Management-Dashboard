import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Analytics from './pages/Analytics'
//import POCs from './pages/POCs'
//import AddProject from './pages/forms/AddProject'
//import AddPOC from './pages/forms/AddPOC'
//import ReportGenerate from './pages/ReportGenerate'
import './App.css'

export default function App() {
  return (
    <Router>
      <div className="bg-gray-50 min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/overview" element={<Home />} />
            <Route path="/analytics" element={<Analytics />} />
            {/* <Route path="/pocs" element={<POCs />} />
            <Route path="/add-project" element={<AddProject />} />
            <Route path="/add-poc" element={<AddPOC />} />
            <Route path="/generate-report" element={<ReportGenerate />} /> */}
          </Routes>
        </div>
      </div>
    </Router>
  )
}
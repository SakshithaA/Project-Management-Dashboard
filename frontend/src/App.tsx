import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Analytics from './pages/Analytics'
import POCCards from './pages/POCs'
import AddProject from './pages/forms/AddProject'
import AddPOC from './pages/forms/AddPOC'
import './App.css'

export default function App() {
  return (
    <Router>
      <div className="bg-gray-50 min-h-screen">
        <Navbar />
        <div className="px-4 py-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/overview" element={<Home />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/pocs" element={<POCCards />} />
            <Route path="/addproject" element={<AddProject />}/>
            <Route path="/addpoc" element={<AddPOC />}/>
          </Routes>
        </div>
      </div>
    </Router>
  )
}
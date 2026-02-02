import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Analytics from './pages/Analytics'
import POCCards from './pages/POCs'
import AddProject from './pages/forms/AddProject'
import AddPOC from './pages/forms/AddPOC'
import ProjectDetailPage from './pages/ProjectDetailPage';
import ReportGenerate from './pages/ReportGeneration';
import TeamMemberDetail from './components/employee_details/TeamMemberDetail';
import InternDetail from './components/employee_details/InternDetail';
import UpdateIntern from './pages/forms/UpdateIntern';
import UpdateTeamMember from './pages/forms/UpdateTeamMember';
import './App.css'


export default function App() {
  return (
    <Router>
      <div className="bg-gray-50 min-h-screen">
        <Navbar />
        <div className="px-0 py-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/overview" element={<Home />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/pocs" element={<POCCards />} />
            <Route path="/addproject" element={<AddProject />}/>
            <Route path="/addpoc" element={<AddPOC />}/>
            <Route path="/project/:id" element={<ProjectDetailPage />} />
            <Route path="/team-member/:id" element={<TeamMemberDetail />} />
            <Route path="/report" element={<ReportGenerate />} />
            <Route path="/intern/:id" element={<InternDetail />} />
            <Route path="/add-poc" element={<AddPOC />} />
            <Route path="/intern/:id/edit" element={<UpdateIntern />} />
            <Route path="/team-member/:id/edit" element={<UpdateTeamMember />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}
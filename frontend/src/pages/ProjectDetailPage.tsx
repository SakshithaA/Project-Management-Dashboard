import { useParams } from "react-router-dom";
import ProjectDetail from "../components/project/ProjectDetails";
import { projects } from "../components/project/projectcard";

// Sample project descriptions
const projectDescriptions: Record<string, string> = {
  "E-commerce Platform Rebuild": "Complete rebuild of the e-commerce platform with modern tech stack",
  "Data Pipeline Migration": "Migrate legacy data pipelines to modern cloud infrastructure",
  "Cloud Infrastructure Setup": "Design and implement scalable cloud infrastructure on AWS",
  "Mobile App Development": "Native mobile banking application for iOS and Android",
  "API Gateway Implementation": "Implementation of scalable API gateway with rate limiting",
  "Dashboard Redesign": "Complete redesign of corporate marketing website"
};

// Sample team members for different projects
const teamMembersData: Record<string, any[]> = {
  1: [
    { 
      id: 1, 
      name: "Sarah Johnson", 
      role: "Lead Developer", 
      hoursAllocated: 320,
      avatarColor: "#3b82f6"
    },
    { 
      id: 2, 
      name: "Mike Chen", 
      role: "Frontend Developer", 
      hoursAllocated: 280,
      avatarColor: "#10b981"
    },
    { 
      id: 3, 
      name: "Emily Davis", 
      role: "Backend Developer", 
      hoursAllocated: 290,
      avatarColor: "#8b5cf6"
    }
  ],
  // Add more projects as needed
};

export default function ProjectDetailPage() {
  const { id } = useParams();
  const project = projects.find(p => p.id === parseInt(id || "1"));

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Project not found</h2>
        </div>
      </div>
    );
  }

  return (
    <ProjectDetail
      project={project}
      projectDescription={projectDescriptions[project.title] || "Project description not available"}
      teamMembers={teamMembersData[project.id]}
    />
  );
}
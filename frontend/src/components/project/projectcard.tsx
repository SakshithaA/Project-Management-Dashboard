import { Card, Progress, Empty } from "antd";
import { 
  TeamOutlined, 
  ClockCircleOutlined, 
  ExclamationCircleOutlined,
  CalendarOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

// Export the interface
export interface Project {
  id: number;
  title: string;
  client: string;
  progress: number;
  members: number;
  hoursAllocated: number;
  issues: number;
  startDate: string;
  endDate: string;
  color: string;
  type: string;
  stage: string;
}

interface ProjectCardsProps {
  searchText?: string;
  selectedTypes?: string[];
  selectedStatuses?: string[];
}

// Export projects array
export const projects: Project[] = [
  {
    id: 1,
    title: "E-commerce Platform Rebuild",
    client: "RetailCo Inc",
    progress: 65,
    members: 3,
    hoursAllocated: 890,
    issues: 1,
    startDate: "15/1/2024",
    endDate: "30/6/2024",
    color: "blue",
    type: "Fullstack",
    stage: "In Progress"
  },
  {
    id: 2,
    title: "Data Pipeline Migration",
    client: "DataTech Solutions",
    progress: 45,
    members: 2,
    hoursAllocated: 430,
    issues: 1,
    startDate: "1/2/2024",
    endDate: "15/5/2024",
    color: "purple",
    type: "Data Engineering",
    stage: "In Progress"
  },
  {
    id: 3,
    title: "Cloud Infrastructure Setup",
    client: "StartupXYZ",
    progress: 30,
    members: 2,
    hoursAllocated: 300,
    issues: 1,
    startDate: "1/3/2024",
    endDate: "30/4/2024",
    color: "green",
    type: "DevOps",
    stage: "Not Started"
  },
  {
    id: 4,
    title: "Mobile App Development",
    client: "TechMobile Inc",
    progress: 100,
    members: 4,
    hoursAllocated: 1200,
    issues: 0,
    startDate: "1/1/2024",
    endDate: "31/3/2024",
    color: "indigo",
    type: "Mobile",
    stage: "Completed"
  },
  {
    id: 5,
    title: "API Gateway Implementation",
    client: "FinTech Corp",
    progress: 10,
    members: 2,
    hoursAllocated: 200,
    issues: 2,
    startDate: "1/4/2024",
    endDate: "30/6/2024",
    color: "orange",
    type: "Backend",
    stage: "On Hold"
  },
  {
    id: 6,
    title: "Dashboard Redesign",
    client: "Analytics Ltd",
    progress: 0,
    members: 1,
    hoursAllocated: 150,
    issues: 0,
    startDate: "15/4/2024",
    endDate: "30/5/2024",
    color: "cyan",
    type: "Frontend",
    stage: "Cancelled"
  },
];

// Export color functions with hex values for charts
export const getStageColor = (stage: string) => {
  switch(stage.toLowerCase()) {
    case 'not started': return 'bg-gray-100 text-gray-700';
    case 'in progress': return 'bg-blue-100 text-blue-700';
    case 'on hold': return 'bg-yellow-100 text-yellow-700';
    case 'cancelled': return 'bg-red-100 text-red-700';
    case 'completed': return 'bg-green-100 text-green-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export const getStageColorHex = (stage: string) => {
  switch(stage.toLowerCase()) {
    case 'not started': return '#6b7280';
    case 'in progress': return '#3b82f6';
    case 'on hold': return '#f59e0b';
    case 'cancelled': return '#ef4444';
    case 'completed': return '#10b981';
    default: return '#6b7280';
  }
};

export const getTypeColor = (type: string) => {
  switch(type.toLowerCase()) {
    case 'fullstack': return 'bg-blue-50 text-blue-600 border border-blue-200';
    case 'data engineering': return 'bg-purple-50 text-purple-600 border border-purple-200';
    case 'devops': return 'bg-green-50 text-green-600 border border-green-200';
    case 'cloud': return 'bg-indigo-50 text-indigo-600 border border-indigo-200';
    case 'mobile': return 'bg-pink-50 text-pink-600 border border-pink-200';
    case 'frontend': return 'bg-cyan-50 text-cyan-600 border border-cyan-200';
    case 'backend': return 'bg-orange-50 text-orange-600 border border-orange-200';
    default: return 'bg-gray-50 text-gray-600 border border-gray-200';
  }
};

export const getTypeColorHex = (type: string) => {
  switch(type.toLowerCase()) {
    case 'fullstack': return '#3b82f6';
    case 'data engineering': return '#8b5cf6';
    case 'devops': return '#10b981';
    case 'cloud': return '#6366f1';
    case 'mobile': return '#ec4899';
    case 'frontend': return '#06b6d4';
    case 'backend': return '#f97316';
    default: return '#6b7280';
  }
};

const getColorClass = (color: string) => {
  switch(color) {
    case 'blue': return 'border-l-blue-500';
    case 'purple': return 'border-l-purple-500';
    case 'green': return 'border-l-green-500';
    case 'indigo': return 'border-l-indigo-500';
    case 'orange': return 'border-l-orange-500';
    case 'cyan': return 'border-l-cyan-500';
    default: return 'border-l-gray-500';
  }
};

export default function ProjectCards({ 
  searchText = "", 
  selectedTypes = [], 
  selectedStatuses = [] 
}: ProjectCardsProps) {
  const navigate = useNavigate();

  // Filter projects based on search text, selected types, and selected statuses
  const filteredProjects = projects.filter(project => {
    // Search filter
    const searchMatch = searchText === "" || 
      project.title.toLowerCase().includes(searchText.toLowerCase()) ||
      project.client.toLowerCase().includes(searchText.toLowerCase()) ||
      project.type.toLowerCase().includes(searchText.toLowerCase());

    // Type filter
    const typeMatch = selectedTypes.length === 0 || 
      selectedTypes.includes(project.type.toLowerCase());

    // Status filter
    const statusMatch = selectedStatuses.length === 0 || 
      selectedStatuses.includes(project.stage.toLowerCase());

    return searchMatch && typeMatch && statusMatch;
  });

  const handleCardClick = (projectId: number) => {
    navigate(`/project/${projectId}`);
  };

  return (
    <div className="mt-6 mx-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
        <span className="text-sm text-gray-500">
          Showing {filteredProjects.length} of {projects.length} projects
          {(searchText || selectedTypes.length > 0 || selectedStatuses.length > 0) && 
            " (filtered)"}
        </span>
      </div>
      
      {filteredProjects.length === 0 ? (
        <Empty
          description={
            <span className="text-gray-500">
              No projects match your filters
            </span>
          }
          className="py-12"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className={`rounded-lg border border-gray-200 hover:shadow-md transition-shadow ${getColorClass(project.color)} border-l-4 cursor-pointer hover:border-blue-300`}
              bodyStyle={{ padding: '20px' }}
              onClick={() => handleCardClick(project.id)}
            >
              {/* Project Title & Client */}
              <div className="mb-4">
                <h4 className="text-lg font-bold text-gray-900 mb-1">{project.title}</h4>
                <p className="text-gray-500 text-sm">{project.client}</p>
              </div>

              {/* Project Type and Stage Tags */}
              <div className="flex gap-2 mb-4">
                <span className={`text-xs font-medium px-2 py-1 rounded ${getTypeColor(project.type)}`}>
                  {project.type}
                </span>
                <span className={`text-xs font-medium px-2 py-1 rounded ${getStageColor(project.stage)}`}>
                  {project.stage}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm font-bold text-gray-900">{project.progress}%</span>
                </div>
                <Progress 
                  percent={project.progress} 
                  showInfo={false}
                  strokeColor="#3b82f6"
                  className="mb-1"
                />
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-3 mb-5">
                <div className="flex items-center text-gray-600">
                  <TeamOutlined className="mr-2 text-gray-400" />
                  <span className="text-sm">{project.members} members</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <ClockCircleOutlined className="mr-2 text-gray-400" />
                  <span className="text-sm">{project.hoursAllocated}h allocated</span>
                </div>
                <div className="flex items-center text-red-600">
                  <ExclamationCircleOutlined className="mr-2 text-red-400" />
                  <span className="text-sm font-medium">{project.issues} issues</span>
                </div>
              </div>

              {/* Timeline */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between text-gray-600 text-sm">
                  <div className="flex items-center">
                    <CalendarOutlined className="mr-2 text-gray-400" />
                    <span>Start: {project.startDate}</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarOutlined className="mr-2 text-gray-400" />
                    <span>End: {project.endDate}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
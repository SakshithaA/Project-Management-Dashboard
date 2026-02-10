// components/project/ProjectCards.tsx
import { useState, useEffect } from "react";
import { Card, Progress, Tag, Avatar, Empty, Spin } from "antd";
import { 
  TeamOutlined, 
  ClockCircleOutlined, 
  ExclamationCircleOutlined,
  CalendarOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useProjects } from "../../hooks/useProjects";
import { LoadingSkeleton } from "../LoadingSkeleton";

interface ProjectCardsProps {
  searchText?: string;
  selectedTypes?: string[];
  selectedStatuses?: string[];
}

const getTypeColor = (type: string) => {
  switch(type.toLowerCase()) {
    case 'fullstack': return 'bg-blue-100 text-blue-800';
    case 'data engineering': 
    case 'data-engineering': return 'bg-purple-100 text-purple-800';
    case 'devops': return 'bg-green-100 text-green-800';
    case 'cloud': return 'bg-indigo-100 text-indigo-800';
    case 'mobile': return 'bg-pink-100 text-pink-800';
    case 'frontend': return 'bg-cyan-100 text-cyan-800';
    case 'backend': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusColor = (status: string) => {
  switch(status.toLowerCase()) {
    case 'not started': 
    case 'not-started': return 'bg-gray-100 text-gray-800';
    case 'in progress': 
    case 'in-progress': return 'bg-blue-100 text-blue-800';
    case 'on hold': 
    case 'on-hold': return 'bg-yellow-100 text-yellow-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    case 'completed': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function ProjectCards({ 
  searchText = "", 
  selectedTypes = [], 
  selectedStatuses = [] 
}: ProjectCardsProps) {
  const navigate = useNavigate();
  const { projects, loading, error } = useProjects();

  // Filter projects based on search text, selected types, and selected statuses
  const filteredProjects = projects.filter(project => {
    // Search filter
    const searchMatch = searchText === "" || 
      project.name.toLowerCase().includes(searchText.toLowerCase()) ||
      project.client.toLowerCase().includes(searchText.toLowerCase()) ||
      project.type.toLowerCase().includes(searchText.toLowerCase()) ||
      project.description.toLowerCase().includes(searchText.toLowerCase());

    // Type filter - map UI types to API types
    const typeMatch = selectedTypes.length === 0 || 
      selectedTypes.some(uiType => {
        const apiType = uiType.replace(' ', '-');
        return project.type.toLowerCase().includes(apiType.toLowerCase());
      });

    // Status filter - map UI statuses to API statuses
    const statusMatch = selectedStatuses.length === 0 || 
      selectedStatuses.some(uiStatus => {
        const apiStatus = uiStatus.replace(' ', '-');
        return project.status.toLowerCase().includes(apiStatus.toLowerCase());
      });

    return searchMatch && typeMatch && statusMatch;
  });

  const handleCardClick = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  if (loading) {
    return (
      <div className="mt-6 mx-5">
        <LoadingSkeleton type="card" count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 mx-5">
        <Empty
          description={
            <div>
              <p className="text-red-600">Error: {error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 text-blue-600 hover:text-blue-800"
              >
                Try Again
              </button>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div className="mt-6 mx-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
        <span className="text-sm text-gray-600">
          Showing {filteredProjects.length} of {projects.length} projects
          {(searchText || selectedTypes.length > 0 || selectedStatuses.length > 0) && 
            " (filtered)"}
        </span>
      </div>
      
      {filteredProjects.length === 0 ? (
        <Empty
          description={
            <span className="text-gray-600">
              No projects match your filters
            </span>
          }
          className="py-12"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="rounded-lg border border-gray-200 bg-white hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-gray-300"
              bodyStyle={{ padding: '20px' }}
              onClick={() => handleCardClick(project.id)}
            >
              {/* Project Title & Client */}
              <div className="mb-4">
                <h4 className="text-lg font-bold text-gray-900 mb-2">{project.name}</h4>
                <p className="text-gray-700 text-sm font-medium">{project.client}</p>
                {project.description && (
                  <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                    {project.description}
                  </p>
                )}
              </div>

              {/* Project Type and Status Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`text-xs font-semibold px-3 py-1.5 rounded ${getTypeColor(project.type)}`}>
                  {project.type.replace('-', ' ').toUpperCase()}
                </span>
                <span className={`text-xs font-semibold px-3 py-1.5 rounded ${getStatusColor(project.status)}`}>
                  {project.status.replace('-', ' ').toUpperCase()}
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
                  strokeColor="#2563eb"
                  strokeWidth={4}
                  className="mb-1"
                />
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-4 mb-5">
                <div className="flex items-center text-gray-700">
                  <TeamOutlined className="mr-2 text-gray-500" />
                  <span className="text-sm font-medium">{project.teamMemberCount || 0} members</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <ClockCircleOutlined className="mr-2 text-gray-500" />
                  <span className="text-sm font-medium">${Math.round((project.budget || 0) / 1000)}k</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <ExclamationCircleOutlined className="mr-2 text-gray-500" />
                  <span className="text-sm font-medium">{project.issueCount || 0} issues</span>
                </div>
              </div>

              {/* Timeline */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between text-gray-600 text-sm">
                  <div className="flex items-center">
                    <CalendarOutlined className="mr-2 text-gray-500" />
                    <span>Start: {new Date(project.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarOutlined className="mr-2 text-gray-500" />
                    <span>End: {new Date(project.endDate).toLocaleDateString()}</span>
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
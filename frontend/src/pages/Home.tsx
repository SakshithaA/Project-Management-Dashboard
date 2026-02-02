import { useState, useEffect } from "react";
import { 
  ProjectOutlined,
  RiseOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import StatsCards from "../components/StatsCards";
import ProjectCards from "../components/project/projectcard";
import Filter from "../features/projects/Filter";
import { api } from "../services/api";

export default function Home() {
  const [searchText, setSearchText] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    inProgress: 0,
    completed: 0,
    openIssues: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [projects, analytics] = await Promise.all([
        api.getProjects(),
        api.getAnalytics()
      ]);
      
      const inProgress = projects.filter(p => p.stage === "In Progress").length;
      const completed = projects.filter(p => p.stage === "Completed").length;
      
      setStats({
        totalProjects: projects.length,
        inProgress,
        completed,
        openIssues: analytics.openIssues
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearchText("");
    setSelectedTypes([]);
    setSelectedStatuses([]);
  };

  const overviewStats = [
    {
      title: "Total Projects",
      value: stats.totalProjects,
      icon: <ProjectOutlined />,
      color: "text-gray-600",
      bgColor: "bg-gray-50"
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      icon: <RiseOutlined />,
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: <CheckCircleOutlined />,
      color: "text-green-500",
      bgColor: "bg-green-50"
    },
    {
      title: "Open Issues",
      value: stats.openIssues,
      icon: <ExclamationCircleOutlined />,
      color: "text-red-500",
      bgColor: "bg-red-50"
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen p-9 bg-gray-50 margin">
        <div className="flex justify-between gap-2 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-1/4 h-20 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 animate-pulse h-16 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-9 bg-gray-50 margin">    
      {/* Stats Cards for Overview */}
      <div className="mb-6">
        <StatsCards stats={overviewStats} />
      </div>
      {/* Filters */}
      <Filter 
        onSearchChange={setSearchText}
        onTypeChange={setSelectedTypes}
        onStatusChange={setSelectedStatuses}
        onClearFilters={handleClearFilters}
      />

      {/* Project Cards */}
      <ProjectCards 
        searchText={searchText}
        selectedTypes={selectedTypes}
        selectedStatuses={selectedStatuses}
      />
    </div>
  );
}
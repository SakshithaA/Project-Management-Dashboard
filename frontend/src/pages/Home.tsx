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
import { api } from "../lib/api";
import { LoadingSkeleton } from "../components/LoadingSkeleton";

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
        api.getAnalyticsSummary()
      ]);
      
      const inProgress = projects.data.filter((p: any) => p.status === "in-progress").length;
      const completed = projects.data.filter((p: any) => p.status === "completed").length;
      
      setStats({
        totalProjects: analytics.totalProjects,
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
      color: "text-gray-700",
      bgColor: "bg-gray-100",
      iconColor: "text-gray-600",
      iconBgColor: "bg-gray-200"
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      icon: <RiseOutlined />,
      color: "text-blue-700",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      iconBgColor: "bg-blue-200"
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: <CheckCircleOutlined />,
      color: "text-green-700",
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      iconBgColor: "bg-green-200"
    },
    {
      title: "Open Issues",
      value: stats.openIssues,
      icon: <ExclamationCircleOutlined />,
      color: "text-red-700",
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
      iconBgColor: "bg-red-200"
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen p-9 bg-gray-50">
        <LoadingSkeleton type="stats" count={1} />
        <div className="mt-6">
          <LoadingSkeleton type="card" count={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-9 bg-gray-50">    
      {/* Stats Cards for Overview */}
      <div className="mb-8">
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
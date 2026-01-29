import { 
  ProjectOutlined,
  RiseOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import StatsCards from "../components/StatsCards";
import ProjectCards from "../components/projectcard";
import Filter from "../components/Filter";

export default function Home() {
  const [searchText, setSearchText] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const handleClearFilters = () => {
    setSearchText("");
    setSelectedTypes([]);
    setSelectedStatuses([]);
  };

  const overviewStats = [
    {
      title: "Total Projects",
      value: 5,
      icon: <ProjectOutlined />,
      color: "text-gray-600",
      bgColor: "bg-gray-50"
    },
    {
      title: "In Progress",
      value: 4,
      icon: <RiseOutlined />,
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      title: "Completed",
      value: 1,
      icon: <CheckCircleOutlined />,
      color: "text-green-500",
      bgColor: "bg-green-50"
    },
    {
      title: "Open Issues",
      value: 3,
      icon: <ExclamationCircleOutlined />,
      color: "text-red-500",
      bgColor: "bg-red-50"
    },
  ];

  return (
    <div className="min-h-screen p-9 bg-gray-50 margin ">    
      {/* Stats Cards for Overview */}
      <StatsCards stats={overviewStats} />
      
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

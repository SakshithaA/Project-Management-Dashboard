import { useState } from "react";
import StatsCards from "../components/StatsCards";
import Navbar from "../components/Navbar";
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

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Stats Cards */}
      <StatsCards />

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
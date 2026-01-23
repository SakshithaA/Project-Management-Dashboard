import { Input, Tag } from "antd";
import { useState } from "react";
const { Search } = Input;

interface FilterProps {
  onSearchChange?: (searchText: string) => void;
  onTypeChange?: (types: string[]) => void;
  onStatusChange?: (statuses: string[]) => void;
  onClearFilters?: () => void;
}

export default function Filter({ 
  onSearchChange, 
  onTypeChange, 
  onStatusChange,
  onClearFilters 
}: FilterProps) {
  const [searchText, setSearchText] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const projectTypes = ["fullstack", "data engineering", "devops", "cloud", "mobile", "frontend", "backend"];
  const statuses = ["not started", "in progress", "on hold", "completed", "cancelled"];

  const getTypeColor = (type: string) => {
    switch(type.toLowerCase()) {
      case 'fullstack': return 'bg-blue-100 border-blue-300 text-blue-700';
      case 'data engineering': return 'bg-purple-100 border-purple-300 text-purple-700';
      case 'devops': return 'bg-green-100 border-green-300 text-green-700';
      case 'cloud': return 'bg-indigo-100 border-indigo-300 text-indigo-700';
      case 'mobile': return 'bg-pink-100 border-pink-300 text-pink-700';
      case 'frontend': return 'bg-cyan-100 border-cyan-300 text-cyan-700';
      case 'backend': return 'bg-orange-100 border-orange-300 text-orange-700';
      default: return 'bg-gray-100 border-gray-300 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'not started': return 'bg-gray-100 border-gray-300 text-gray-700';
      case 'in progress': return 'bg-blue-100 border-blue-300 text-blue-700';
      case 'on hold': return 'bg-yellow-100 border-yellow-300 text-yellow-700';
      case 'completed': return 'bg-green-100 border-green-300 text-green-700';
      case 'cancelled': return 'bg-red-100 border-red-300 text-red-700';
      default: return 'bg-gray-100 border-gray-300 text-gray-700';
    }
  };

  const handleTypeClick = (type: string) => {
    let newSelectedTypes;
    if (selectedTypes.includes(type)) {
      newSelectedTypes = selectedTypes.filter(t => t !== type);
    } else {
      newSelectedTypes = [...selectedTypes, type];
    }
    setSelectedTypes(newSelectedTypes);
    onTypeChange?.(newSelectedTypes);
  };

  const handleStatusClick = (status: string) => {
    let newSelectedStatuses;
    if (selectedStatuses.includes(status)) {
      newSelectedStatuses = selectedStatuses.filter(s => s !== status);
    } else {
      newSelectedStatuses = [...selectedStatuses, status];
    }
    setSelectedStatuses(newSelectedStatuses);
    onStatusChange?.(newSelectedStatuses);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    onSearchChange?.(value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    onSearchChange?.(value);
  };

  const handleClearFilters = () => {
    setSearchText("");
    setSelectedTypes([]);
    setSelectedStatuses([]);
    onSearchChange?.("");
    onTypeChange?.([]);
    onStatusChange?.([]);
    onClearFilters?.();
  };

  return (
    <div className="bg-white rounded-xl p-6 mt-6 shadow-sm border border-gray-100 mx-5 hover:shadow-md transition-shadow duration-300">
      <div className="mb-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          {(searchText || selectedTypes.length > 0 || selectedStatuses.length > 0) && (
            <button
              onClick={handleClearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-all duration-200"
            >
              Clear all
            </button>
          )}
        </div>
        <Search
          placeholder="Search projects by name, client, or description..."
          className="w-full hover:shadow-sm transition-shadow duration-200"
          size="large"
          allowClear
          value={searchText}
          onChange={handleSearchChange}
          onSearch={handleSearch}
        />
      </div>

      <div className="mb-6 pb-2 border-b border-gray-100">
        <p className="font-semibold text-gray-800 mb-3">Project Type</p>
        <div className="flex flex-wrap gap-2">
          {projectTypes.map((type) => {
            const isActive = selectedTypes.includes(type);
            const colorClass = getTypeColor(type);
            
            return (
              <Tag 
                key={type} 
                className={`cursor-pointer px-3 py-1.5 rounded-lg border transition-all duration-200 transform hover:scale-105 hover:shadow-md ${
                  isActive 
                    ? `${colorClass} shadow-md scale-105 font-semibold` 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 hover:shadow-sm'
                }`}
                onClick={() => handleTypeClick(type)}
              >
                {type}
              </Tag>
            );
          })}
        </div>
      </div>

      <div>
        <p className="font-semibold text-gray-800 mb-3">Status</p>
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => {
            const isActive = selectedStatuses.includes(status);
            const colorClass = getStatusColor(status);
            
            return (
              <Tag 
                key={status} 
                className={`cursor-pointer px-3 py-1.5 rounded-lg border transition-all duration-200 transform hover:scale-105 hover:shadow-md ${
                  isActive 
                    ? `${colorClass} shadow-md scale-105 font-semibold` 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 hover:shadow-sm'
                }`}
                onClick={() => handleStatusClick(status)}
              >
                {status}
              </Tag>
            );
          })}
        </div>
      </div>

      {/* Active Filters Summary */}
      {(selectedTypes.length > 0 || selectedStatuses.length > 0) && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-sm font-medium text-gray-700 mb-2">Active Filters:</p>
          <div className="flex flex-wrap gap-2">
            {selectedTypes.map(type => (
              <Tag 
                key={type}
                className={`${getTypeColor(type)} px-3 py-1.5 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 font-medium`}
                closable
                onClose={() => handleTypeClick(type)}
              >
                Type: {type}
              </Tag>
            ))}
            {selectedStatuses.map(status => (
              <Tag 
                key={status}
                className={`${getStatusColor(status)} px-3 py-1.5 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 font-medium`}
                closable
                onClose={() => handleStatusClick(status)}
              >
                Status: {status}
              </Tag>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
import { Input, Select, Button, Card } from "antd";
import { SearchOutlined, FilterOutlined, ClearOutlined } from "@ant-design/icons";

const { Option } = Select;

interface FilterProps {
  onSearchChange: (value: string) => void;
  onTypeChange: (values: string[]) => void;
  onStatusChange: (values: string[]) => void;
  onClearFilters: () => void;
  searchText?: string;
  selectedTypes?: string[];
  selectedStatuses?: string[];
}

export default function Filter({ 
  onSearchChange, 
  onTypeChange, 
  onStatusChange, 
  onClearFilters,
  searchText = "",
  selectedTypes = [],
  selectedStatuses = []
}: FilterProps) {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const handleTypeChange = (values: string[]) => {
    onTypeChange(values);
  };

  const handleStatusChange = (values: string[]) => {
    onStatusChange(values);
  };

  const hasActiveFilters = searchText || selectedTypes.length > 0 || selectedStatuses.length > 0;

  return (
    <Card className="mb-6 border border-gray-300 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <Input
            placeholder="Search projects by name, client, or description..."
            prefix={<SearchOutlined className="text-gray-500" />}
            onChange={handleSearch}
            value={searchText}
            allowClear
            className="w-full"
            size="large"
          />
        </div>

        {/* Type Filter */}
        <div className="w-full lg:w-64">
          <Select
            mode="multiple"
            placeholder="Filter by type"
            suffixIcon={<FilterOutlined />}
            onChange={handleTypeChange}
            value={selectedTypes}
            allowClear
            className="w-full"
            size="large"
            maxTagCount={1}
          >
            <Option value="fullstack">Fullstack</Option>
            <Option value="data-engineering">Data Engineering</Option>
            <Option value="devops">DevOps</Option>
            <Option value="cloud">Cloud</Option>
            <Option value="mobile">Mobile</Option>
            <Option value="frontend">Frontend</Option>
            <Option value="backend">Backend</Option>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="w-full lg:w-64">
          <Select
            mode="multiple"
            placeholder="Filter by status"
            suffixIcon={<FilterOutlined />}
            onChange={handleStatusChange}
            value={selectedStatuses}
            allowClear
            className="w-full"
            size="large"
            maxTagCount={1}
          >
            <Option value="not-started">Not Started</Option>
            <Option value="in-progress">In Progress</Option>
            <Option value="on-hold">On Hold</Option>
            <Option value="completed">Completed</Option>
            <Option value="cancelled">Cancelled</Option>
          </Select>
        </div>

        {/* Clear Filters Button */}
        <Button 
          onClick={onClearFilters}
          disabled={!hasActiveFilters}
          icon={<ClearOutlined />}
          size="large"
          className="whitespace-nowrap"
        >
          Clear Filters
        </Button>
      </div>
      
      {/* Active filters indicator */}
      {hasActiveFilters && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 font-medium">
              Active filters:
            </div>
            <div className="flex flex-wrap gap-2">
              {searchText && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Search: "{searchText}"
                </span>
              )}
              {selectedTypes.map(type => (
                <span key={type} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Type: {type}
                </span>
              ))}
              {selectedStatuses.map(status => (
                <span key={status} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Status: {status}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
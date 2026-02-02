import { Input, Select, Button, Card } from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";

const { Option } = Select;

interface FilterProps {
  onSearchChange: (value: string) => void;
  onTypeChange: (values: string[]) => void;
  onStatusChange: (values: string[]) => void;
  onClearFilters: () => void;
}

export default function Filter({ 
  onSearchChange, 
  onTypeChange, 
  onStatusChange, 
  onClearFilters 
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

  return (
    <Card className="mb-6 border border-gray-200">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <Input
            placeholder="Search projects by title, client, or type..."
            prefix={<SearchOutlined className="text-gray-400" />}
            onChange={handleSearch}
            allowClear
            className="w-full"
          />
        </div>

        {/* Type Filter */}
        <div className="w-full lg:w-64">
          <Select
            mode="multiple"
            placeholder="Filter by type"
            suffixIcon={<FilterOutlined />}
            onChange={handleTypeChange}
            allowClear
            className="w-full"
          >
            <Option value="fullstack">Fullstack</Option>
            <Option value="data engineering">Data Engineering</Option>
            <Option value="devops">DevOps</Option>
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
            allowClear
            className="w-full"
          >
            <Option value="not started">Not Started</Option>
            <Option value="in progress">In Progress</Option>
            <Option value="on hold">On Hold</Option>
            <Option value="completed">Completed</Option>
            <Option value="cancelled">Cancelled</Option>
          </Select>
        </div>

        {/* Clear Filters Button */}
        <Button onClick={onClearFilters}>
          Clear Filters
        </Button>
      </div>
    </Card>
  );
}
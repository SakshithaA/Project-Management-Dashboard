import { Button, Tabs } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
  PlusOutlined,
  FileTextOutlined,
  BarChartOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get active key from current path
  const getActiveKey = () => {
    const path = location.pathname;
    if (path === '/' || path.includes('overview')) return 'overview';
    if (path.includes('analytics')) return 'analytics';
    if (path.includes('pocs')) return 'pocs';
    return 'overview';
  };

  const handleTabChange = (key: string) => {
    switch(key) {
      case 'overview':
        navigate('/');
        break;
      case 'analytics':
        navigate('/analytics');
        break;
      case 'pocs':
        navigate('/pocs');
        break;
      default:
        navigate('/');
    }
  };

  const handleAddProject = () => {
    navigate('/addproject');
  };

  const handleAddPOC = () => {
    navigate('/addpoc');
  };

  const handleGenerateReport = () => {
    navigate('/report');
  };

  return (
    <div className="p-10 bg-white">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-2">
        {/* Title Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Project Management
          </h1>
          <p className="text-gray-500">
            Executive overview of all active projects
          </p>
        </div>

        {/* Buttons Section */}
        <div className="flex flex-wrap gap-3">
          <Button
            icon={<PlusOutlined />}
            className="h-10 px-4 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 hover:border-gray-400 transition-all duration-150 flex items-center gap-2 font-normal"
            onClick={handleAddProject}
          >
            Add Project
          </Button>
          <Button
            icon={<PlusOutlined />}
            className="h-10 px-4 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 hover:border-gray-400 transition-all duration-150 flex items-center gap-2 font-normal"
            onClick={handleAddPOC}
          >
            Add POC
          </Button>
          <Button
            icon={<FileTextOutlined />}
            className="h-10 px-4 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 hover:border-gray-400 transition-all duration-150 flex items-center gap-2 font-normal"
            onClick={handleGenerateReport}
          >
            Generate Report
          </Button>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs
        activeKey={getActiveKey()}
        onChange={handleTabChange}
        items={[
          {
            key: "overview",
            label: (
              <span className="flex items-center gap-2 px-3 py-2">
                <AppstoreOutlined />
                <span className="font-medium">Overview</span>
              </span>
            ),
          },
          {
            key: "analytics",
            label: (
              <span className="flex items-center gap-2 px-3 py-2">
                <BarChartOutlined />
                <span className="font-medium">Analytics</span>
              </span>
            ),
          },
          {
            key: "pocs",
            label: (
              <span className="flex items-center gap-2 px-3 py-2">
                <PlusOutlined />
                <span className="font-medium">POCs</span>
              </span>
            ),
          },
        ]}
        className="mt-2"
      />
    </div>
  );
}
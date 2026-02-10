import { Button, Tabs } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
  PlusOutlined,
  FileTextOutlined,
  BarChartOutlined,
  AppstoreOutlined,
  ExperimentOutlined
} from "@ant-design/icons";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if current path is a form page (where navbar should be hidden)
  const isFormPage = () => {
    const path = location.pathname;
    const formRoutes = [
      '/addproject',
      '/addpoc',
      '/update-project/',
      '/update-poc/',
      '/update-intern/',
      '/update-team-member/',
      '/intern/edit'
    ];
    return formRoutes.some(route => path.includes(route));
  };

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
        navigate('/overview');
        break;
      case 'analytics':
        navigate('/analytics');
        break;
      case 'pocs':
        navigate('/pocs');
        break;
      default:
        navigate('/overview');
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

  // If on form page, don't render navbar
  if (isFormPage()) {
    return null;
  }

  return (
    <div className="pt-6 pl-8 pr-8 pb-2 bg-white border-b border-gray-300 shadow-sm">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-4">
        {/* Title Section */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">
            Project Management Dashboard
          </h1>
          <p className="text-gray-700 text-sm font-medium">
            Executive overview of all active projects and team performance
          </p>
        </div>

        {/* Buttons Section */}
        <div className="flex flex-wrap gap-3">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="bg-blue-600 hover:bg-blue-700 border-blue-600"
            onClick={handleAddProject}
            size="middle"
          >
            Add Project
          </Button>
          
          <Button
            type="primary"
            icon={<ExperimentOutlined />}
            className="bg-blue-600 hover:bg-blue-700 border-blue-600"
            onClick={handleAddPOC}
            size="middle"
          >
            Add POC
          </Button>
          
          <Button
            type="primary"
            icon={<FileTextOutlined />}
            className="bg-blue-600 hover:bg-blue-700 border-blue-600"
            onClick={handleGenerateReport}
            size="middle"
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
              <span className="flex items-center gap-2 px-4 py-2 font-medium">
                <AppstoreOutlined className="text-base" />
                <span>Overview</span>
              </span>
            ),
          },
          {
            key: "analytics",
            label: (
              <span className="flex items-center gap-2 px-4 py-2 font-medium">
                <BarChartOutlined className="text-base" />
                <span>Analytics</span>
              </span>
            ),
          },
          {
            key: "pocs",
            label: (
              <span className="flex items-center gap-2 px-4 py-2 font-medium">
                <ExperimentOutlined className="text-base" />
                <span>POCs</span>
              </span>
            ),
          },
        ]}
        className="border-b-0"
      />
    </div>
  );
}
// pages/ReportGenerate.tsx
import { useState, useEffect } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Checkbox, Select, Button, Card, Row, Col } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { api } from "../services/api";
import type { Project } from "../components/project/projectcard";

const { Option } = Select;

// Extended project interface
interface ExtendedProject extends Project {
  budget: number;
  selected: boolean;
}

export default function ReportGenerate() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [extendedProjects, setExtendedProjects] = useState<ExtendedProject[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const backPath = "/";
  // Initialize with extended project data
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const projects = await api.getProjects();
      const initialProjects: ExtendedProject[] = projects.map(project => ({
        ...project,
        budget: project.budget || 50,
        selected: true
      }));
      setExtendedProjects(initialProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter projects based on selected types and statuses
  const filteredProjects = extendedProjects.filter(project => {
    const typeMatch = selectedTypes.length === 0 || 
      selectedTypes.includes(project.type.toLowerCase());
    
    const statusMatch = selectedStatuses.length === 0 || 
      selectedStatuses.includes(project.stage.toLowerCase());
    
    return typeMatch && statusMatch;
  });

  // Calculate report statistics from SELECTED AND FILTERED projects
  const selectedAndFilteredProjects = filteredProjects.filter(project => project.selected);
  
  const totalProjects = selectedAndFilteredProjects.length;
  const totalBudget = selectedAndFilteredProjects.reduce((sum, project) => sum + (project.budget || 0), 0);
  const totalTeamMembers = selectedAndFilteredProjects.reduce((sum, project) => sum + project.members, 0);
  const totalHours = selectedAndFilteredProjects.reduce((sum, project) => sum + project.hoursAllocated, 0);
  const totalIssues = selectedAndFilteredProjects.reduce((sum, project) => sum + project.issues, 0);

  // Toggle individual project selection
  const handleProjectSelect = (projectId: number) => {
    setExtendedProjects(prev => 
      prev.map(project =>   
        project.id === projectId 
          ? { ...project, selected: !project.selected }
          : project
      )
    );
  };

  // Select/Deselect all projects
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setExtendedProjects(prev => 
      prev.map(project => ({ ...project, selected: checked }))
    );
  };

  // Select/Deselect all VISIBLE projects (filtered)
  const handleSelectAllVisible = (checked: boolean) => {
    setExtendedProjects(prev => 
      prev.map(project => {
        // Check if this project is in the filtered list
        const isFiltered = filteredProjects.some(fp => fp.id === project.id);
        if (isFiltered) {
          return { ...project, selected: checked };
        }
        return project;
      })
    );
  };

  // Generate the report text file
  const generateReportText = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    let report = `PROJECT MANAGEMENT REPORT
Generated on: ${dateStr}

═══════════════════════════════════════════════════════════════════════

EXECUTIVE SUMMARY

Total Projects: ${totalProjects}
Total Budget: $${totalBudget}k
Total Team Members: ${totalTeamMembers}
Total Hours: ${totalHours}h
Total Issues: ${totalIssues}

═══════════════════════════════════════════════════════════════════════

PROJECTS DETAILS
\n`;

    // Detailed breakdown - only selected projects
    selectedAndFilteredProjects.forEach((project, index) => {
      report += `${index + 1}. ${project.title}
───────────────────────────────────────────────────────────────────────────
Client: ${project.client}
Type: ${project.type}
Status: ${project.stage}
Progress: ${project.progress}%
Budget: $${project.budget}k
Team: ${project.members} members
Hours: ${project.hoursAllocated}h
Issues: ${project.issues}\n\n`;
    });

    report += `═══════════════════════════════════════════════════════════════════════

END OF REPORT`;

    return report;
  };

  const handleDownloadReport = () => {
    const reportText = generateReportText();
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Project_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="h-96 bg-gray-200 animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Navbar-like Back Bar */}
      <div className="bg-white border-b border-gray-200 px-0 py-4 m-0">
        <div className="max-w-4xl mx-auto">
          <Button 
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(backPath)}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors duration-150"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
      <div className="max-w-4xl mx-auto mt-10">
        {/* Header with Download button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Report Generate</h1>
            <p className="text-gray-600">Filter projects and generate reports</p>
          </div>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            size="large"
            onClick={handleDownloadReport}
            className="bg-black hover:bg-gray-800 border-black"
          >
            Download Report
          </Button>
        </div>

        {/* Main Content - 2 Column Layout */}
        <Row gutter={24}>
          {/* Left Column - Filters and Summary */}
          <Col span={8}>
            {/* Filters Section */}
            <Card 
              title="Filter projects by type and status" 
              className="mb-6 border border-gray-200"
            >
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Project Type</h4>
                  <Select
                    mode="multiple"
                    placeholder="Select types"
                    value={selectedTypes}
                    onChange={setSelectedTypes}
                    className="w-full"
                    size="middle"
                  >
                    <Option value="fullstack">fullstack</Option>
                    <Option value="data engineering">data engineering</Option>
                    <Option value="devops">devops</Option>
                    <Option value="cloud">cloud</Option>
                    <Option value="mobile">mobile</Option>
                    <Option value="frontend">frontend</Option>
                    <Option value="backend">backend</Option>
                  </Select>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Status</h4>
                  <Select
                    mode="multiple"
                    placeholder="Select statuses"
                    value={selectedStatuses}
                    onChange={setSelectedStatuses}
                    className="w-full"
                    size="middle"
                  >
                    <Option value="not started">not started</Option>
                    <Option value="in progress">in progress</Option>
                    <Option value="on hold">on hold</Option>
                    <Option value="completed">completed</Option>
                    <Option value="cancelled">cancelled</Option>
                  </Select>
                </div>
              </div>
            </Card>

            {/* Report Summary Section */}
            <Card 
              title="Report Summary" 
              className="border border-gray-200"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">Selected Projects</span>
                  <span className="font-medium">{totalProjects}</span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">Total Budget</span>
                  <span className="font-medium">${totalBudget}k</span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">Team Members</span>
                  <span className="font-medium">{totalTeamMembers}</span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">Total Hours</span>
                  <span className="font-medium">{totalHours}h</span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">Total Issues</span>
                  <span className="font-medium">{totalIssues}</span>
                </div>
              </div>
            </Card>
          </Col>

          {/* Right Column - Project List */}
          <Col span={16}>
            <Card 
              className="border border-gray-200 h-full"
              title={
                <div className="flex justify-between items-center">
                  <span>Project List</span>
                  <div className="flex items-center space-x-4">
                    <Checkbox
                      checked={filteredProjects.every(p => p.selected) && filteredProjects.length > 0}
                      indeterminate={filteredProjects.some(p => p.selected) && !filteredProjects.every(p => p.selected)}
                      onChange={(e) => handleSelectAllVisible(e.target.checked)}
                    >
                      Select all visible ({filteredProjects.filter(p => p.selected).length}/{filteredProjects.length})
                    </Checkbox>
                    <Checkbox
                      checked={selectAll}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    >
                      Select all projects
                    </Checkbox>
                  </div>
                </div>
              }
            >
              <div className="space-y-4">
                {filteredProjects.map((project) => (
                  <div 
                    key={project.id}
                    className={`p-4 border rounded ${project.selected ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}`}
                  >
                    <div className="flex items-start">
                      <Checkbox
                        checked={project.selected}
                        onChange={() => handleProjectSelect(project.id)}
                        className="mr-3 mt-1"
                      />
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900">{project.title}</h4>
                          <span className="text-sm text-gray-600">{project.client}</span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <span className="text-gray-500">Budget: </span>
                            <span className="font-medium">${project.budget}k</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Team: </span>
                            <span className="font-medium">{project.members} members</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Progress: </span>
                            <span className="font-medium">{project.progress}%</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Hours: </span>
                            <span className="font-medium">{project.hoursAllocated}h</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="text-gray-500">Status: </span>
                          <span className="ml-1 font-medium">{project.stage}</span>
                          <span className="mx-2">|</span>
                          <span className="text-gray-500">Type: </span>
                          <span className="ml-1 font-medium">{project.type}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
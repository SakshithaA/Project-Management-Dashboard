import { useState, useEffect } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Checkbox, Select, Button, Card, Row, Col, Spin, Alert, Typography } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { api } from "../lib/api";
import { LoadingSkeleton } from "../components/LoadingSkeleton";

const { Option } = Select;
const { Title, Text } = Typography;

interface ExtendedProject {
  id: string;
  name: string;
  client: string;
  type: string;
  status: string;
  progress: number;
  budget: number | null;
  teamMemberCount?: number;
  hoursAllocated?: number;
  issueCount?: number;
  selected: boolean;
}

export default function ReportGenerate() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [extendedProjects, setExtendedProjects] = useState<ExtendedProject[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getProjects();
      const initialProjects: ExtendedProject[] = response.data.map(project => ({
        ...project,
        hoursAllocated: project.budget ? Math.round(project.budget / 50) : 0,
        issueCount: project.issueCount || 0,
        selected: true
      }));
      setExtendedProjects(initialProjects);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = extendedProjects.filter(project => {
    const typeMatch = selectedTypes.length === 0 || 
      selectedTypes.includes(project.type.toLowerCase());
    
    const statusMatch = selectedStatuses.length === 0 || 
      selectedStatuses.includes(project.status.toLowerCase());
    
    return typeMatch && statusMatch;
  });

  const selectedAndFilteredProjects = filteredProjects.filter(project => project.selected);
  
  const totalProjects = selectedAndFilteredProjects.length;
  const totalBudget = selectedAndFilteredProjects.reduce((sum, project) => sum + (project.budget || 0), 0);
  const totalTeamMembers = selectedAndFilteredProjects.reduce((sum, project) => sum + (project.teamMemberCount || 0), 0);
  const totalHours = selectedAndFilteredProjects.reduce((sum, project) => sum + (project.hoursAllocated || 0), 0);
  const totalIssues = selectedAndFilteredProjects.reduce((sum, project) => sum + (project.issueCount || 0), 0);
  const averageProgress = selectedAndFilteredProjects.length > 0 
    ? selectedAndFilteredProjects.reduce((sum, project) => sum + project.progress, 0) / selectedAndFilteredProjects.length
    : 0;

  const handleProjectSelect = (projectId: string) => {
    setExtendedProjects(prev => 
      prev.map(project =>   
        project.id === projectId 
          ? { ...project, selected: !project.selected }
          : project
      )
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setExtendedProjects(prev => 
      prev.map(project => ({ ...project, selected: checked }))
    );
  };

  const handleSelectAllVisible = (checked: boolean) => {
    setExtendedProjects(prev => 
      prev.map(project => {
        const isFiltered = filteredProjects.some(fp => fp.id === project.id);
        if (isFiltered) {
          return { ...project, selected: checked };
        }
        return project;
      })
    );
  };

  const generateReportText = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    let report = `PROJECT MANAGEMENT REPORT
Generated on: ${dateStr}
═══════════════════════════════════════════════════════════════════════

EXECUTIVE SUMMARY
• Total Projects: ${totalProjects}
• Total Budget: $${totalBudget.toLocaleString()}
• Total Team Members: ${totalTeamMembers}
• Total Hours Allocated: ${totalHours}h
• Total Issues: ${totalIssues}
• Average Progress: ${averageProgress.toFixed(1)}%

═══════════════════════════════════════════════════════════════════════

PROJECT DETAILS
`;

    selectedAndFilteredProjects.forEach((project, index) => {
      report += `\n${index + 1}. ${project.name}
───────────────────────────────────────────────────────────────────────────
   Client: ${project.client}
   Type: ${project.type.replace('-', ' ').toUpperCase()}
   Status: ${project.status.replace('-', ' ').toUpperCase()}
   Progress: ${project.progress}%
   Budget: $${project.budget ? project.budget.toLocaleString() : 'N/A'}
   Team Members: ${project.teamMemberCount || 0}
   Hours Allocated: ${project.hoursAllocated || 0}h
   Issues: ${project.issueCount || 0}`;
    });

    report += `\n\n═══════════════════════════════════════════════════════════════════════

PROJECT TYPE DISTRIBUTION
`;

    const typeCount: Record<string, number> = {};
    selectedAndFilteredProjects.forEach(project => {
      typeCount[project.type] = (typeCount[project.type] || 0) + 1;
    });

    Object.entries(typeCount).forEach(([type, count]) => {
      const percentage = ((count / totalProjects) * 100).toFixed(1);
      report += `• ${type.replace('-', ' ').toUpperCase()}: ${count} projects (${percentage}%)\n`;
    });

    report += `\n═══════════════════════════════════════════════════════════════════════

STATUS DISTRIBUTION
`;

    const statusCount: Record<string, number> = {};
    selectedAndFilteredProjects.forEach(project => {
      statusCount[project.status] = (statusCount[project.status] || 0) + 1;
    });

    Object.entries(statusCount).forEach(([status, count]) => {
      const percentage = ((count / totalProjects) * 100).toFixed(1);
      report += `• ${status.replace('-', ' ').toUpperCase()}: ${count} projects (${percentage}%)\n`;
    });

    report += `\n═══════════════════════════════════════════════════════════════════════

END OF REPORT
═══════════════════════════════════════════════════════════════════════`;

    return report;
  };

  const handleDownloadReport = async () => {
    try {
      setGenerating(true);
      
      if (selectedAndFilteredProjects.length === 0) {
        Alert.error('Please select at least one project');
        return;
      }

      const projectIds = selectedAndFilteredProjects.map(p => p.id);
      const types = selectedTypes.length > 0 ? selectedTypes : undefined;
      const statuses = selectedStatuses.length > 0 ? selectedStatuses : undefined;

      try {
        // Try to generate report via API
        const apiReport = await api.generateReport({ projectIds, types, statuses });
        const reportText = apiReport.report;
        
        downloadReport(reportText);
      } catch (apiError) {
        // Fallback to client-side generation if API fails
        console.warn('API report generation failed, using client-side:', apiError);
        const reportText = generateReportText();
        downloadReport(reportText);
      }
    } catch (error) {
      Alert.error('Failed to generate report');
      console.error('Error generating report:', error);
    } finally {
      setGenerating(false);
    }
  };

  const downloadReport = (reportText: string) => {
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const date = new Date().toISOString().split('T')[0];
    a.download = `Project_Report_${date}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <LoadingSkeleton type="card" count={2} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Navbar-like Back Bar */}
      <div className="bg-white border-b border-gray-300 px-0 py-4 mb-6 shadow-sm rounded-lg">
        <div className="max-w-6xl mx-auto">
          <Button 
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(`/overview`)}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors duration-150 font-medium"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto">
        {/* Header with Download button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Title level={2} className="text-gray-900 mb-2">Report Generation</Title>
            <Text className="text-gray-700 font-medium">Filter projects and generate comprehensive reports</Text>
          </div>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            size="large"
            onClick={handleDownloadReport}
            loading={generating}
            disabled={selectedAndFilteredProjects.length === 0}
            className="bg-blue-600 hover:bg-blue-700 border-blue-600 shadow-sm"
          >
            Download Report
          </Button>
        </div>

        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            className="mb-6"
            action={
              <Button size="small" onClick={fetchProjects}>
                Retry
              </Button>
            }
          />
        )}

        {/* Main Content - 2 Column Layout */}
        <Row gutter={24}>
          {/* Left Column - Filters and Summary */}
          <Col span={8}>
            {/* Filters Section */}
            <Card 
              title={
                <div className="font-semibold text-gray-900">
                  Filter Projects
                </div>
              }
              className="mb-6 border border-gray-300 shadow-sm"
            >
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Project Type</h4>
                  <Select
                    mode="multiple"
                    placeholder="Select types"
                    value={selectedTypes}
                    onChange={setSelectedTypes}
                    className="w-full"
                    size="middle"
                    allowClear
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

                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Status</h4>
                  <Select
                    mode="multiple"
                    placeholder="Select statuses"
                    value={selectedStatuses}
                    onChange={setSelectedStatuses}
                    className="w-full"
                    size="middle"
                    allowClear
                  >
                    <Option value="not-started">Not Started</Option>
                    <Option value="in-progress">In Progress</Option>
                    <Option value="on-hold">On Hold</Option>
                    <Option value="completed">Completed</Option>
                    <Option value="cancelled">Cancelled</Option>
                  </Select>
                </div>
              </div>
            </Card>

            {/* Report Summary Section */}
            <Card 
              title="Report Summary" 
              className="border border-gray-300 shadow-sm"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700 font-medium">Selected Projects</span>
                  <span className="font-bold text-gray-900">{totalProjects}</span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700 font-medium">Total Budget</span>
                  <span className="font-bold text-gray-900">${totalBudget.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700 font-medium">Team Members</span>
                  <span className="font-bold text-gray-900">{totalTeamMembers}</span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700 font-medium">Total Hours</span>
                  <span className="font-bold text-gray-900">{totalHours}h</span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700 font-medium">Total Issues</span>
                  <span className="font-bold text-gray-900">{totalIssues}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-t border-gray-200 pt-4">
                  <span className="text-gray-700 font-medium">Average Progress</span>
                  <span className="font-bold text-gray-900">{averageProgress.toFixed(1)}%</span>
                </div>
              </div>
            </Card>
          </Col>

          {/* Right Column - Project List */}
          <Col span={16}>
            <Card 
              className="border border-gray-300 h-full shadow-sm"
              title={
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Project Selection</span>
                  <div className="flex items-center space-x-4">
                    <Checkbox
                      checked={filteredProjects.every(p => p.selected) && filteredProjects.length > 0}
                      indeterminate={filteredProjects.some(p => p.selected) && !filteredProjects.every(p => p.selected)}
                      onChange={(e) => handleSelectAllVisible(e.target.checked)}
                      className="font-medium"
                    >
                      Select all visible ({filteredProjects.filter(p => p.selected).length}/{filteredProjects.length})
                    </Checkbox>
                    <Checkbox
                      checked={selectAll}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="font-medium"
                    >
                      Select all projects
                    </Checkbox>
                  </div>
                </div>
              }
            >
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {filteredProjects.length === 0 ? (
                  <div className="text-center py-8 text-gray-600">
                    <Text className="font-medium">No projects match the selected filters</Text>
                  </div>
                ) : (
                  filteredProjects.map((project) => (
                    <div 
                      key={project.id}
                      className={`p-4 border rounded-lg transition-all duration-200 ${
                        project.selected 
                          ? 'border-blue-400 bg-blue-50 shadow-sm' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-start">
                        <Checkbox
                          checked={project.selected}
                          onChange={() => handleProjectSelect(project.id)}
                          className="mr-3 mt-1"
                        />
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900 text-lg">{project.name}</h4>
                              <Text className="text-gray-700 font-medium">{project.client}</Text>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded text-xs font-bold ${
                                project.status === 'completed' ? 'bg-green-100 text-green-800' :
                                project.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                project.status === 'on-hold' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {project.status.replace('-', ' ').toUpperCase()}
                              </span>
                              <span className={`px-2 py-1 rounded text-xs font-bold ${
                                project.type === 'fullstack' ? 'bg-blue-100 text-blue-800' :
                                project.type === 'data-engineering' ? 'bg-purple-100 text-purple-800' :
                                project.type === 'devops' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {project.type.replace('-', ' ').toUpperCase()}
                              </span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                            <div>
                              <span className="text-gray-600 font-medium">Budget: </span>
                              <span className="font-bold text-gray-900">
                                ${project.budget ? project.budget.toLocaleString() : 'N/A'}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600 font-medium">Team: </span>
                              <span className="font-bold text-gray-900">{project.teamMemberCount || 0} members</span>
                            </div>
                            <div>
                              <span className="text-gray-600 font-medium">Progress: </span>
                              <span className="font-bold text-gray-900">{project.progress}%</span>
                            </div>
                            <div>
                              <span className="text-gray-600 font-medium">Hours: </span>
                              <span className="font-bold text-gray-900">{project.hoursAllocated || 0}h</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
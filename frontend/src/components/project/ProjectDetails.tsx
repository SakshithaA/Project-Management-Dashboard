import { useState, useEffect } from "react";
import { Card, Progress, Tag, Avatar, Button, Divider, Tabs, Spin, Alert } from "antd";
import { 
  ArrowLeftOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  EditOutlined,
  LoadingOutlined
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../lib/api";
import dayjs from "dayjs";
import { LoadingSkeleton } from "../../components/LoadingSkeleton";

const { TabPane } = Tabs;

interface TeamMember {
  id: string;
  name: string;
  role: string;
  hoursAllocated: number;
  avatarColor?: string;
}

export default function ProjectDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("team");
  const [project, setProject] = useState<any>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchProjectData();
    }
  }, [id]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [projectData, membersData, issuesData] = await Promise.all([
        api.getProject(id!),
        api.getProjectMembers(id!),
        api.getProjectIssues(id!)
      ]);
      
      setProject(projectData);
      setTeamMembers(membersData.data || []);
      setIssues(issuesData.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load project data');
      console.error('Error fetching project data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProject = () => {
    if (project) {
      navigate(`/update-project/${project.id}`, { state: { project } });
    }
  };

  const calculateTimelineProgress = () => {
    if (!project) return 0;
    
    try {
      const startDate = dayjs(project.startDate);
      const endDate = dayjs(project.endDate);
      const today = dayjs();
      
      const totalDuration = endDate.diff(startDate);
      const elapsedDuration = today.diff(startDate);
      
      if (totalDuration <= 0) return 100;
      if (elapsedDuration <= 0) return 0;
      
      const progress = Math.min(100, Math.round((elapsedDuration / totalDuration) * 100));
      return progress;
    } catch (error) {
      return 50;
    }
  };

  const calculateDaysRemaining = () => {
    if (!project) return "Date calculation error";
    
    try {
      const endDate = dayjs(project.endDate);
      const today = dayjs();
      const daysRemaining = endDate.diff(today, 'day');
      return daysRemaining > 0 ? `${daysRemaining} days remaining` : "Deadline passed";
    } catch (error) {
      return "Date calculation error";
    }
  };

  const handleMemberClick = (member: TeamMember) => {
    navigate(`/team-member/${member.id}`, { 
      state: { 
        member,
        projectTitle: project?.name,
        projectId: project?.id
      }
    });
  };

  const getTypeColor = (type: string) => {
    switch(type.toLowerCase()) {
      case 'fullstack': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'data-engineering': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'devops': return 'bg-green-50 text-green-700 border-green-200';
      case 'cloud': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'mobile': return 'bg-pink-50 text-pink-700 border-pink-200';
      case 'frontend': return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'backend': return 'bg-orange-50 text-orange-700 border-orange-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'not-started': return 'bg-gray-100 text-gray-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case "team":
        return (
          <div className="space-y-4">
            {teamMembers.length > 0 ? teamMembers.map((member) => (
              <div 
                key={member.id} 
                className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer border border-gray-200 hover:border-blue-300"
                onClick={() => handleMemberClick(member)}
              >
                <div className="flex items-center">
                  <Avatar 
                    size="large"
                    style={{ backgroundColor: member.avatarColor || '#3b82f6' }}
                    className="mr-3"
                  >
                    {member.name.split(' ').map((n: string) => n[0]).join('')}
                  </Avatar>
                  <div className="ml-5">
                    <div className="font-medium text-gray-900">{member.name}</div>
                    <div className="text-sm text-gray-600">{member.role}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">{member.hoursAllocated}h</div>
                  <div className="text-sm text-gray-500">allocated</div>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500">
                <TeamOutlined className="text-3xl text-gray-300 mb-3" />
                <p>No team members assigned</p>
              </div>
            )}
          </div>
        );
      
      case "issues":
        return (
          <div className="space-y-3">
            {issues.length > 0 ? (
              issues.map((issue) => (
                <div key={issue.id} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start">
                    <ExclamationCircleOutlined className="text-red-500 mt-1 mr-3" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{issue.title}</div>
                      <div className="text-sm text-gray-600 mt-1">{issue.description}</div>
                      <div className="text-xs text-gray-500 mt-2">
                        Reported by: {issue.reportedBy} on {new Date(issue.reportedDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Tag color={
                          issue.status === 'open' ? 'red' :
                          issue.status === 'in-progress' ? 'orange' :
                          issue.status === 'resolved' ? 'green' : 'default'
                        }>
                          {issue.status}
                        </Tag>
                        <Tag color={
                          issue.priority === 'critical' ? 'red' :
                          issue.priority === 'high' ? 'orange' :
                          issue.priority === 'medium' ? 'blue' : 'green'
                        }>
                          {issue.priority}
                        </Tag>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <CheckCircleOutlined className="text-3xl text-green-300 mb-3" />
                <p className="text-gray-500">No issues reported</p>
              </div>
            )}
          </div>
        );
      
      case "overview":
        if (!project) return null;
        
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <TeamOutlined className="text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">Team Members</span>
              </div>
              <span className="font-medium">{teamMembers.length}</span>
            </div>
            <Divider className="my-2" />
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ClockCircleOutlined className="text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">Total Hours</span>
              </div>
              <span className="font-medium">{teamMembers.reduce((sum, m) => sum + m.hoursAllocated, 0)}h</span>
            </div>
            <Divider className="my-2" />
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ExclamationCircleOutlined className="text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">Open Issues</span>
              </div>
              <span className="font-medium">{issues.filter(i => i.status === 'open').length}</span>
            </div>
            <Divider className="my-2" />
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CalendarOutlined className="text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">Project Status</span>
              </div>
              <span className={`font-medium px-2 py-1 rounded text-xs ${getStatusColor(project.status)}`}>
                {project.status.replace('-', ' ').toUpperCase()}
              </span>
            </div>
            <Divider className="my-2" />
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <InfoCircleOutlined className="text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">Project Type</span>
              </div>
              <span className={`font-medium px-2 py-1 rounded text-xs ${getTypeColor(project.type)}`}>
                {project.type.replace('-', ' ').toUpperCase()}
              </span>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <LoadingSkeleton type="card" count={3} />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <Alert
            message="Error Loading Project"
            description={error || "Project not found"}
            type="error"
            showIcon
            className="mb-4"
          />
          <Button 
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/overview")}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const timelineProgress = calculateTimelineProgress();
  const daysRemaining = calculateDaysRemaining();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar-like Back Bar */}
      <div className="bg-white border-b border-gray-300 px-7 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Button 
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/overview")}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors duration-150"
          >
            Back to Dashboard
          </Button>
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={handleUpdateProject}
            className="bg-blue-600 hover:bg-blue-700 border-blue-600"
          >
            Update Project
          </Button>
        </div>
      </div>

      {/* Project Content */}
      <div className="p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Project Header */}
          <div className="mb-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
            <p className="text-gray-700 text-lg font-medium">{project.client}</p>
          </div>

          {/* Project Tags */}
          <div className="flex flex-wrap gap-2">
            <Tag className={`text-sm font-semibold px-3 py-1.5 ${getTypeColor(project.type)}`}>
              {project.type.replace('-', ' ').toUpperCase()}
            </Tag>
            <Tag className={`text-sm font-semibold px-3 py-1.5 ${getStatusColor(project.status)}`}>
              {project.status.replace('-', ' ').toUpperCase()}
            </Tag>
          </div>

          {/* Project Description */}
          <Card className="border border-gray-300 rounded-lg shadow-sm">
            <p className="text-gray-700 text-sm leading-relaxed">{project.description || "Project description not available"}</p>
          </Card>

          {/* Progress Stats Boxes - Now horizontal instead of grid */}
          <div className="flex gap-4">
            {/* Progress Box */}
            <Card className="border border-gray-300 rounded-lg text-center shadow-sm flex-1">
              <div className="text-3xl font-bold text-gray-900 mb-2">{project.progress}%</div>
              <div className="text-sm text-gray-600 font-medium">Progress</div>
              <Progress 
                percent={project.progress} 
                strokeColor="#2563eb"
                strokeWidth={4}
                showInfo={false}
                className="mt-3"
              />
            </Card>

            {/* Team Size Box */}
            <Card className="border border-gray-300 rounded-lg text-center shadow-sm flex-1">
              <div className="text-3xl font-bold text-gray-900 mb-2">{teamMembers.length}</div>
              <div className="text-sm text-gray-600 font-medium">Team Size</div>
              <div className="mt-3">
                <TeamOutlined className="text-2xl text-blue-500" />
              </div>
            </Card>

            {/* Budget Box */}
            <Card className="border border-gray-300 rounded-lg text-center shadow-sm flex-1">
              <div className="text-3xl font-bold text-gray-900 mb-2">${Math.round((project.budget || 0) / 1000)}k</div>
              <div className="text-sm text-gray-600 font-medium">Budget</div>
              <div className="mt-3">
                <ClockCircleOutlined className="text-2xl text-green-500" />
              </div>
            </Card>
          </div>

          {/* Project Timeline */}
          <Card 
            title={
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-lg font-semibold text-gray-900">Project Timeline</span>
              </div>
            }
            className="border border-gray-300 rounded-lg shadow-sm"
          >
            <div className="space-y-4 m-3">
              <div className="grid grid-cols-2">
                <div>
                  <div className="text-sm text-gray-600 mb-1 font-medium">Started</div>
                  <div className="font-medium text-gray-900">{new Date(project.startDate).toLocaleDateString()}</div>
                </div>
                <div className="text-right mx-7">
                  <div className="text-sm text-gray-600 mb-1 font-medium">Deadline</div>
                  <div className="font-medium text-gray-900">{new Date(project.endDate).toLocaleDateString()}</div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span className="m-0 font-medium">{daysRemaining}</span>
                  <span className="mx-7 font-medium">{timelineProgress}% of timeline elapsed</span>
                </div>
                <Progress 
                  percent={timelineProgress} 
                  strokeColor="#059669"
                  strokeWidth={6}
                />
              </div>
            </div>
          </Card>

          {/* Tabbed Interface - Takes full width like above components */}
          <Card 
            className="border border-gray-300 rounded-lg shadow-sm"
            bodyStyle={{ padding: 0 }}
          >
            {/* Tabs Header */}
            <div className="border-b border-gray-300">
              <Tabs 
                activeKey={activeTab} 
                onChange={setActiveTab}
                centered
                className="px-4"
              >
                <TabPane 
                  tab={
                    <span className="flex items-center gap-2">
                      <TeamOutlined />
                      <span>Team Members</span>
                      <Tag className="ml-1 bg-blue-100 text-blue-700">{teamMembers.length}</Tag>
                    </span>
                  } 
                  key="team"
                />
                <TabPane 
                  tab={
                    <span className="flex items-center gap-2">
                      <ExclamationCircleOutlined />
                      <span>Issues</span>
                      <Tag className="ml-1 bg-red-100 text-red-700">{issues.length}</Tag>
                    </span>
                  } 
                  key="issues"
                />
                <TabPane 
                  tab={
                    <span className="flex items-center gap-2">
                      <InfoCircleOutlined />
                      <span>Overview</span>
                    </span>
                  } 
                  key="overview"
                />
              </Tabs>
            </div>

            {/* Tab Content */}
            <div className="p-4">
              {renderTabContent()}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
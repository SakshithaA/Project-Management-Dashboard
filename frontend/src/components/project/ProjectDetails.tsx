import { useState, useEffect } from "react";
import { Card, Progress, Tag, Avatar, Button, Divider, Tabs } from "antd";
import { 
  ArrowLeftOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  EditOutlined
} from "@ant-design/icons";
import { getTypeColor, getStageColor } from "./projectcard";
import type { Project } from "./projectcard";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import type { TeamMember, Issue} from "../../services/api";
const { TabPane } = Tabs;

interface ProjectDetailProps {
  projectId: number;
}

export default function ProjectDetail({ projectId }: ProjectDetailProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("team");
  const [project, setProject] = useState<Project | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjectData();
  }, [projectId]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      const [projectData, teamData, issuesData] = await Promise.all([
        api.getProject(projectId),
        api.getTeamMembers(projectId),
        api.getIssues(projectId)
      ]);
      
      setProject(projectData);
      setTeamMembers(teamData);
      setIssues(issuesData);
    } catch (error) {
      console.error('Error fetching project data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Update Project button click
  const handleUpdateProject = () => {
    if (project) {
      navigate(`/update-project/${project.id}`, { state: { project } });
    }
  };

  // Calculate timeline progress
  const calculateTimelineProgress = () => {
    if (!project) return 50;
    
    try {
      const startDate = new Date(project.startDate.split('/').reverse().join('-'));
      const endDate = new Date(project.endDate.split('/').reverse().join('-'));
      const today = new Date();
      
      const totalDuration = endDate.getTime() - startDate.getTime();
      const elapsedDuration = today.getTime() - startDate.getTime();
      
      if (totalDuration <= 0) return 100;
      if (elapsedDuration <= 0) return 0;
      
      const progress = Math.min(100, Math.round((elapsedDuration / totalDuration) * 100));
      return progress;
    } catch (error) {
      return 50;
    }
  };

  const timelineProgress = calculateTimelineProgress();

  // Calculate days remaining
  const calculateDaysRemaining = () => {
    if (!project) return "Date calculation error";
    
    try {
      const endDate = new Date(project.endDate.split('/').reverse().join('-'));
      const today = new Date();
      const timeDiff = endDate.getTime() - today.getTime();
      const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return daysRemaining > 0 ? `${daysRemaining} days remaining` : "Deadline passed";
    } catch (error) {
      return "Date calculation error";
    }
  };

  // Handle team member click
  const handleMemberClick = (member: TeamMember) => {
    navigate(`/team-member/${member.id}`, { 
      state: { 
        member,
        projectTitle: project?.title,
        projectId: project?.id
      }
    });
  };

  // Render content based on active tab
  const renderTabContent = () => {
    if (loading) {
      return <div>Loading...</div>;
    }

    switch(activeTab) {
      case "team":
        return (
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div 
                key={member.id} 
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer border border-gray-200 hover:border-blue-300"
                onClick={() => handleMemberClick(member)}
              >
                <div className="flex items-center">
                  <Avatar 
                    size="large"
                    style={{ backgroundColor: member.avatarColor }}
                    className="mr-3"
                  >
                    {member.name.split(' ').map((n: string) => n[0]).join('')}
                  </Avatar>
                  <div className="ml-5">
                    <div className="font-medium text-gray-900">{member.name}</div>
                    <div className="text-sm text-gray-500">{member.role}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">{member.hoursAllocated}h</div>
                  <div className="text-sm text-gray-500">allocated</div>
                </div>
              </div>
            ))}
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
                        Reported by: {issue.reporter} on {issue.reportedDate}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Tag color={
                          issue.status === 'open' ? 'red' :
                          issue.status === 'in-progress' ? 'orange' :
                          issue.status === 'resolved' ? 'green' : 'default'
                        }>
                          {issue.status}
                        </Tag>
                        {issue.priority && (
                          <Tag color={
                            issue.priority === 'critical' ? 'red' :
                            issue.priority === 'high' ? 'orange' :
                            issue.priority === 'medium' ? 'blue' : 'green'
                          }>
                            {issue.priority}
                          </Tag>
                        )}
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
              <span className="font-medium">{project.members}</span>
            </div>
            <Divider className="my-2" />
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ClockCircleOutlined className="text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">Total Hours</span>
              </div>
              <span className="font-medium">{project.hoursAllocated}h</span>
            </div>
            <Divider className="my-2" />
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ExclamationCircleOutlined className="text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">Open Issues</span>
              </div>
              <span className="font-medium">{issues.length}</span>
            </div>
            <Divider className="my-2" />
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CalendarOutlined className="text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">Project Stage</span>
              </div>
              <span className={`font-medium px-2 py-1 rounded text-xs ${getStageColor(project.stage)}`}>
                {project.stage}
              </span>
            </div>
            <Divider className="my-2" />
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <InfoCircleOutlined className="text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">Project Type</span>
              </div>
              <span className={`font-medium px-2 py-1 rounded text-xs ${getTypeColor(project.type)}`}>
                {project.type}
              </span>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (loading || !project) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="text-center py-12">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* Navbar-like Back Bar */}
      <div className="bg-white border-b border-gray-200 px-7 py-4">
        <div className="max-w-6xl mx-auto">
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
              className="bg-blue-600 hover:bg-blue-700 align-middle float-right"
            >
              Update Project
            </Button>
          </div>
        </div> 

      {/* Project Content */}
      <div className="p-6 mx-20">
        <div className="max-w-6xl mx-auto">
          {/* Project Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
            <p className="text-gray-500 text-lg">{project.client}</p>
          </div>

          <div className="lg:grid-cols-3 gap-6">
            {/* Left Column - Project Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Project Tags */}
              <div className="flex flex-wrap gap-2">
                <Tag className={`text-sm font-medium px-3 py-1.5 ${getTypeColor(project.type)}`}>
                  {project.type}
                </Tag>
                <Tag className={`text-sm font-medium px-3 py-1.5 ${getStageColor(project.stage)}`}>
                  {project.stage}
                </Tag>
              </div>

              {/* Project Description */}
              <Card className="border border-gray-200 rounded-lg">
                <p className="text-gray-700 text-sm align-center">{project.description || "Project description not available"}</p>
              </Card>

              {/* Progress Stats Boxes */}
              <div className="grid grid-cols-3 gap-4 mt-4">
                {/* Progress Box */}
                <Card className="border border-gray-200 rounded-lg text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">{project.progress}%</div>
                  <div className="text-sm text-gray-500">Progress</div>
                  <Progress 
                    percent={project.progress} 
                    strokeColor="#3b82f6"
                    strokeWidth={4}
                    showInfo={false}
                    className="mt-3"
                  />
                </Card>

                {/* Team Size Box */}
                <Card className="border border-gray-200 rounded-lg text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">{project.members}</div>
                  <div className="text-sm text-gray-500">Team Size</div>
                  <div className="mt-3">
                    <TeamOutlined className="text-2xl text-blue-400" />
                  </div>
                </Card>

                {/* Total Hours Box */}
                <Card className="border border-gray-200 rounded-lg text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">{project.hoursAllocated}h</div>
                  <div className="text-sm text-gray-500">Total Hours</div>
                  <div className="mt-3">
                    <ClockCircleOutlined className="text-2xl text-green-400" />
                  </div>
                </Card>
              </div>

              {/* Project Timeline */}
              <Card 
                title={
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-lg font-semibold">Project Timeline</span>
                  </div>
                }
                className="border border-gray-200 rounded-lg"
              >
                <div className="space-y-4 m-3">
                  <div className="grid grid-cols-2 ">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Started</div>
                      <div className="font-medium">{project.startDate}</div>
                    </div>
                    <div className="text-right mx-7">
                      <div className="text-sm text-gray-500 mb-1 ">Deadline</div>
                      <div className="font-medium">{project.endDate}</div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm text-gray-500 mb-2 ">
                      <span className="m-0">{calculateDaysRemaining() }</span>
                      <span className="mx-7">{timelineProgress}% of timeline elapsed</span>
                    </div>
                    <Progress 
                      percent={timelineProgress} 
                      strokeColor="#10b981"
                      strokeWidth={6}
                    />
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column - Tabbed Interface */}
            <div className="space-y-6 mt-6">
              <Card 
                className="border border-gray-200 rounded-lg"
                bodyStyle={{ padding: 0 }}
              >
                {/* Tabs Header */}
                <div className="border-b border-gray-200">
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
                          <Tag className="ml-1">{teamMembers.length}</Tag>
                        </span>
                      } 
                      key="team"
                    />
                    <TabPane 
                      tab={
                        <span className="flex items-center gap-2">
                          <ExclamationCircleOutlined />
                          <span>Issues</span>
                          <Tag className="ml-1">{issues.length}</Tag>
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
      </div>
    </div>
  );
}
import { useState } from "react";
import { Card, Progress, Tag, Avatar, Button, Divider, Tabs } from "antd";
import { 
  ArrowLeftOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined
} from "@ant-design/icons";
import { getTypeColor, getStageColor } from "./projectcard";
import type { Project } from "./projectcard";
import { useNavigate } from "react-router-dom";

const { TabPane } = Tabs;

interface TeamMember {
  id: number;
  name: string;
  role: string;
  hoursAllocated: number;
  avatarColor: string;
  jobTitle?: string;
  email?: string;
  department?: string;
  workload?: number;
  activeProjects?: number;
  activePOCs?: number;
  certifications?: number;
  tasks?: Array<{
    id: number;
    title: string;
    status: string;
    dueDate?: string;
    priority?: 'low' | 'medium' | 'high';
  }>;
  interns?: Array<{
    id: number;
    name: string;
    studyTrack: string;
    university: string;
    duration: string;
    skills: string[];
    progress: number;
    certifications: string[];
    nextReview: string;
  }>;
  hasInterns?: boolean;
}

interface ProjectDetailProps {
  project: Project;
  projectDescription?: string;
  teamMembers?: TeamMember[];
  issues?: Array<{
    id: number;
    title: string;
    description: string;
    status: string;
    reporter: string;
    reportedDate: string;
    priority?: 'low' | 'medium' | 'high' | 'critical';
  }>;
}

export default function ProjectDetail({ 
  project, 
  projectDescription = "Project description not available",
  teamMembers = [],
  issues = []
}: ProjectDetailProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("team");

  // Default team members if not provided - WITH DIFFERENT DATA FOR EACH
  const defaultTeamMembers: TeamMember[] = teamMembers.length > 0 ? teamMembers : [
    { 
      id: 1, 
      name: "Sarah Johnson", 
      role: "Lead Developer", 
      hoursAllocated: 320,
      avatarColor: "#3b82f6",
      jobTitle: "Lead Developer & Mentor",
      email: "sarah.johnson@company.com",
      department: "Full Stack Development",
      workload: 85,
      activeProjects: 2,
      activePOCs: 1,
      certifications: 4,
      hasInterns: true,
      interns: [
        {
          id: 101,
          name: "Alex Johnson",
          studyTrack: "Computer Science - Full Stack",
          university: "Tech University",
          duration: "6 months internship",
          skills: ["React", "Node.js", "MongoDB", "Express"],
          progress: 80,
          certifications: ["MERN Stack Certification", "AWS Fundamentals"],
          nextReview: "2024-04-20"
        },
        {
          id: 102,
          name: "Emma Davis",
          studyTrack: "Software Engineering",
          university: "State University",
          duration: "4 months internship",
          skills: ["Python", "Django", "PostgreSQL", "Docker"],
          progress: 65,
          certifications: ["Python Developer Certificate"],
          nextReview: "2024-04-25"
        }
      ],
      tasks: [
        {
          id: 1,
          title: "Architecture review for payment module",
          status: "in-progress",
          dueDate: "2024-04-05",
          priority: "high"
        }
      ]
    },
    { 
      id: 2, 
      name: "Mike Chen", 
      role: "Frontend Developer", 
      hoursAllocated: 280,
      avatarColor: "#10b981",
      jobTitle: "Senior Frontend Developer",
      email: "mike.chen@company.com",
      department: "Frontend Team",
      workload: 70,
      activeProjects: 1,
      activePOCs: 0,
      certifications: 2,
      hasInterns: false,
      tasks: [
        {
          id: 2,
          title: "Optimize checkout page performance",
          status: "in-progress",
          dueDate: "2024-03-30",
          priority: "medium"
        }
      ]
    },
    { 
      id: 3, 
      name: "Emily Davis", 
      role: "Backend Developer", 
      hoursAllocated: 290,
      avatarColor: "#8b5cf6",
      jobTitle: "Backend Developer",
      email: "emily.davis@company.com",
      department: "Backend Services",
      workload: 75,
      activeProjects: 2,
      activePOCs: 1,
      certifications: 3,
      hasInterns: false,
      tasks: [
        {
          id: 3,
          title: "Database optimization for user analytics",
          status: "pending",
          dueDate: "2024-04-10",
          priority: "high"
        }
      ]
    },
    { 
      id: 4, 
      name: "James Wilson", 
      role: "Mobile Lead", 
      hoursAllocated: 420,
      avatarColor: "#f59e0b",
      jobTitle: "Mobile Lead & Learning Catalyst",
      email: "james.wilson@company.com",
      department: "Mobile Development",
      workload: 95,
      activeProjects: 1,
      activePOCs: 2,
      certifications: 3,
      hasInterns: true,
      interns: [
        {
          id: 103,
          name: "David Brown",
          studyTrack: "Computer Science - Mobile Development",
          university: "Tech University",
          duration: "8 months internship",
          skills: ["React Native", "iOS", "Android", "Firebase"],
          progress: 90,
          certifications: ["React Native Certification", "Mobile Security"],
          nextReview: "2024-04-15"
        },
        {
          id: 104,
          name: "Sophia Garcia",
          studyTrack: "Mobile App Development",
          university: "Digital Arts College",
          duration: "6 months internship",
          skills: ["Flutter", "Dart", "Firebase", "UI/UX"],
          progress: 75,
          certifications: ["Flutter Developer Certificate"],
          nextReview: "2024-04-18"
        }
      ],
      tasks: [
        {
          id: 4,
          title: "Mobile app security audit",
          status: "completed",
          dueDate: "2024-03-25",
          priority: "high"
        }
      ]
    }
  ];

  // Default issues if not provided
  const defaultIssues = issues.length > 0 ? issues : 
    project.issues > 0 ? [
      {
        id: 1,
        title: "Payment gateway integration delay",
        description: "Third-party API documentation incomplete",
        status: "in-progress",
        reporter: "Sarah Johnson",
        reportedDate: "10/3/2024",
        priority: "high"
      },
      ...(project.issues > 1 ? [{
        id: 2,
        title: "Mobile responsive issues on checkout",
        description: "Layout breaks on smaller screens",
        status: "resolved",
        reporter: "Mike Chen",
        reportedDate: "28/2/2024",
        priority: "medium"
      }] : [])
    ] : [];

  // Calculate timeline progress
  const calculateTimelineProgress = () => {
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
      return 50; // Default progress if date parsing fails
    }
  };

  const timelineProgress = calculateTimelineProgress();

  // Calculate days remaining
  const calculateDaysRemaining = () => {
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

  // Handle team member click - navigate to member page
  const handleMemberClick = (member: TeamMember) => {
    // Navigate to member detail page with member data
    navigate(`/team-member/${member.id}`, { 
      state: { 
        member,
        projectTitle: project.title,
        projectId: project.id
      }
    });
  };

  // Render content based on active tab
  const renderTabContent = () => {
    switch(activeTab) {
      case "team":
        return (
          <div className="space-y-4">
            {defaultTeamMembers.map((member) => (
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
            {defaultIssues.length > 0 ? (
              defaultIssues.map((issue) => (
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
              <span className="font-medium">{defaultIssues.length}</span>
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

          <div className=" lg:grid-cols-3 gap-6">
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
                <p className="text-gray-700 text-sm align-center">{projectDescription}</p>
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
                          <Tag className="ml-1">{defaultTeamMembers.length}</Tag>
                        </span>
                      } 
                      key="team"
                    />
                    <TabPane 
                      tab={
                        <span className="flex items-center gap-2">
                          <ExclamationCircleOutlined />
                          <span>Issues</span>
                          <Tag className="ml-1">{defaultIssues.length}</Tag>
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
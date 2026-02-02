import { useState } from "react";
import { Card, Progress, Tag, Avatar, Button, Tabs, Statistic, Row, Col, Empty, Divider, List, Table } from "antd";
import { 
  ArrowLeftOutlined,
  TeamOutlined,
  ProjectOutlined,
  ExperimentOutlined,
  FileDoneOutlined,
  BookOutlined,
  UsergroupAddOutlined,
  DatabaseOutlined,
  UserOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  SolutionOutlined,
  LaptopOutlined,
  TrophyOutlined,
  CalendarOutlined,
  RightOutlined
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

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
}

export default function TeamMemberDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("tasks");

  // Get member data from navigation state
  const { member, projectTitle, projectId } = location.state || {};

  // Example data for all tabs
  const teamMember: TeamMember = member || {
    id: 1,
    name: "James Wilson",
    role: "Mobile Lead",
    hoursAllocated: 420,
    avatarColor: "#3b82f6",
    jobTitle: "Mobile Lead",
    email: "james.wilson@company.com",
    department: "Mobile Development",
    workload: 95,
    activeProjects: 1,
    activePOCs: 2,
    certifications: 3,
    tasks: [
      {
        id: 1,
        title: "Implement payment gateway integration",
        status: "in-progress",
        dueDate: "2024-04-15",
        priority: "high"
      },
      {
        id: 2,
        title: "Code review for checkout module",
        status: "pending",
        dueDate: "2024-03-30",
        priority: "medium"
      },
      {
        id: 3,
        title: "Update API documentation",
        status: "completed",
        dueDate: "2024-03-25",
        priority: "low"
      },
      {
        id: 4,
        title: "Mobile performance optimization",
        status: "in-progress",
        dueDate: "2024-04-10",
        priority: "high"
      }
    ],
    interns: [
      {
        id: 1,
        name: "Alex Johnson",
        studyTrack: "Computer Science - Mobile Development",
        university: "Tech University",
        duration: "6 months internship",
        skills: ["React Native", "TypeScript", "Firebase", "REST APIs"],
        progress: 75,
        certifications: ["React Native Certification", "Firebase Fundamentals"],
        nextReview: "2024-04-15"
      },
      {
        id: 2,
        name: "Samantha Lee",
        studyTrack: "Software Engineering - Full Stack",
        university: "State University",
        duration: "4 months internship",
        skills: ["React", "Node.js", "MongoDB", "Docker"],
        progress: 60,
        certifications: ["MERN Stack Certification"],
        nextReview: "2024-04-20"
      }
    ]
  };

  // Example POC data
  const pocs = [
    {
      id: 1,
      title: "AI-powered Chatbot Integration",
      status: "in-progress",
      description: "Exploring integration of AI chatbot for customer support",
      techStack: ["OpenAI API", "React", "Node.js"],
      startDate: "2024-03-01",
      estimatedCompletion: "2024-05-15"
    },
    {
      id: 2,
      title: "Blockchain Payment System",
      status: "planning",
      description: "Research on implementing blockchain for secure payments",
      techStack: ["Ethereum", "Solidity", "Web3.js"],
      startDate: "2024-04-01",
      estimatedCompletion: "2024-07-30"
    }
  ];

  // Example certification data
  const certifications = [
    {
      id: 1,
      name: "AWS Solutions Architect Associate",
      issuer: "Amazon Web Services",
      issuedDate: "2023-11-15",
      expiryDate: "2025-11-15",
      credentialId: "AWS-SA-12345"
    },
    {
      id: 2,
      name: "Google Professional Cloud Architect",
      issuer: "Google Cloud",
      issuedDate: "2023-08-20",
      expiryDate: "2025-08-20",
      credentialId: "GCP-PCA-67890"
    },
    {
      id: 3,
      name: "Certified Kubernetes Administrator",
      issuer: "Cloud Native Computing Foundation",
      issuedDate: "2023-05-10",
      expiryDate: "2026-05-10",
      credentialId: "CKA-54321"
    }
  ];

  const workloadColor = teamMember.workload && teamMember.workload >= 90 
    ? "#f5222d" 
    : teamMember.workload && teamMember.workload >= 70 
    ? "#fa8c16" 
    : "#52c41a";

  // Handle intern click
  const handleInternClick = (intern: any) => {
    navigate(`/intern/${intern.id}`, { 
      state: { 
        intern,
        mentor: teamMember.name,
        mentorId: teamMember.id
      }
    });
  };

  // Render POC cards
  const renderPOCs = () => (
    <div className="space-y-4">
      {pocs.map(poc => (
        <Card key={poc.id} className="border border-gray-200 hover:border-blue-300 transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-semibold text-lg mb-2">{poc.title}</div>
              <p className="text-gray-600 text-sm mb-3">{poc.description}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {poc.techStack.map((tech, index) => (
                  <Tag key={index} color="blue">{tech}</Tag>
                ))}
              </div>
              <div className="text-sm text-gray-500">
                <span className="mr-4">Status: <Tag color={poc.status === 'in-progress' ? 'blue' : 'orange'}>{poc.status}</Tag></span>
                <span>Started: {poc.startDate}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Est. Completion</div>
              <div className="font-semibold">{poc.estimatedCompletion}</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  // Render certifications
  const renderCertifications = () => (
    <div className="space-y-4">
      {certifications.map(cert => (
        <Card key={cert.id} className="border border-gray-200 hover:border-green-300 transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-semibold text-lg mb-1">{cert.name}</div>
              <div className="text-gray-600 mb-2">Issued by: {cert.issuer}</div>
              <div className="flex gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Issued</div>
                  <div className="font-medium">{cert.issuedDate}</div>
                </div>
                <div>
                  <div className="text-gray-500">Expires</div>
                  <div className="font-medium">{cert.expiryDate}</div>
                </div>
                <div>
                  <div className="text-gray-500">Credential ID</div>
                  <div className="font-medium">{cert.credentialId}</div>
                </div>
              </div>
            </div>
            <Tag color="green" icon={<TrophyOutlined />}>Active</Tag>
          </div>
        </Card>
      ))}
    </div>
  );

  // Render interns list
  const renderInterns = () => (
    <div className="space-y-4">
      {teamMember.interns && teamMember.interns.map(intern => (
        <Card 
          key={intern.id} 
          className="border border-gray-200 hover:border-purple-300 transition-colors cursor-pointer"
          onClick={() => handleInternClick(intern)}
        >
          <div className="flex justify-between items-start">
            <div className="flex items-start">
              <Avatar size={50} className="mr-4" style={{ backgroundColor: '#8b5cf6' }}>
                {intern.name.split(' ').map(n => n[0]).join('')}
              </Avatar>
              <div>
                <div className="font-semibold text-lg mb-1">{intern.name}</div>
                <div className="text-gray-600 mb-2">{intern.studyTrack}</div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {intern.skills.map((skill, index) => (
                    <Tag key={index} color="purple">{skill}</Tag>
                  ))}
                </div>
                <div className="flex gap-6 text-sm">
                  <div>
                    <div className="text-gray-500">University</div>
                    <div className="font-medium">{intern.university}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Duration</div>
                    <div className="font-medium">{intern.duration}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Progress</div>
                    <Progress percent={intern.progress} size="small" strokeColor="#8b5cf6" />
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <Button type="text" icon={<RightOutlined />} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar-like Back Bar */}
      <div className="bg-white border-b border-gray-200 px-7 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Button 
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors duration-150"
          >
            Back to Project
          </Button>
          <Button type="primary" className="bg-blue-600 hover:bg-blue-700">
            Update Profile
          </Button>
        </div>
      </div>

      {/* Member Content */}
      <div className="p-6 mx-20">
        <div className="max-w-6xl mx-auto">
          {/* Member Header */}
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <Avatar 
                size={80}
                style={{ backgroundColor: teamMember.avatarColor }}
                className="mr-4"
              >
                {teamMember.name.split(' ').map((n: string) => n[0]).join('')}
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{teamMember.name}</h1>
                <p className="text-gray-500 text-lg">{teamMember.jobTitle || teamMember.role}</p>
                <div className="flex items-center gap-4 mt-2">
                  {teamMember.email && (
                    <div className="flex items-center text-gray-600">
                      <MailOutlined className="mr-2" />
                      {teamMember.email}
                    </div>
                  )}
                  {teamMember.department && (
                    <div className="flex items-center text-gray-600">
                      <EnvironmentOutlined className="mr-2" />
                      {teamMember.department}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Tag color="blue" icon={<TeamOutlined />}>Team Lead</Tag>
              <Tag color="green" icon={<BookOutlined />}>Learning Catalyst</Tag>
              <Tag color="purple" icon={<UsergroupAddOutlined />}>Managing {teamMember.interns?.length || 0} interns</Tag>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Stats */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats cards */}
              <Row gutter={16}>
                <Col span={6}>
                  <Card className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <DatabaseOutlined className="text-blue-500 text-lg mr-2" />
                      <span className="text-gray-500">Workload</span>
                    </div>
                    <div className="text-2xl font-bold" style={{ color: workloadColor }}>
                      {teamMember.workload || 0}%
                    </div>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <ProjectOutlined className="text-green-500 text-lg mr-2" />
                      <span className="text-gray-500">Projects</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {teamMember.activeProjects || 0}
                    </div>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <ExperimentOutlined className="text-purple-500 text-lg mr-2" />
                      <span className="text-gray-500">Active POCs</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {teamMember.activePOCs || 0}
                    </div>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <FileDoneOutlined className="text-orange-500 text-lg mr-2" />
                      <span className="text-gray-500">Certifications</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {teamMember.certifications || 0}
                    </div>
                  </Card>
                </Col>
              </Row>

              {/* Detail tabs */}
              <Card>
                <Tabs activeKey={activeTab} onChange={setActiveTab} className="mb-6">
                  <TabPane 
                    tab={
                      <span>
                        <SolutionOutlined /> Tasks
                        <Tag className="ml-2">{teamMember.tasks?.length || 0}</Tag>
                      </span>
                    } 
                    key="tasks" 
                  />
                  <TabPane 
                    tab={
                      <span>
                        <ExperimentOutlined /> POCs
                        <Tag className="ml-2">{pocs.length}</Tag>
                      </span>
                    } 
                    key="pocs" 
                  />
                  <TabPane 
                    tab={
                      <span>
                        <TrophyOutlined /> Certifications
                        <Tag className="ml-2">{certifications.length}</Tag>
                      </span>
                    } 
                    key="certifications" 
                  />
                  <TabPane 
                    tab={
                      <span>
                        <UsergroupAddOutlined /> Interns
                        <Tag className="ml-2">{teamMember.interns?.length || 0}</Tag>
                      </span>
                    } 
                    key="interns" 
                  />
                </Tabs>

                {/* Tab content */}
                {activeTab === "tasks" && (
                  <div className="space-y-3">
                    {teamMember.tasks && teamMember.tasks.length > 0 ? (
                      teamMember.tasks.map(task => (
                        <div key={task.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-medium text-lg">{task.title}</div>
                            <Tag color={
                              task.priority === 'high' ? 'red' :
                              task.priority === 'medium' ? 'orange' : 'green'
                            }>
                              {task.priority} priority
                            </Tag>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-4">
                              <Tag color={
                                task.status === 'completed' ? 'green' :
                                task.status === 'in-progress' ? 'blue' :
                                task.status === 'pending' ? 'orange' : 'default'
                              }>
                                {task.status}
                              </Tag>
                              <div className="flex items-center text-gray-500">
                                <CalendarOutlined className="mr-1" />
                                Due: {task.dueDate}
                              </div>
                            </div>
                            <Button type="link" size="small">View Details</Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                          <div>
                            <p className="text-lg font-medium mb-2">No Tasks Assigned</p>
                            <p className="text-gray-500">This individual has no tasks assigned yet</p>
                          </div>
                        }
                      />
                    )}
                  </div>
                )}

                {activeTab === "pocs" && renderPOCs()}

                {activeTab === "certifications" && renderCertifications()}

                {activeTab === "interns" && renderInterns()}
              </Card>
            </div>

            {/* Right Column - Workload Overview */}
            <div className="space-y-6">
              <Card title="Workload Overview" className="h-fit">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">Current Capacity</span>
                      <span className="font-medium" style={{ color: workloadColor }}>
                        {teamMember.workload || 0}%
                      </span>
                    </div>
                    <Progress 
                      percent={teamMember.workload || 0} 
                      strokeColor={workloadColor}
                      status={teamMember.workload && teamMember.workload >= 90 ? "exception" : "normal"}
                    />
                    <div className="text-sm text-gray-500 mt-1">
                      {teamMember.workload && teamMember.workload >= 90 
                        ? "Near full capacity" 
                        : teamMember.workload && teamMember.workload >= 70 
                        ? "Moderate capacity" 
                        : "Good capacity"}
                    </div>
                  </div>

                  <Divider />

                  <div>
                    <h4 className="font-medium mb-3">Active Projects</h4>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-medium">Mobile Banking App</div>
                          <div className="text-sm text-gray-600">FinanceBank • Mobile Lead</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{teamMember.hoursAllocated}h</div>
                          <div className="text-sm text-gray-500">allocated</div>
                        </div>
                      </div>
                      <Progress percent={65} strokeColor="#3b82f6" />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
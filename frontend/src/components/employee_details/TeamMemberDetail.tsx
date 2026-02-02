import { useState, useEffect } from "react";
import { Card, Progress, Tag, Avatar, Button, Tabs, Statistic, Row, Col, Empty, Divider } from "antd";
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
  CalendarOutlined,
  SolutionOutlined,
  TrophyOutlined,
  LaptopOutlined,
  RightOutlined
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import{api} from "../../services/api";
import type{ TeamMember, Intern, POC, Certification, Task, Project } from "../../services/api";

const { TabPane } = Tabs;

export default function TeamMemberDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("tasks");
  const [member, setMember] = useState<TeamMember | null>(null);
  const [interns, setInterns] = useState<Intern[]>([]);
  const [pocs, setPOCs] = useState<POC[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchMemberData(parseInt(id));
    }
  }, [id]);

  const fetchMemberData = async (memberId: number) => {
    try {
      setLoading(true);
      const [memberData, internsData, pocsData, certsData, tasksData, projectsData] = await Promise.all([
        api.getTeamMember(memberId),
        api.getInternsByMentor(memberId),
        api.getPOCsByCreator(memberId),
        api.getCertificationsByMember(memberId),
        api.getTasksByMember(memberId),
        api.getProjectsByTeamMember(memberId)
      ]);

      if (memberData) {
        setMember(memberData);
        setInterns(internsData);
        setPOCs(pocsData);
        setCertifications(certsData);
        setTasks(tasksData);
        setProjects(projectsData);
      }
    } catch (error) {
      console.error('Error fetching member data:', error);
    } finally {
      setLoading(false);
    }
  };

  const workloadColor = member?.workload && member.workload >= 90 
    ? "#f5222d" 
    : member?.workload && member.workload >= 70 
    ? "#fa8c16" 
    : "#52c41a";

  // Handle intern click
  const handleInternClick = (intern: Intern) => {
    navigate(`/intern/${intern.id}`, { 
      state: { 
        intern,
        mentor: member?.name,
        mentorId: member?.id
      }
    });
  };

  // Handle project click
  const handleProjectClick = (projectId: number) => {
    navigate(`/project/${projectId}`);
  };

  // Render POC cards
  const renderPOCs = () => (
    <div className="space-y-4">
      {pocs.length > 0 ? pocs.map(poc => (
        <Card key={poc.id} className="border border-gray-200 hover:border-blue-300 transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-semibold text-lg mb-2">{poc.title}</div>
              <p className="text-gray-600 text-sm mb-3">{poc.overview}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {poc.technologies.slice(0, 3).map((tech, index) => (
                  <Tag key={index} color="blue">{tech}</Tag>
                ))}
                {poc.technologies.length > 3 && (
                  <Tag>+{poc.technologies.length - 3} more</Tag>
                )}
              </div>
              <div className="text-sm text-gray-500">
                <span className="mr-4">Status: <Tag color={poc.status === 'in-progress' ? 'blue' : 'orange'}>{poc.status || 'planning'}</Tag></span>
                <span>Posted: {poc.postedDate}</span>
              </div>
            </div>
          </div>
        </Card>
      )) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No POCs created yet"
        />
      )}
    </div>
  );

  // Render certifications
  const renderCertifications = () => (
    <div className="space-y-4">
      {certifications.length > 0 ? certifications.map(cert => (
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
      )) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No certifications yet"
        />
      )}
    </div>
  );

  // Render interns list
  const renderInterns = () => (
    <div className="space-y-4">
      {interns.length > 0 ? interns.map(intern => (
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
              <div className="ml-6">
                <div className="font-semibold text-lg mb-1">{intern.name}</div>
                <div className="text-gray-600 mb-2">{intern.studyTrack}</div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {intern.skills.slice(0, 3).map((skill, index) => (
                    <Tag key={index} color="purple">{skill}</Tag>
                  ))}
                  {intern.skills.length > 3 && (
                    <Tag>+{intern.skills.length - 3} more</Tag>
                  )}
                </div>
                <div className="flex gap-6 text-sm">
                  <div>
                    <div className="text-gray-500">University</div>
                    <div className="font-medium">{intern.university}</div>
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
      )) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No interns assigned"
        />
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="text-center py-12">Loading...</div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Team member not found</h2>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

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
          <Button 
            type="primary" 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate(`/team-member/${id}/edit`)}>
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
                style={{ backgroundColor: member.avatarColor }}
                className="mr-4"
              >
                {member.name.split(' ').map((n: string) => n[0]).join('')}
              </Avatar>
              <div className="ml-5">
                <h1 className="text-3xl font-bold text-gray-900">{member.name}</h1>
                <p className="text-gray-500 text-lg">{member.jobTitle || member.role}</p>
                <div className="flex items-center gap-4 mt-2">
                  {member.email && (
                    <div className="flex items-center text-gray-600">
                      <MailOutlined className="mr-2" />
                      {member.email}
                    </div>
                  )}
                  {member.department && (
                    <div className="flex items-center text-gray-600">
                      <EnvironmentOutlined className="mr-2" />
                      {member.department}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Tag color="blue" icon={<TeamOutlined />}>{member.role}</Tag>
              {member.hasInterns && (
                <Tag color="purple" icon={<UsergroupAddOutlined />}>
                  Managing {interns.length} intern{interns.length !== 1 ? 's' : ''}
                </Tag>
              )}
              {member.activePOCs && member.activePOCs > 0 && (
                <Tag color="green" icon={<BookOutlined />}>Learning Catalyst</Tag>
              )}
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
                      {member.workload || 0}%
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
                      {projects.length}
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
                      {pocs.length}
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
                      {certifications.length}
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
                        <Tag className="ml-1">{tasks.length}</Tag>
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
                        <Tag className="ml-2">{interns.length}</Tag>
                      </span>
                    } 
                    key="interns" 
                  />
                </Tabs>

                {/* Tab content */}
                {activeTab === "tasks" && (
                  <div className="space-y-3">
                    {tasks.length > 0 ? (
                      tasks.map(task => (
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
                            <Button 
                            key={task.projectId}
                            type="link" size="small"
                            onClick={() => handleProjectClick(task.projectId)}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No tasks assigned yet"
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
                        {member.workload || 0}%
                      </span>
                    </div>
                    <Progress 
                      percent={member.workload || 0} 
                      strokeColor={workloadColor}
                      status={member.workload && member.workload >= 90 ? "exception" : "normal"}
                    />
                    <div className="text-sm text-gray-500 mt-1">
                      {member.workload && member.workload >= 90 
                        ? "Near full capacity" 
                        : member.workload && member.workload >= 70 
                        ? "Moderate capacity" 
                        : "Good capacity"}
                    </div>
                  </div>

                  <Divider />

                  <div>
                    <h4 className="font-medium mb-3">Active Projects</h4>
                    {projects.length > 0 ? (
                      projects.map(project => (
                        <div 
                          key={project.id}
                          className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-2 cursor-pointer hover:bg-blue-100 transition-colors"
                          onClick={() => handleProjectClick(project.id)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="font-medium">{project.title}</div>
                              <div className="text-sm text-gray-600">{project.client}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">{project.hoursAllocated}h</div>
                              <div className="text-sm text-gray-500">allocated</div>
                            </div>
                          </div>
                          <Progress percent={project.progress} strokeColor="#3b82f6" />
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        No active projects
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Current Project Stats */}
              <Card title="Current Projects" className="h-fit">
                <div className="space-y-3">
                  {projects.slice(0, 2).map(project => (
                    <div key={project.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{project.title}</div>
                        <div className="text-gray-500 text-xs">{project.client}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-sm">{project.progress}%</div>
                        <div className="text-gray-500 text-xs">progress</div>
                      </div>
                    </div>
                  ))}
                  {projects.length > 2 && (
                    <div className="text-center pt-2">
                      <Button type="link" size="small" onClick={() => setActiveTab("tasks")}>
                        View all {projects.length} projects
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { Card, Progress, Tag, Avatar, Button, Tabs, Statistic, Row, Col, Empty, Divider, Spin, Alert } from "antd";
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
import { api } from "../../lib/api";
import { LoadingSkeleton } from "../../components/LoadingSkeleton";

const { TabPane } = Tabs;

export default function TeamMemberDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("tasks");
  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchMemberData();
    }
  }, [id]);

  const fetchMemberData = async () => {
    try {
      setLoading(true);
      setError(null);
      const memberData = await api.getTeamMember(id!);
      setMember(memberData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load member data');
      console.error('Error fetching member data:', err);
    } finally {
      setLoading(false);
    }
  };

  const workloadColor = member?.workloadPercentage && member.workloadPercentage >= 90 
    ? "#dc2626" 
    : member?.workloadPercentage && member.workloadPercentage >= 70 
    ? "#ea580c" 
    : "#059669";

  const handleInternClick = (intern: any) => {
    navigate(`/intern/${intern.id}`, { 
      state: { 
        intern,
        mentor: member?.name,
        mentorId: member?.id
      }
    });
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  const renderPOCs = () => (
    <div className="space-y-4">
      {member?.pocs && member.pocs.length > 0 ? member.pocs.map((poc: any) => (
        <Card key={poc.id} className="border border-gray-300 hover:border-blue-400 transition-colors shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-semibold text-lg mb-2 text-gray-900">{poc.title}</div>
              <p className="text-gray-700 text-sm mb-3">{poc.description}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {poc.technologies?.slice(0, 3).map((tech: string, index: number) => (
                  <Tag key={index} color="blue">{tech}</Tag>
                ))}
                {poc.technologies?.length > 3 && (
                  <Tag>+{poc.technologies.length - 3} more</Tag>
                )}
              </div>
              <div className="text-sm text-gray-600">
                <span className="mr-4">Status: <Tag color={poc.status === 'in-progress' ? 'blue' : 'orange'}>{poc.status || 'planning'}</Tag></span>
                <span>Progress: {poc.progress}%</span>
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

  const renderCertifications = () => (
    <div className="space-y-4">
      {member?.certifications && member.certifications.length > 0 ? member.certifications.map((cert: any) => (
        <Card key={cert.id} className="border border-gray-300 hover:border-green-400 transition-colors shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-semibold text-lg mb-1 text-gray-900">{cert.name}</div>
              <div className="text-gray-700 mb-2">Provider: {cert.provider}</div>
              <div className="flex gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Status</div>
                  <div className="font-medium">{cert.status}</div>
                </div>
                <div>
                  <div className="text-gray-600">Progress</div>
                  <div className="font-medium">{cert.progress || 0}%</div>
                </div>
                <div>
                  <div className="text-gray-600">Expected Completion</div>
                  <div className="font-medium">{cert.expectedCompletionDate ? new Date(cert.expectedCompletionDate).toLocaleDateString() : 'Not set'}</div>
                </div>
              </div>
            </div>
            <Tag color={cert.status === 'completed' ? 'green' : cert.status === 'in-progress' ? 'blue' : 'orange'}>
              {cert.status}
            </Tag>
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

  const renderInterns = () => (
    <div className="space-y-4">
      {member?.interns && member.interns.length > 0 ? member.interns.map((intern: any) => (
        <Card 
          key={intern.id} 
          className="border border-gray-300 hover:border-purple-400 transition-colors cursor-pointer shadow-sm"
          onClick={() => handleInternClick(intern)}
        >
          <div className="flex justify-between items-start">
            <div className="flex items-start">
              <Avatar size={50} className="mr-4" style={{ backgroundColor: '#7c3aed' }}>
                {intern.name?.split(' ').map((n: string) => n[0]).join('')}
              </Avatar>
              <div className="ml-6">
                <div className="font-semibold text-lg mb-1 text-gray-900">{intern.name}</div>
                <div className="text-gray-700 mb-2">{intern.email}</div>
                <div className="text-sm text-gray-600">
                  <div className="font-medium">Assigned on: {new Date(intern.assignedAt).toLocaleDateString()}</div>
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
        <LoadingSkeleton type="card" count={3} />
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-6">
          <Alert
            message="Error Loading Team Member"
            description={error || "Team member not found"}
            type="error"
            showIcon
            className="mb-4"
          />
          <Button onClick={() => navigate(`/overview`)}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar-like Back Bar */}
      <div className="bg-white border-b border-gray-300 px-7 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Button 
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(`/overview`)}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors duration-150"
          >
            Back to Dashboard
          </Button>
          <Button 
            type="primary" 
            className="bg-blue-600 hover:bg-blue-700 border-blue-600"
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
                style={{ backgroundColor: '#2563eb' }}
                className="mr-4 shadow-sm"
              >
                {member.name.split(' ').map((n: string) => n[0]).join('')}
              </Avatar>
              <div className="ml-5">
                <h1 className="text-3xl font-bold text-gray-900">{member.name}</h1>
                <p className="text-gray-700 text-lg font-medium capitalize">{member.userRole?.replace('-', ' ')}</p>
                <div className="flex items-center gap-4 mt-2">
                  {member.email && (
                    <div className="flex items-center text-gray-700">
                      <MailOutlined className="mr-2 text-gray-500" />
                      {member.email}
                    </div>
                  )}
                  {member.joinDate && (
                    <div className="flex items-center text-gray-700">
                      <CalendarOutlined className="mr-2 text-gray-500" />
                      Joined: {new Date(member.joinDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Tag color="blue" icon={<TeamOutlined />} className="font-medium">
                {member.userRole?.replace('-', ' ')}
              </Tag>
              {member.isLC && (
                <Tag color="purple" icon={<UsergroupAddOutlined />} className="font-medium">
                  Learning Catalyst
                </Tag>
              )}
              {member.skills && member.skills.length > 0 && (
                <Tag color="green" icon={<BookOutlined />} className="font-medium">
                  {member.skills.length} skills
                </Tag>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Stats */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats cards */}
              <Row gutter={16}>
                <Col span={6}>
                  <Card className="text-center border border-gray-300 shadow-sm">
                    <div className="flex items-center justify-center mb-2">
                      <DatabaseOutlined className="text-blue-500 text-lg mr-2" />
                      <span className="text-gray-700 font-medium">Workload</span>
                    </div>
                    <div className="text-2xl font-bold" style={{ color: workloadColor }}>
                      {member.workloadPercentage || 0}%
                    </div>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card className="text-center border border-gray-300 shadow-sm">
                    <div className="flex items-center justify-center mb-2">
                      <ProjectOutlined className="text-green-500 text-lg mr-2" />
                      <span className="text-gray-700 font-medium">Projects</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {member.projects?.length || 0}
                    </div>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card className="text-center border border-gray-300 shadow-sm">
                    <div className="flex items-center justify-center mb-2">
                      <ExperimentOutlined className="text-purple-500 text-lg mr-2" />
                      <span className="text-gray-700 font-medium">POCs</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {member.pocs?.length || 0}
                    </div>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card className="text-center border border-gray-300 shadow-sm">
                    <div className="flex items-center justify-center mb-2">
                      <FileDoneOutlined className="text-orange-500 text-lg mr-2" />
                      <span className="text-gray-700 font-medium">Certifications</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {member.certifications?.length || 0}
                    </div>
                  </Card>
                </Col>
              </Row>

              {/* Detail tabs */}
              <Card className="border border-gray-300 shadow-sm">
                <Tabs activeKey={activeTab} onChange={setActiveTab} className="mb-6">
                  <TabPane 
                    tab={
                      <span className="font-medium">
                        <SolutionOutlined /> Tasks
                        <Tag className="ml-1 bg-blue-100 text-blue-700">{member.tasks?.length || 0}</Tag>
                      </span>
                    } 
                    key="tasks" 
                  />
                  <TabPane 
                    tab={
                      <span className="font-medium">
                        <ExperimentOutlined /> POCs
                        <Tag className="ml-2 bg-purple-100 text-purple-700">{member.pocs?.length || 0}</Tag>
                      </span>
                    } 
                    key="pocs" 
                  />
                  <TabPane 
                    tab={
                      <span className="font-medium">
                        <TrophyOutlined /> Certifications
                        <Tag className="ml-2 bg-green-100 text-green-700">{member.certifications?.length || 0}</Tag>
                      </span>
                    } 
                    key="certifications" 
                  />
                  {member.isLC && (
                    <TabPane 
                      tab={
                        <span className="font-medium">
                          <UsergroupAddOutlined /> Interns
                          <Tag className="ml-2 bg-purple-100 text-purple-700">{member.interns?.length || 0}</Tag>
                        </span>
                      } 
                      key="interns" 
                    />
                  )}
                </Tabs>

                {/* Tab content */}
                {activeTab === "tasks" && (
                  <div className="space-y-3">
                    {member.tasks && member.tasks.length > 0 ? (
                      member.tasks.map((task: any) => (
                        <div key={task.id} className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-medium text-lg text-gray-900">{task.title}</div>
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
                                task.status === 'in-progress' ? 'blue' : 'orange'
                              }>
                                {task.status}
                              </Tag>
                              {task.deadline && (
                                <div className="flex items-center text-gray-600">
                                  <CalendarOutlined className="mr-1" />
                                  Due: {new Date(task.deadline).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                            {task.projectName && (
                              <Button 
                                type="link" 
                                size="small"
                                onClick={() => task.projectId && handleProjectClick(task.projectId)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                View Project
                              </Button>
                            )}
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
              <Card title="Workload Overview" className="h-fit border border-gray-300 shadow-sm">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700 font-medium">Current Capacity</span>
                      <span className="font-semibold" style={{ color: workloadColor }}>
                        {member.workloadPercentage || 0}%
                      </span>
                    </div>
                    <Progress 
                      percent={member.workloadPercentage || 0} 
                      strokeColor={workloadColor}
                      status={member.workloadPercentage && member.workloadPercentage >= 90 ? "exception" : "normal"}
                    />
                    <div className="text-sm text-gray-600 mt-1">
                      {member.workloadPercentage && member.workloadPercentage >= 90 
                        ? "Near full capacity" 
                        : member.workloadPercentage && member.workloadPercentage >= 70 
                        ? "Moderate capacity" 
                        : "Good capacity"}
                    </div>
                  </div>

                  <Divider />

                  <div>
                    <h4 className="font-medium mb-3 text-gray-900">Active Projects</h4>
                    {member.projects && member.projects.length > 0 ? (
                      member.projects.slice(0, 3).map((project: any) => (
                        <div 
                          key={project.projectId}
                          className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-2 cursor-pointer hover:bg-blue-100 transition-colors"
                          onClick={() => handleProjectClick(project.projectId)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="font-medium text-gray-900">{project.projectName}</div>
                              <div className="text-sm text-gray-700">{project.client || ''}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-gray-900">{project.hoursAllocated}h</div>
                              <div className="text-sm text-gray-600">allocated</div>
                            </div>
                          </div>
                          <Progress percent={project.projectProgress || 0} strokeColor="#2563eb" />
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-600">
                        No active projects
                      </div>
                    )}
                    {member.projects && member.projects.length > 3 && (
                      <Button 
                        type="link" 
                        size="small" 
                        onClick={() => setActiveTab("tasks")}
                        className="w-full text-center text-blue-600 hover:text-blue-800"
                      >
                        View all {member.projects.length} projects
                      </Button>
                    )}
                  </div>
                </div>
              </Card>

              {/* Skills Card */}
              <Card title="Skills" className="h-fit border border-gray-300 shadow-sm">
                <div className="space-y-2">
                  {member.skills && member.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {member.skills.map((skill: string, index: number) => (
                        <Tag 
                          key={index} 
                          color="blue"
                          className="px-3 py-1 font-medium"
                        >
                          {skill}
                        </Tag>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-600">
                      No skills listed
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
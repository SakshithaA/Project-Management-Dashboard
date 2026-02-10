import { useState, useEffect } from 'react';
import { 
  Card, 
  Tag, 
  Button, 
  Typography, 
  Divider, 
  Descriptions, 
  Timeline, 
  Badge,
  Avatar,
  Space,
  Alert,
  Spin,
  Progress,
  Row,
  Col
} from 'antd';
import { 
  ArrowLeftOutlined,
  EditOutlined,
  CodeOutlined,
  CalendarOutlined,
  UserOutlined,
  ClockCircleOutlined,
  RocketOutlined,
  CheckCircleOutlined,
  ExperimentOutlined,
  TeamOutlined,
  FileTextOutlined,
  DatabaseOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import dayjs from 'dayjs';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

const { Title, Text, Paragraph } = Typography;

export default function POCDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [poc, setPOC] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchPOCData();
    }
  }, [id]);

  const fetchPOCData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch as standalone POC first
      let pocData;
      try {
        pocData = await api.getStandalonePOC(id!);
        pocData.type = 'standalone';
      } catch (standaloneError) {
        // If not found as standalone, try to find in member POCs
        console.debug('Not a standalone POC, checking member POCs...');
        // This would require fetching all team members and their POCs
        // For now, we'll set a mock or handle differently
        throw new Error('POC not found');
      }
      
      if (pocData) {
        setPOC(pocData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load POC details');
      console.error('Error fetching POC data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePOC = () => {
    if (poc) {
      navigate(`/update-poc/${poc.id}`, { state: { poc } });
    }
  };

  const getStatusColor = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'completed': return 'success';
      case 'in-progress': return 'processing';
      case 'testing': return 'warning';
      case 'planning': return 'default';
      case 'on-hold': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'completed': return 'Completed';
      case 'in-progress': return 'In Progress';
      case 'testing': return 'Testing';
      case 'planning': return 'Planning';
      case 'on-hold': return 'On Hold';
      default: return 'Not Started';
    }
  };

  const getStatusColorHex = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'completed': return '#059669';
      case 'in-progress': return '#2563eb';
      case 'testing': return '#ea580c';
      case 'planning': return '#6b7280';
      case 'on-hold': return '#dc2626';
      default: return '#6b7280';
    }
  };

  // Sample timeline data based on POC dates
  const timelineData = [
    {
      label: poc?.createdAt ? dayjs(poc.createdAt).format('MMM DD, YYYY') : 'Recently',
      children: 'POC Created',
      color: 'green'
    },
    {
      label: poc?.startDate ? dayjs(poc.startDate).format('MMM DD, YYYY') : 'Start date',
      children: 'Development Started',
      color: 'blue'
    },
    {
      label: 'Current',
      children: `Phase: ${getStatusText(poc?.status || 'planning')}`,
      color: getStatusColor(poc?.status || 'planning') as any
    },
    {
      label: poc?.endDate ? dayjs(poc.endDate).format('MMM DD, YYYY') : 'Future',
      children: 'Expected Completion',
      color: 'gray'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <LoadingSkeleton type="card" count={3} />
      </div>
    );
  }

  if (error || !poc) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <Alert
            message="Error Loading POC"
            description={error || "POC not found"}
            type="error"
            showIcon
            className="mb-4"
            action={
              <Button size="small" onClick={fetchPOCData}>
                Retry
              </Button>
            }
          />
          <Button 
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/pocs')}
            type="primary"
          >
            Back to POCs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <div className="bg-white border-b border-gray-300 px-7 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Button 
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/pocs')}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors duration-150 font-medium"
          >
            Back to POCs
          </Button>
          
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={handleUpdatePOC}
            className="bg-blue-600 hover:bg-blue-700 border-blue-600"
          >
            Update POC
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 mx-20">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <ExperimentOutlined className="text-2xl text-blue-600" />
                  </div>
                  <div>
                    <Title level={1} className="text-gray-900 mb-2">
                      {poc.title}
                    </Title>
                    <Badge 
                      status={getStatusColor(poc.status) as any}
                      text={getStatusText(poc.status)}
                      className="text-sm font-medium"
                    />
                    <div className="mt-1">
                      <Progress 
                        percent={poc.progress} 
                        strokeColor={getStatusColorHex(poc.status)}
                        size="small" 
                        showInfo={false}
                      />
                      <Text className="text-xs text-gray-600 font-medium">
                        {poc.progress}% complete
                      </Text>
                    </div>
                  </div>
                </div>
                
                <Paragraph className="text-gray-700 text-lg font-medium">
                  {poc.description || poc.overview}
                </Paragraph>
              </div>
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="flex items-center text-gray-700">
                <CalendarOutlined className="mr-2 text-gray-500" />
                <span className="font-medium">Created {dayjs(poc.createdAt).format('MMM DD, YYYY')}</span>
              </div>
              
              {poc.startDate && (
                <div className="flex items-center text-gray-700">
                  <ClockCircleOutlined className="mr-2 text-gray-500" />
                  <span className="font-medium">
                    Started: {dayjs(poc.startDate).format('MMM DD, YYYY')}
                  </span>
                </div>
              )}
              
              {poc.endDate && (
                <div className="flex items-center text-gray-700">
                  <ClockCircleOutlined className="mr-2 text-gray-500" />
                  <span className="font-medium">
                    Target: {dayjs(poc.endDate).format('MMM DD, YYYY')}
                  </span>
                </div>
              )}
              
              <div className="flex items-center text-gray-700">
                <DatabaseOutlined className="mr-2 text-gray-500" />
                <span className="font-medium">Type: {poc.type === 'standalone' ? 'Standalone POC' : 'Member POC'}</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Technologies Section */}
              <Card 
                title={
                  <div className="flex items-center">
                    <CodeOutlined className="mr-2 text-blue-600" />
                    <span className="text-lg font-semibold text-gray-900">Technologies</span>
                  </div>
                }
                className="border border-gray-300 shadow-sm"
              >
                <div className="flex flex-wrap gap-2">
                  {poc.technologies?.map((tech: string, index: number) => (
                    <Tag 
                      key={index}
                      color="blue"
                      className="text-sm px-3 py-1.5 font-medium"
                    >
                      {tech}
                    </Tag>
                  ))}
                  {(!poc.technologies || poc.technologies.length === 0) && (
                    <Text className="text-gray-600 font-medium">No technologies specified</Text>
                  )}
                </div>
              </Card>

              {/* Detailed Description */}
              <Card 
                title={
                  <div className="flex items-center">
                    <RocketOutlined className="mr-2 text-purple-600" />
                    <span className="text-lg font-semibold text-gray-900">Detailed Information</span>
                  </div>
                }
                className="border border-gray-300 shadow-sm"
              >
                <div className="space-y-4">
                  {poc.overview && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Overview</h4>
                      <p className="text-gray-700 font-medium">
                        {poc.overview}
                      </p>
                    </div>
                  )}
                  
                  {poc.endGoal && (
                    <>
                      <Divider />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">End Goal</h4>
                        <p className="text-gray-700 font-medium">
                          {poc.endGoal}
                        </p>
                      </div>
                    </>
                  )}
                  
                  <Divider />
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Objectives</h4>
                    {poc.objective ? (
                      <p className="text-gray-700 font-medium">{poc.objective}</p>
                    ) : (
                      <ul className="list-disc pl-5 text-gray-700 space-y-1 font-medium">
                        <li>Validate core functionality and performance</li>
                        <li>Assess integration capabilities with existing systems</li>
                        <li>Evaluate development effort and resource requirements</li>
                        <li>Identify potential risks and mitigation strategies</li>
                        <li>Document findings and recommendations</li>
                      </ul>
                    )}
                  </div>
                  
                  <Divider />
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Expected Outcomes</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircleOutlined className="text-green-600 mr-2" />
                        <span className="font-semibold text-gray-900">Technical Validation</span>
                      </div>
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <CheckCircleOutlined className="text-blue-600 mr-2" />
                        <span className="font-semibold text-gray-900">Performance Metrics</span>
                      </div>
                      <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                        <CheckCircleOutlined className="text-purple-600 mr-2" />
                        <span className="font-semibold text-gray-900">Integration Assessment</span>
                      </div>
                      <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <CheckCircleOutlined className="text-orange-600 mr-2" />
                        <span className="font-semibold text-gray-900">Risk Analysis</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Timeline */}
              <Card 
                title={
                  <div className="flex items-center">
                    <ClockCircleOutlined className="mr-2 text-orange-600" />
                    <span className="text-lg font-semibold text-gray-900">Development Timeline</span>
                  </div>
                }
                className="border border-gray-300 shadow-sm"
              >
                <Timeline
                  items={timelineData.map((item, index) => ({
                    color: item.color,
                    label: item.label,
                    children: (
                      <div className="pl-3">
                        <div className="font-semibold text-gray-900">{item.children}</div>
                      </div>
                    )
                  }))}
                />
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Status Card */}
              <Card 
                className="border border-gray-300 shadow-sm"
                title={
                  <div className="font-semibold text-gray-900">Status Overview</div>
                }
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Current Phase</span>
                    <Badge 
                      status={getStatusColor(poc.status) as any}
                      text={getStatusText(poc.status)}
                      className="font-medium"
                    />
                  </div>
                  
                  <Divider className="my-3" />
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Progress</span>
                      <span className="font-bold text-gray-900">{poc.progress}%</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Days Remaining</span>
                      <span className="font-bold text-gray-900">
                        {poc.endDate ? Math.max(0, dayjs(poc.endDate).diff(dayjs(), 'day')) : 'N/A'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Priority</span>
                      <span className="font-bold text-gray-900">High</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Complexity</span>
                      <span className="font-bold text-gray-900">Medium</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Team Card */}
              {poc.type === 'standalone' && poc.teamMembers && poc.teamMembers.length > 0 && (
                <Card 
                  className="border border-gray-300 shadow-sm"
                  title={
                    <div className="font-semibold text-gray-900">Team Members</div>
                  }
                >
                  <div className="space-y-3">
                    {poc.teamMembers.map((member: any) => (
                      <div key={member.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                        <div className="flex items-center gap-3">
                          <Avatar 
                            size="large"
                            style={{ backgroundColor: '#2563eb' }}
                          >
                            {member.name.split(' ').map((n: string) => n[0]).join('')}
                          </Avatar>
                          <div>
                            <div className="font-semibold text-gray-900">{member.name}</div>
                            <div className="text-sm text-gray-600 font-medium">{member.role}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-700 font-medium">{member.hoursAllocated}h</div>
                          <div className="text-xs text-gray-500">allocated</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Resources Card */}
              <Card 
                className="border border-gray-300 shadow-sm"
                title={
                  <div className="font-semibold text-gray-900">Resources</div>
                }
              >
                <div className="space-y-3">
                  <div className="p-2 hover:bg-blue-50 rounded cursor-pointer border border-blue-200">
                    <div className="font-semibold text-blue-700">Technical Documentation</div>
                    <div className="text-sm text-gray-600 font-medium">PDF • Updated 2 days ago</div>
                  </div>
                  
                  <div className="p-2 hover:bg-green-50 rounded cursor-pointer border border-green-200">
                    <div className="font-semibold text-green-700">Test Results</div>
                    <div className="text-sm text-gray-600 font-medium">Spreadsheet • Updated 1 week ago</div>
                  </div>
                  
                  <div className="p-2 hover:bg-purple-50 rounded cursor-pointer border border-purple-200">
                    <div className="font-semibold text-purple-700">Code Repository</div>
                    <div className="text-sm text-gray-600 font-medium">GitHub • Active</div>
                  </div>
                  
                  <div className="p-2 hover:bg-orange-50 rounded cursor-pointer border border-orange-200">
                    <div className="font-semibold text-orange-700">Meeting Notes</div>
                    <div className="text-sm text-gray-600 font-medium">Document • Updated yesterday</div>
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card 
                className="border border-gray-300 shadow-sm"
                title={
                  <div className="font-semibold text-gray-900">Quick Actions</div>
                }
              >
                <div className="space-y-2">
                  <Button 
                    type="primary" 
                    block 
                    className="bg-blue-600 hover:bg-blue-700 border-blue-600"
                    onClick={handleUpdatePOC}
                  >
                    <EditOutlined /> Update Progress
                  </Button>
                  <Button 
                    block 
                    className="border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900"
                  >
                    <FileTextOutlined /> Generate Report
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// pages/POCDetails.tsx
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
  message
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
  ExperimentOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { api, type POC, type TeamMember } from '../services/api';

const { Title, Text } = Typography;

export default function POCDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [poc, setPOC] = useState<POC | null>(null);
  const [creator, setCreator] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPOCData = async () => {
      try {
        if (id) {
          const pocData = await api.getPOCs();
          const foundPOC = pocData.find(p => p.id === parseInt(id));
          
          if (foundPOC) {
            setPOC(foundPOC);
            
            // Fetch creator info if createdBy exists
            if (foundPOC.createdBy) {
              const creatorData = await api.getTeamMember(foundPOC.createdBy);
              setCreator(creatorData);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching POC data:', error);
        message.error('Failed to load POC details');
      } finally {
        setLoading(false);
      }
    };

    fetchPOCData();
  }, [id]);

  const handleUpdatePOC = () => {
    if (poc) {
      navigate(`/update-poc/${poc.id}`, { state: { poc } });
    }
  };

  const getStatusColor = (status?: string) => {
    switch(status?.toLowerCase()) {
      case 'completed': return 'success';
      case 'in-progress': return 'processing';
      case 'testing': return 'warning';
      case 'planning': return 'default';
      default: return 'default';
    }
  };

  const getStatusText = (status?: string) => {
    switch(status?.toLowerCase()) {
      case 'completed': return 'Completed';
      case 'in-progress': return 'In Progress';
      case 'testing': return 'Testing';
      case 'planning': return 'Planning';
      default: return 'Not Started';
    }
  };

  // Sample timeline data
  const timelineData = [
    {
      label: poc?.postedDate || 'Recently',
      children: 'POC Created',
      color: 'green'
    },
    {
      label: '2 days after creation',
      children: 'Initial Research Completed',
      color: 'blue'
    },
    {
      label: '1 week after creation',
      children: 'Prototype Development Started',
      color: 'blue'
    },
    {
      label: 'Current',
      children: `Testing Phase - ${poc?.status || 'Planning'}`,
      color: poc?.status === 'in-progress' ? 'orange' : 'gray'
    },
    {
      label: 'Future',
      children: 'Production Implementation',
      color: 'gray'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="text-center py-12">Loading POC details...</div>
      </div>
    );
  }

  if (!poc) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="text-center py-12">
          <Title level={3} className="text-gray-900 mb-4">
            POC not found
          </Title>
          <Button onClick={() => navigate('/pocs')}>Back to POCs</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <div className="bg-white border-b border-gray-200 px-7 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Button 
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/pocs')}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors duration-150"
          >
            Back to POCs
          </Button>
          
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={handleUpdatePOC}
            className="bg-blue-600 hover:bg-blue-700"
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
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <ExperimentOutlined className="text-2xl text-blue-600" />
                  </div>
                  <div>
                    <Title level={1} className="text-gray-900 mb-2">
                      {poc.title}
                    </Title>
                    <Badge 
                      status={getStatusColor(poc.status) as any}
                      text={getStatusText(poc.status)}
                      className="text-sm"
                    />
                  </div>
                </div>
                
                <Text className="text-gray-600 text-lg">
                  {poc.overview}
                </Text>
              </div>
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="flex items-center text-gray-600">
                <CalendarOutlined className="mr-2 text-gray-400" />
                <span>Posted {poc.postedDate}</span>
              </div>
              
              {creator && (
                <div className="flex items-center text-gray-600">
                  <UserOutlined className="mr-2 text-gray-400" />
                  <span>Created by: {creator.name}</span>
                </div>
              )}
              
              <div className="flex items-center text-gray-600">
                <ClockCircleOutlined className="mr-2 text-gray-400" />
                <span>Status: {getStatusText(poc.status)}</span>
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
                    <CodeOutlined className="mr-2 text-blue-500" />
                    <span className="text-lg font-semibold">Technologies</span>
                  </div>
                }
                className="border border-gray-200"
              >
                <div className="flex flex-wrap gap-2">
                  {poc.technologies.map((tech, index) => (
                    <Tag 
                      key={index}
                      color="blue"
                      className="text-sm px-3 py-1.5"
                    >
                      {tech}
                    </Tag>
                  ))}
                </div>
              </Card>

              {/* Detailed Description */}
              <Card 
                title={
                  <div className="flex items-center">
                    <RocketOutlined className="mr-2 text-purple-500" />
                    <span className="text-lg font-semibold">Detailed Description</span>
                  </div>
                }
                className="border border-gray-200"
              >
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Objectives</h4>
                    <p className="text-gray-600">
                      This proof of concept aims to validate the technical feasibility and potential benefits 
                      of implementing this solution in our production environment.
                    </p>
                  </div>
                  
                  <Divider />
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Scope</h4>
                    <ul className="list-disc pl-5 text-gray-600 space-y-1">
                      <li>Validate core functionality and performance</li>
                      <li>Assess integration capabilities with existing systems</li>
                      <li>Evaluate development effort and resource requirements</li>
                      <li>Identify potential risks and mitigation strategies</li>
                      <li>Document findings and recommendations</li>
                    </ul>
                  </div>
                  
                  <Divider />
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Expected Outcomes</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircleOutlined className="text-green-500 mr-2" />
                        <span className="font-medium">Technical Validation</span>
                      </div>
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <CheckCircleOutlined className="text-blue-500 mr-2" />
                        <span className="font-medium">Performance Metrics</span>
                      </div>
                      <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                        <CheckCircleOutlined className="text-purple-500 mr-2" />
                        <span className="font-medium">Integration Assessment</span>
                      </div>
                      <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <CheckCircleOutlined className="text-orange-500 mr-2" />
                        <span className="font-medium">Risk Analysis</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Timeline */}
              <Card 
                title={
                  <div className="flex items-center">
                    <ClockCircleOutlined className="mr-2 text-orange-500" />
                    <span className="text-lg font-semibold">Development Timeline</span>
                  </div>
                }
                className="border border-gray-200"
              >
                <Timeline
                  items={timelineData.map((item, index) => ({
                    color: item.color,
                    label: item.label,
                    children: item.children
                  }))}
                />
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-4">
              {/* Status Card */}
              <Card 
                className="border border-gray-200 "
                title="Status Overview"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Current Phase</span>
                    <Badge 
                      status={getStatusColor(poc.status) as any}
                      text={getStatusText(poc.status)}
                    />
                  </div>
                  
                  <Divider className="my-3" />
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold">
                        {poc.status === 'completed' ? '100%' : 
                         poc.status === 'in-progress' ? '65%' : 
                         poc.status === 'testing' ? '80%' : '25%'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Complexity</span>
                      <span className="font-semibold">Medium</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Priority</span>
                      <span className="font-semibold">High</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Estimated Completion</span>
                      <span className="font-semibold">2 weeks</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Team Card */}
              <Card 
                className="border border-gray-200"
                title="Team Members"
              >
                <div className="space-y-3 ">
                  {creator && (
                    <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                      <div className="flex items-center gap-3">
                        <Avatar 
                          size="large"
                          style={{ backgroundColor: creator.avatarColor }}
                        >
                          {creator.name.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        <div>
                          <div className="font-medium">{creator.name}</div>
                          <div className="text-sm text-gray-500">Lead Developer</div>
                        </div>
                      </div>
                      <Tag color="blue">Lead</Tag>
                    </div>
                  )}
                  
                  {/* Sample team members */}
                  <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <div className="flex items-center gap-3">
                      <Avatar size="large" style={{ backgroundColor: '#10b981' }}>
                        MJ
                      </Avatar>
                      <div>
                        <div className="font-medium">Mike Johnson</div>
                        <div className="text-sm text-gray-500">Frontend Developer</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <div className="flex items-center gap-3">
                      <Avatar size="large" style={{ backgroundColor: '#8b5cf6' }}>
                        SD
                      </Avatar>
                      <div>
                        <div className="font-medium">Sarah Davis</div>
                        <div className="text-sm text-gray-500">Backend Developer</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Resources Card */}
              <Card 
                className="border border-gray-200"
                title="Resources"
              >
                <div className="space-y-3">
                  <div className="p-2 hover:bg-blue-50 rounded cursor-pointer">
                    <div className="font-medium text-blue-600">Technical Documentation</div>
                    <div className="text-sm text-gray-500">PDF • Updated 2 days ago</div>
                  </div>
                  
                  <div className="p-2 hover:bg-green-50 rounded cursor-pointer">
                    <div className="font-medium text-green-600">Test Results</div>
                    <div className="text-sm text-gray-500">Spreadsheet • Updated 1 week ago</div>
                  </div>
                  
                  <div className="p-2 hover:bg-purple-50 rounded cursor-pointer">
                    <div className="font-medium text-purple-600">Code Repository</div>
                    <div className="text-sm text-gray-500">GitHub • Active</div>
                  </div>
                  
                  <div className="p-2 hover:bg-orange-50 rounded cursor-pointer">
                    <div className="font-medium text-orange-600">Meeting Notes</div>
                    <div className="text-sm text-gray-500">Document • Updated yesterday</div>
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
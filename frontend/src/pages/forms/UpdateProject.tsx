import { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Select, 
  Card, 
  Typography, 
  InputNumber, 
  message,
  Row,
  Col,
  Divider,
  Modal,
  Table,
  Tag
} from 'antd';
import { 
  ArrowLeftOutlined, 
  SaveOutlined,
  DeleteOutlined,
  UserOutlined,
  TeamOutlined 
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../services/api';
import type { Project, TeamMember } from '../../services/api';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function UpdateProject() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [allTeamMembers, setAllTeamMembers] = useState<TeamMember[]>([]);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<TeamMember[]>([]);
  const [showTeamModal, setShowTeamModal] = useState(false);

  // Load project data and team members
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          // Fetch project
          const projectData = await api.getProject(parseInt(id));
          if (projectData) {
            setProject(projectData);
            form.setFieldsValue({
              ...projectData
            });
            
            // Fetch team members for this project
            const teamMembers = await api.getTeamMembers(projectData.id);
            setSelectedTeamMembers(teamMembers);
          }
        }

        // Fetch all team members for selection
        const allMembers = await api.getAllTeamMembers();
        setAllTeamMembers(allMembers);

      } catch (error) {
        console.error('Error loading data:', error);
        message.error('Failed to load project data');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchData();
  }, [id, form]);

  // Handle team member selection
  const handleTeamMemberSelect = (member: TeamMember) => {
    const isSelected = selectedTeamMembers.some(m => m.id === member.id);
    if (!isSelected) {
      setSelectedTeamMembers(prev => [...prev, member]);
    }
  };

  const handleRemoveTeamMember = (memberId: number) => {
    setSelectedTeamMembers(prev => prev.filter(m => m.id !== memberId));
  };

  // Handle form submission
  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      
      if (!project) return;

      // Prepare project update data
      const updateData = {
        ...values,
        progress: Number(values.progress || 0),
        members: selectedTeamMembers.length, // Update member count
        hoursAllocated: Number(values.hoursAllocated || 0),
        issues: Number(values.issues || 0),
        budget: values.budget ? Number(values.budget) : undefined,
        teamMemberIds: selectedTeamMembers.map(m => m.id)
      };

      // For demo: Simulate update by updating localStorage
      const existingProjects = JSON.parse(localStorage.getItem('projects') || '[]');
      const updatedProjects = existingProjects.map((p: Project) => 
        p.id === project.id ? { ...p, ...updateData } : p
      );
      localStorage.setItem('projects', JSON.stringify(updatedProjects));

      // Also update team members for the project
      await api.updateProjectTeamMembers(project.id, selectedTeamMembers.map(m => m.id));

      message.success('Project updated successfully!');
      
      // Redirect back to project details
      setTimeout(() => {
        navigate(`/project/${project.id}`);
      }, 1500);
      
    } catch (error) {
      message.error('Failed to update project');
      console.error('Error updating project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/project/${project?.id}`);
  };

  // Project type options
  const projectTypes = [
    'Fullstack',
    'Data Engineering', 
    'DevOps',
    'Cloud',
    'Mobile',
    'Frontend',
    'Backend'
  ];

  // Project stage options
  const projectStages = [
    'Not Started',
    'In Progress',
    'On Hold',
    'Completed',
    'Cancelled'
  ];

  // Color options
  const colorOptions = [
    { label: 'Blue', value: 'blue', color: '#3b82f6' },
    { label: 'Purple', value: 'purple', color: '#8b5cf6' },
    { label: 'Green', value: 'green', color: '#10b981' },
    { label: 'Indigo', value: 'indigo', color: '#6366f1' },
    { label: 'Orange', value: 'orange', color: '#f97316' },
    { label: 'Cyan', value: 'cyan', color: '#06b6d4' }
  ];

  // Team members columns for modal
  const teamColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: TeamMember) => (
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center text-white"
            style={{ backgroundColor: record.avatarColor }}
          >
            {record.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="font-medium">{text}</div>
            <div className="text-xs text-gray-500">{record.role}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (text: string) => text || 'Not specified'
    },
    {
      title: 'Workload',
      dataIndex: 'workload',
      key: 'workload',
      render: (text: number) => (
        <Tag color={text >= 90 ? 'red' : text >= 70 ? 'orange' : 'green'}>
          {text}%
        </Tag>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: TeamMember) => {
        const isSelected = selectedTeamMembers.some(m => m.id === record.id);
        return (
          <Button
            type={isSelected ? 'default' : 'primary'}
            size="small"
            onClick={() => isSelected 
              ? handleRemoveTeamMember(record.id) 
              : handleTeamMemberSelect(record)
            }
          >
            {isSelected ? 'Remove' : 'Add'}
          </Button>
        );
      }
    }
  ];

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="text-center py-12">Loading project data...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Project not found</h2>
          <Button onClick={() => navigate('/overview')}>Back to Projects</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(`/project/${project.id}`)}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            Back to Project
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <Title level={2} className="text-gray-900 mb-2">
                Update Project: {project.title}
              </Title>
              <p className="text-gray-600">
                Modify project details and team assignments
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <Card className="border border-gray-200 mb-6">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={project}
          >
            <Row gutter={24}>
              {/* Left Column - Basic Info */}
              <Col span={12}>
                {/* Basic Information */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  
                  <Form.Item
                    name="title"
                    label="Project Title"
                    rules={[
                      { required: true, message: 'Please enter project title' },
                      { max: 100, message: 'Title cannot exceed 100 characters' }
                    ]}
                  >
                    <Input placeholder="Enter project title" />
                  </Form.Item>

                  <Form.Item
                    name="client"
                    label="Client"
                    rules={[
                      { required: true, message: 'Please enter client name' }
                    ]}
                  >
                    <Input placeholder="Enter client name" />
                  </Form.Item>

                  <Form.Item
                    name="description"
                    label="Description"
                  >
                    <TextArea 
                      placeholder="Describe the project..."
                      rows={4}
                      maxLength={500}
                      showCount
                    />
                  </Form.Item>
                </div>

                {/* Project Details */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h3>
                  
                  <Form.Item
                    name="type"
                    label="Project Type"
                    rules={[{ required: true, message: 'Please select project type' }]}
                  >
                    <Select placeholder="Select type">
                      {projectTypes.map(type => (
                        <Option key={type} value={type}>{type}</Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="stage"
                    label="Project Stage"
                    rules={[{ required: true, message: 'Please select project stage' }]}
                  >
                    <Select placeholder="Select stage">
                      {projectStages.map(stage => (
                        <Option key={stage} value={stage}>{stage}</Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="color"
                    label="Color Theme"
                    rules={[{ required: true, message: 'Please select a color' }]}
                  >
                    <Select placeholder="Select color">
                      {colorOptions.map(color => (
                        <Option key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: color.color }}
                            />
                            <span>{color.label}</span>
                          </div>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="budget"
                    label="Budget (in thousands)"
                  >
                    <InputNumber
                      placeholder="Enter budget"
                      min={0}
                      formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      // Type assertion to fix TypeScript error
                      parser={(value: string | undefined) => {
                        if (!value) return 0 as 0;
                        const num = value.replace(/\$\s?|(,*)/g, '');
                        return (Number.parseFloat(num) || 0) as 0;
                      }}
                      className="w-full"
                    />
                  </Form.Item>
                </div>
              </Col>

              {/* Right Column - Metrics & Team */}
              <Col span={12}>
                {/* Timeline */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
                  
                  <Form.Item
                    name="startDate"
                    label="Start Date"
                    rules={[{ required: true, message: 'Please enter start date' }]}
                  >
                    <Input placeholder="DD/MM/YYYY (e.g., 15/01/2024)" />
                  </Form.Item>

                  <Form.Item
                    name="endDate"
                    label="End Date"
                    rules={[{ required: true, message: 'Please enter end date' }]}
                  >
                    <Input placeholder="DD/MM/YYYY (e.g., 30/06/2024)" />
                  </Form.Item>
                </div>

                {/* Metrics */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Metrics</h3>
                  
                  <Form.Item
                    name="progress"
                    label="Progress (%)"
                    rules={[
                      { required: true, message: 'Please enter progress' },
                      { type: 'number', min: 0, max: 100 }
                    ]}
                  >
                    <InputNumber
                      placeholder="0-100"
                      min={0}
                      max={100}
                      className="w-full"
                    />
                  </Form.Item>

                  <Form.Item
                    name="hoursAllocated"
                    label="Hours Allocated"
                    rules={[
                      { required: true, message: 'Please enter hours' },
                      { type: 'number', min: 0 }
                    ]}
                  >
                    <InputNumber
                      placeholder="Enter hours"
                      min={0}
                      className="w-full"
                    />
                  </Form.Item>

                  <Form.Item
                    name="issues"
                    label="Open Issues"
                    rules={[{ type: 'number', min: 0 }]}
                  >
                    <InputNumber
                      placeholder="Enter issues"
                      min={0}
                      className="w-full"
                    />
                  </Form.Item>
                </div>

                {/* Team Members Section */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
                    <Button
                      type="default"
                      icon={<TeamOutlined />}
                      onClick={() => setShowTeamModal(true)}
                    >
                      Manage Team ({selectedTeamMembers.length})
                    </Button>
                  </div>

                  {/* Selected Team Members Preview */}
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    {selectedTeamMembers.length > 0 ? (
                      <div className="space-y-3">
                        {selectedTeamMembers.map(member => (
                          <div key={member.id} className="flex items-center justify-between p-2 bg-white rounded border">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                                style={{ backgroundColor: member.avatarColor }}
                              >
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <div className="font-medium">{member.name}</div>
                                <div className="text-xs text-gray-500">{member.role}</div>
                              </div>
                            </div>
                            <Button
                              type="text"
                              danger
                              size="small"
                              icon={<DeleteOutlined />}
                              onClick={() => handleRemoveTeamMember(member.id)}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        <UserOutlined className="text-2xl mb-2" />
                        <p>No team members selected</p>
                        <Button 
                          type="link" 
                          size="small"
                          onClick={() => setShowTeamModal(true)}
                        >
                          Add team members
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Col>
            </Row>

            <Divider />

            {/* Form Actions */}
            <div className="flex gap-4 justify-end">
              <Button 
                type="default" 
                size="large"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              
              <Button 
                type="primary" 
                htmlType="submit" 
                size="large"
                icon={<SaveOutlined />}
                loading={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Update Project
              </Button>
            </div>
          </Form>
        </Card>

        {/* Team Member Selection Modal */}
        <Modal
          title="Select Team Members"
          open={showTeamModal}
          onCancel={() => setShowTeamModal(false)}
          footer={[
            <Button key="cancel" onClick={() => setShowTeamModal(false)}>
              Cancel
            </Button>,
            <Button 
              key="submit" 
              type="primary" 
              onClick={() => setShowTeamModal(false)}
            >
              Done ({selectedTeamMembers.length} selected)
            </Button>
          ]}
          width={800}
        >
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">
                Select team members to assign to this project
              </span>
              <Tag color="blue">
                {selectedTeamMembers.length} selected
              </Tag>
            </div>
          </div>
          
          <Table
            columns={teamColumns}
            dataSource={allTeamMembers}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            size="middle"
          />
        </Modal>
      </div>
    </div>
  );
}
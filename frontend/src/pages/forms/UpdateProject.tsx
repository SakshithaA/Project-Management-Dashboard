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
  Tag,
  DatePicker,
  AutoComplete
} from 'antd';
import { 
  ArrowLeftOutlined, 
  SaveOutlined,
  DeleteOutlined,
  UserOutlined,
  TeamOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../lib/api';
import dayjs from 'dayjs';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// Interface for project team member assignment
interface ProjectTeamMemberAssignment {
  id?: string; // UUID from project_team_members junction table
  teamMemberId: string; // UUID from team_members table
  name: string;
  email?: string;
  userRole?: string;
  role: string; // Role in this specific project
  hoursAllocated: number;
}

// Simplified interfaces matching your existing code
interface TeamMember {
  id: string;
  name: string;
  email?: string;
  userRole?: string;
  workloadPercentage?: number;
}

interface Project {
  id: string;
  name: string;
  client: string;
  description: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  progress: number;
  budget?: number;
  teamMembers?: ProjectTeamMemberAssignment[];
}

export default function UpdateProject() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [allTeamMembers, setAllTeamMembers] = useState<TeamMember[]>([]);
  const [teamMemberAssignments, setTeamMemberAssignments] = useState<ProjectTeamMemberAssignment[]>([]);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [selectedMemberForEdit, setSelectedMemberForEdit] = useState<ProjectTeamMemberAssignment | null>(null);
  const [memberSearch, setMemberSearch] = useState<string>('');

  // Project type options matching database schema
  const projectTypes = [
    { label: 'Fullstack', value: 'fullstack' },
    { label: 'Data Engineering', value: 'data-engineering' },
    { label: 'DevOps', value: 'devops' },
    { label: 'Cloud', value: 'cloud' },
    { label: 'Mobile', value: 'mobile' },
    { label: 'Frontend', value: 'frontend' },
    { label: 'Backend', value: 'backend' }
  ];

  // Project status options matching database schema
  const projectStatuses = [
    { label: 'Not Started', value: 'not-started' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'On Hold', value: 'on-hold' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' }
  ];

  // Load project data and team members
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          // Fetch project (using backend endpoint #3)
          const projectData = await api.getProject(id);
          if (projectData) {
            setProject(projectData);
            
            // Set form values
            form.setFieldsValue({
              name: projectData.name,
              client: projectData.client,
              description: projectData.description,
              type: projectData.type,
              status: projectData.status,
              startDate: projectData.startDate ? dayjs(projectData.startDate) : null,
              endDate: projectData.endDate ? dayjs(projectData.endDate) : null,
              progress: projectData.progress,
              budget: projectData.budget
            });

            // Set team member assignments
            if (projectData.teamMembers) {
              setTeamMemberAssignments(projectData.teamMembers.map(member => ({
                ...member,
                teamMemberId: member.teamMemberId || member.id || '',
                name: member.name,
                role: member.role,
                hoursAllocated: member.hoursAllocated || 0
              })));
            }
          }
        }

        // Fetch all team members for selection (using backend endpoint #15)
        const response = await api.getTeamMembers();
        setAllTeamMembers(response.data || []);

      } catch (error) {
        console.error('Error loading data:', error);
        message.error('Failed to load project data');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchData();
  }, [id, form]);

  // Handle adding/editing team member
  const handleAddTeamMember = (member: TeamMember) => {
    const existingAssignment = teamMemberAssignments.find(a => a.teamMemberId === member.id);
    
    if (!existingAssignment) {
      // Add new assignment
      const newAssignment: ProjectTeamMemberAssignment = {
        teamMemberId: member.id,
        name: member.name,
        email: member.email,
        userRole: member.userRole,
        role: 'Developer', // Default role
        hoursAllocated: 0
      };
      setTeamMemberAssignments([...teamMemberAssignments, newAssignment]);
      message.success(`${member.name} added to project`);
    } else {
      setSelectedMemberForEdit(existingAssignment);
    }
  };

  const handleMemberSelect = (value: string) => {
    const selectedMember = allTeamMembers.find(member => member.id === value);
    if (selectedMember) {
      const existingAssignment = teamMemberAssignments.find(a => a.teamMemberId === selectedMember.id);
      
      if (!existingAssignment) {
        const newAssignment: ProjectTeamMemberAssignment = {
          teamMemberId: selectedMember.id,
          name: selectedMember.name,
          email: selectedMember.email,
          userRole: selectedMember.userRole,
          role: 'Developer',
          hoursAllocated: 0
        };
        setTeamMemberAssignments([...teamMemberAssignments, newAssignment]);
        message.success(`${selectedMember.name} added to project`);
      }
    }
  };

  const handleUpdateTeamMember = (assignment: ProjectTeamMemberAssignment) => {
    setTeamMemberAssignments(prev =>
      prev.map(a => 
        a.teamMemberId === assignment.teamMemberId ? assignment : a
      )
    );
    setSelectedMemberForEdit(null);
  };

  const handleRemoveTeamMember = (teamMemberId: string) => {
    setTeamMemberAssignments(prev => 
      prev.filter(a => a.teamMemberId !== teamMemberId)
    );
    message.success('Team member removed from project');
  };

  // Handle form submission
  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      
      if (!project) {
        message.error('Project not found');
        return;
      }

      // Prepare project update data
      const updateData = {
        name: values.name,
        client: values.client,
        description: values.description || '',
        type: values.type,
        status: values.status,
        startDate: values.startDate ? values.startDate.format('YYYY-MM-DD') : null,
        endDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : null,
        progress: Number(values.progress || 0),
        budget: values.budget || null,
        teamMembers: teamMemberAssignments.map(member => ({
          teamMemberId: member.teamMemberId,
          name: member.name,
          role: member.role,
          hoursAllocated: member.hoursAllocated
        }))
      };

      // Update project (using backend endpoint #4)
      await api.updateProject(project.id, updateData);

      message.success('Project updated successfully!');
      
      // Redirect back to project details
      setTimeout(() => {
        navigate(`/project/${project.id}`);
      }, 1500);
      
    } catch (error) {
      console.error('Error updating project:', error);
      message.error('Failed to update project');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/project/${project?.id}`);
  };

  // Filter team members based on search
  const filteredTeamMembers = allTeamMembers.filter(member =>
    member.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    member.email?.toLowerCase().includes(memberSearch.toLowerCase())
  );

  // Team members columns for modal
  const teamColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: TeamMember) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <UserOutlined />
          </div>
          <div>
            <div className="font-medium">{text}</div>
            <div className="text-xs text-gray-500">{record.userRole || 'Member'}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => email || 'N/A'
    },
    {
      title: 'Status',
      key: 'status',
      render: (_: any, record: TeamMember) => {
        const isAssigned = teamMemberAssignments.some(a => a.teamMemberId === record.id);
        return (
          <Tag color={isAssigned ? 'blue' : 'default'}>
            {isAssigned ? 'Assigned' : 'Available'}
          </Tag>
        );
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: TeamMember) => {
        const isAssigned = teamMemberAssignments.some(a => a.teamMemberId === record.id);
        return (
          <Button
            type={isAssigned ? 'default' : 'primary'}
            size="small"
            onClick={() => handleAddTeamMember(record)}
          >
            {isAssigned ? 'Edit' : 'Add'}
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
                Update Project: {project.name}
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
          >
            <Row gutter={24}>
              {/* Left Column - Basic Info */}
              <Col span={12}>
                {/* Basic Information */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  
                  <Form.Item
                    name="name"
                    label="Project Name"
                    rules={[
                      { required: true, message: 'Please enter project name' },
                      { max: 255, message: 'Name cannot exceed 255 characters' }
                    ]}
                  >
                    <Input placeholder="Enter project name" size="large" />
                  </Form.Item>

                  <Form.Item
                    name="client"
                    label="Client"
                    rules={[
                      { required: true, message: 'Please enter client name' },
                      { max: 255, message: 'Client name cannot exceed 255 characters' }
                    ]}
                  >
                    <Input placeholder="Enter client name" size="large" />
                  </Form.Item>

                  <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ max: 1000, message: 'Description cannot exceed 1000 characters' }]}
                  >
                    <TextArea 
                      placeholder="Describe the project..."
                      rows={4}
                      maxLength={1000}
                      showCount
                      size="large"
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
                    <Select placeholder="Select project type" size="large">
                      {projectTypes.map(type => (
                        <Option key={type.value} value={type.value}>
                          {type.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="status"
                    label="Project Status"
                    rules={[{ required: true, message: 'Please select project status' }]}
                  >
                    <Select placeholder="Select project status" size="large">
                      {projectStatuses.map(status => (
                        <Option key={status.value} value={status.value}>
                          {status.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="budget"
                    label="Budget ($)"
                  >
                    <InputNumber
                      placeholder="Enter budget"
                      min={0}
                      step={1000}
                      formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value ? parseFloat(value.replace(/\$\s?|(,*)/g, '')) : 0}
                      className="w-full"
                      size="large"
                    />
                  </Form.Item>
                </div>
              </Col>

              {/* Right Column - Timeline & Metrics */}
              <Col span={12}>
                {/* Timeline */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
                  
                  <Form.Item
                    name="startDate"
                    label="Start Date"
                    rules={[{ required: true, message: 'Please select start date' }]}
                  >
                    <DatePicker 
                      placeholder="Select start date"
                      format="YYYY-MM-DD"
                      className="w-full"
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item
                    name="endDate"
                    label="End Date"
                    rules={[{ required: true, message: 'Please select end date' }]}
                  >
                    <DatePicker 
                      placeholder="Select end date"
                      format="YYYY-MM-DD"
                      className="w-full"
                      size="large"
                    />
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
                      { type: 'number', min: 0, max: 100, message: 'Progress must be between 0 and 100' }
                    ]}
                  >
                    <InputNumber
                      placeholder="0-100"
                      min={0}
                      max={100}
                      className="w-full"
                      size="large"
                      addonAfter="%"
                    />
                  </Form.Item>
                </div>

                {/* Team Members Section */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
                    <div className="flex gap-2">
                      <Button
                        type="default"
                        icon={<TeamOutlined />}
                        onClick={() => setShowTeamModal(true)}
                      >
                        Manage Team ({teamMemberAssignments.length})
                      </Button>
                    </div>
                  </div>

                  {/* Quick Add Team Member */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Quick Add Team Member
                    </label>
                    <AutoComplete
                      options={allTeamMembers.map(member => ({
                        value: member.id,
                        label: (
                          <div className="flex items-center">
                            <UserOutlined className="mr-2 text-gray-400" />
                            <span>{member.name}</span>
                            {member.userRole && (
                              <span className="ml-2 text-xs text-gray-500">({member.userRole})</span>
                            )}
                          </div>
                        )
                      }))}
                      onSelect={handleMemberSelect}
                      onSearch={setMemberSearch}
                      placeholder="Search and add team member..."
                      className="w-full"
                    >
                      <Input
                        prefix={<SearchOutlined className="text-gray-400" />}
                        size="large"
                      />
                    </AutoComplete>
                  </div>

                  {/* Selected Team Members Preview */}
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    {teamMemberAssignments.length > 0 ? (
                      <div className="space-y-3">
                        {teamMemberAssignments.map(assignment => (
                          <div key={assignment.teamMemberId} className="flex items-center justify-between p-3 bg-white rounded border">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <UserOutlined />
                              </div>
                              <div>
                                <div className="font-medium">{assignment.name}</div>
                                <div className="text-xs text-gray-500">
                                  {assignment.role} • {assignment.hoursAllocated}h allocated
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                type="text"
                                size="small"
                                onClick={() => setSelectedMemberForEdit(assignment)}
                              >
                                Edit
                              </Button>
                              <Button
                                type="text"
                                danger
                                size="small"
                                icon={<DeleteOutlined />}
                                onClick={() => handleRemoveTeamMember(assignment.teamMemberId)}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        <TeamOutlined className="text-2xl mb-2" />
                        <p>No team members assigned</p>
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
              Done ({teamMemberAssignments.length} selected)
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
                {teamMemberAssignments.length} selected
              </Tag>
            </div>
          </div>
          
          <Table
            columns={teamColumns}
            dataSource={filteredTeamMembers}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            size="middle"
          />
        </Modal>

        {/* Edit Team Member Modal */}
        <Modal
          title="Edit Team Member Assignment"
          open={!!selectedMemberForEdit}
          onCancel={() => setSelectedMemberForEdit(null)}
          onOk={() => selectedMemberForEdit && handleUpdateTeamMember(selectedMemberForEdit)}
          okText="Update"
        >
          {selectedMemberForEdit && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <UserOutlined />
                </div>
                <div>
                  <div className="font-medium">{selectedMemberForEdit.name}</div>
                  <div className="text-sm text-gray-500">{selectedMemberForEdit.email}</div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role in this Project
                </label>
                <Input
                  value={selectedMemberForEdit.role}
                  onChange={e => setSelectedMemberForEdit({
                    ...selectedMemberForEdit,
                    role: e.target.value
                  })}
                  placeholder="e.g., Lead Developer, QA Engineer"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hours Allocated
                </label>
                <InputNumber
                  value={selectedMemberForEdit.hoursAllocated}
                  onChange={value => setSelectedMemberForEdit({
                    ...selectedMemberForEdit,
                    hoursAllocated: value || 0
                  })}
                  placeholder="e.g., 160"
                  min={0}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
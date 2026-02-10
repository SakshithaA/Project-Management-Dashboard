import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Select, DatePicker, InputNumber, Button, message, Alert, AutoComplete } from "antd";
import { UserOutlined, PlusOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import FormTemplate from "../../components/FormTemplate";
import { api } from "../../lib/api";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Option } = Select;

interface TeamMemberInput {
  id: string;
  name: string;
  role: string;
  hoursAllocated: number;
}

export default function AddProject() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [teamMembers, setTeamMembers] = useState<TeamMemberInput[]>([
    { id: "1", name: "", role: "", hoursAllocated: 0 }
  ]);
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [availableMembers, setAvailableMembers] = useState<any[]>([]);
  const [memberSearch, setMemberSearch] = useState<string>("");

  const projectTypes = [
    { value: "fullstack", label: "Fullstack" },
    { value: "data-engineering", label: "Data Engineering" },
    { value: "cloud", label: "Cloud" },
    { value: "mobile", label: "Mobile" },
    { value: "frontend", label: "Frontend" },
    { value: "backend", label: "Backend" },
    { value: "devops", label: "DevOps" }
  ];

  const projectStatuses = [
    { value: "not-started", label: "Not Started" },
    { value: "in-progress", label: "In Progress" },
    { value: "on-hold", label: "On Hold" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" }
  ];

  useEffect(() => {
    fetchAvailableMembers();
  }, []);

  useEffect(() => {
    const checkFormValidity = async () => {
      try {
        await form.validateFields();
        
        const hasInvalidTeamMembers = teamMembers.some(member => 
          !member.name.trim() || !member.role.trim() || member.hoursAllocated < 0
        );
        
        setIsFormValid(!hasInvalidTeamMembers);
      } catch (error) {
        setIsFormValid(false);
      }
    };

    checkFormValidity();
  }, [form, teamMembers]);

  const fetchAvailableMembers = async () => {
    try {
      const response = await api.getTeamMembers();
      setAvailableMembers(response.data);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  const handleAddTeamMember = () => {
    setTeamMembers([...teamMembers, {
      id: Date.now().toString(),
      name: "",
      role: "",
      hoursAllocated: 0
    }]);
  };

  const handleRemoveTeamMember = (id: string) => {
    if (teamMembers.length > 1) {
      setTeamMembers(teamMembers.filter(member => member.id !== id));
    }
  };

  const handleTeamMemberChange = (id: string, field: keyof TeamMemberInput, value: string | number) => {
    setTeamMembers(teamMembers.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  const handleMemberSelect = (value: string, index: number) => {
    const selectedMember = availableMembers.find(member => member.id === value);
    if (selectedMember) {
      handleTeamMemberChange(teamMembers[index].id, 'name', selectedMember.name);
    }
  };

  const handleSubmit = async (values: any) => {
    if (!isFormValid) return;

    try {
      setLoading(true);
      
      const projectData = {
        name: values.name,
        client: values.client,
        description: values.description || "",
        type: values.type,
        status: values.status,
        startDate: values.startDate.format('YYYY-MM-DD'),
        endDate: values.endDate.format('YYYY-MM-DD'),
        progress: values.progress || 0,
        budget: values.budget || null,
        teamMembers: teamMembers.map(member => ({
          teamMemberId: availableMembers.find(m => m.name === member.name)?.id,
          name: member.name,
          role: member.role,
          hoursAllocated: member.hoursAllocated
        }))
      };

      await api.createProject(projectData);
      
      message.success('Project created successfully!');
      setTimeout(() => {
        navigate("/overview");
      }, 1500);
      
    } catch (error) {
      console.error('Error creating project:', error);
      message.error('Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/overview");
  };

  const teamMembersContent = (
    <div className="space-y-6">
      {teamMembers.map((member, index) => (
        <div key={member.id} className="space-y-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <UserOutlined className="text-gray-500 mr-2" />
              <span className="text-sm font-semibold text-gray-700">
                Team Member {index + 1}
              </span>
            </div>
            {teamMembers.length > 1 && (
              <Button
                type="text"
                icon={<DeleteOutlined />}
                danger
                onClick={() => handleRemoveTeamMember(member.id)}
                className="text-gray-400 hover:text-red-500"
              />
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Team Member *
              </label>
              <AutoComplete
                options={availableMembers.map(member => ({
                  value: member.id,
                  label: (
                    <div className="flex items-center">
                      <UserOutlined className="mr-2 text-gray-400" />
                      <span>{member.name}</span>
                      <span className="ml-2 text-xs text-gray-500">({member.userRole})</span>
                    </div>
                  )
                }))}
                value={member.name}
                onChange={(value) => handleTeamMemberChange(member.id, 'name', value)}
                onSelect={(value) => handleMemberSelect(value as string, index)}
                placeholder="Search team member..."
                className="w-full"
                filterOption={(inputValue, option) =>
                  option?.label?.props.children[1].props.children
                    .toLowerCase()
                    .includes(inputValue.toLowerCase()) || false
                }
              >
                <Input
                  prefix={<SearchOutlined className="text-gray-400" />}
                  className="rounded-lg"
                />
              </AutoComplete>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Role *
                </label>
                <Input
                  placeholder="e.g., Lead Developer"
                  value={member.role}
                  onChange={(e) => handleTeamMemberChange(member.id, 'role', e.target.value)}
                  className="rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Hours Allocated *
                </label>
                <InputNumber
                  min={0}
                  placeholder="40"
                  value={member.hoursAllocated}
                  onChange={(value) => handleTeamMemberChange(member.id, 'hoursAllocated', value || 0)}
                  className="w-full rounded-lg"
                  addonAfter="hours"
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      <Button
        type="dashed"
        icon={<PlusOutlined />}
        onClick={handleAddTeamMember}
        className="w-full h-12 border-dashed border-2 border-gray-400 hover:border-blue-500 hover:text-blue-600 rounded-lg font-medium"
      >
        Add Team Member
      </Button>
    </div>
  );

  const sections = [
    {
      key: "basic-info",
      title: "Basic Information",
      subtitle: "Core details about the project",
      color: "#2563eb",
      content: (
        <>
          <Form.Item
            label={<span className="font-semibold">Project Name</span>}
            name="name"
            rules={[{ required: true, message: 'Please enter project name' }]}
          >
            <Input 
              placeholder="E-commerce Platform Rebuild" 
              size="large"
              className="rounded-lg border-gray-300"
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-semibold">Client</span>}
            name="client"
            rules={[{ required: true, message: 'Please enter client name' }]}
          >
            <Input 
              placeholder="RetailCo Inc" 
              size="large"
              className="rounded-lg border-gray-300"
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-semibold">Description</span>}
            name="description"
            rules={[{ required: true, message: 'Please enter project description' }]}
          >
            <TextArea 
              placeholder="Detailed description of the project scope and objectives"
              rows={4}
              className="rounded-lg border-gray-300"
              maxLength={500}
              showCount
            />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              label={<span className="font-semibold">Project Type</span>}
              name="type"
              rules={[{ required: true, message: 'Please select project type' }]}
            >
              <Select 
                placeholder="Select project type" 
                size="large"
                className="rounded-lg border-gray-300"
              >
                {projectTypes.map(type => (
                  <Option key={type.value} value={type.value}>{type.label}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label={<span className="font-semibold">Project Status</span>}
              name="status"
              rules={[{ required: true, message: 'Please select project status' }]}
            >
              <Select 
                placeholder="Select project status" 
                size="large"
                className="rounded-lg border-gray-300"
              >
                {projectStatuses.map(status => (
                  <Option key={status.value} value={status.value}>{status.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              label={<span className="font-semibold">Start Date</span>}
              name="startDate"
              rules={[{ required: true, message: 'Please select start date' }]}
            >
              <DatePicker 
                placeholder="Select start date" 
                format="YYYY-MM-DD"
                size="large"
                className="w-full rounded-lg border-gray-300"
              />
            </Form.Item>

            <Form.Item
              label={<span className="font-semibold">End Date</span>}
              name="endDate"
              rules={[{ required: true, message: 'Please select end date' }]}
            >
              <DatePicker 
                placeholder="Select end date" 
                format="YYYY-MM-DD"
                size="large"
                className="w-full rounded-lg border-gray-300"
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              label={<span className="font-semibold">Initial Progress (%)</span>}
              name="progress"
              initialValue={0}
            >
              <InputNumber
                min={0}
                max={100}
                placeholder="0"
                size="large"
                className="w-full rounded-lg border-gray-300"
                addonAfter="%"
              />
            </Form.Item>

            <Form.Item
              label={<span className="font-semibold">Budget ($)</span>}
              name="budget"
            >
              <InputNumber
                min={0}
                placeholder="50000"
                size="large"
                className="w-full rounded-lg border-gray-300"
                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value: string | undefined) => {
                  if (!value) return 0 as 0;
                  const num = value.replace(/\$\s?|(,*)/g, '');
                  return (Number.parseFloat(num) || 0) as 0;
                }}
              />
            </Form.Item>
          </div>
        </>
      )
    },
    {
      key: "team-members",
      title: "Team Members",
      subtitle: "Add team members and their allocated hours",
      color: "#7c3aed",
      content: teamMembersContent
    }
  ];

  return (
    <FormTemplate
      backPath="/overview"
      title="Add New Project"
      subtitle="Create a new project with team assignments and timeline"
      submitText="Create Project"
      cancelText="Cancel"
      onFinish={handleSubmit}
      onCancel={handleCancel}
      form={form}
      sections={sections}
      submitDisabled={!isFormValid || loading}
      loading={loading}
      width="65%"
    />
  );
}
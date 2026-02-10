import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Select, DatePicker, Button, InputNumber, message, Tag, AutoComplete } from "antd";
import { PlusOutlined, UserOutlined, MailOutlined, DeleteOutlined } from "@ant-design/icons";
import FormTemplate from "../../components/FormTemplate";
import { api } from "../../lib/api";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Option } = Select;

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  hoursAllocated: number;
}

export default function AddPOC() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: "1", name: "", email: "", role: "", hoursAllocated: 0 }
  ]);
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [availableTechnologies, setAvailableTechnologies] = useState<string[]>([
    "React", "Node.js", "TypeScript", "Python", "Django", "FastAPI",
    "AWS", "Azure", "GCP", "Docker", "Kubernetes", "MongoDB",
    "PostgreSQL", "Redis", "GraphQL", "Vue.js", "Angular", "Flutter",
    "React Native", "TensorFlow", "PyTorch", "OpenAI API", "Socket.io",
    "Firebase", "gRPC", "Microservices"
  ]);

  const pocStatuses = [
    { value: "planning", label: "Planning" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "on-hold", label: "On Hold" }
  ];

  useEffect(() => {
    const checkFormValidity = async () => {
      try {
        await form.validateFields();
        
        const hasEmptyTeamMembers = teamMembers.some(member => 
          !member.name.trim() || !member.email.trim() || !member.role.trim()
        );
        
        setIsFormValid(!hasEmptyTeamMembers && technologies.length > 0);
      } catch (error) {
        setIsFormValid(false);
      }
    };

    checkFormValidity();
  }, [form, teamMembers, technologies]);

  const handleAddTeamMember = () => {
    setTeamMembers([...teamMembers, {
      id: Date.now().toString(),
      name: "",
      email: "",
      role: "",
      hoursAllocated: 0
    }]);
  };

  const handleRemoveTeamMember = (id: string) => {
    if (teamMembers.length > 1) {
      setTeamMembers(teamMembers.filter(member => member.id !== id));
    }
  };

  const handleTeamMemberChange = (id: string, field: keyof TeamMember, value: string) => {
    setTeamMembers(teamMembers.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  const handleTechnologyAdd = (tech: string) => {
    if (tech && !technologies.includes(tech)) {
      setTechnologies([...technologies, tech]);
    }
  };

  const handleTechnologyRemove = (tech: string) => {
    setTechnologies(technologies.filter(t => t !== tech));
  };

  const handleSubmit = async (values: any) => {
    if (!isFormValid) return;

    try {
      setLoading(true);
      
      const pocData = {
        title: values.title,
        description: values.description || "",
        overview: values.overview || "",
        endGoal: values.endGoal || "",
        status: values.status,
        startDate: values.startDate.format('YYYY-MM-DD'),
        endDate: values.endDate.format('YYYY-MM-DD'),
        progress: values.progress || 0,
        technologies: technologies,
        teamMembers: teamMembers.map(member => ({
          name: member.name,
          role: member.role,
          email: member.email,
          hoursAllocated: member.hoursAllocated
        }))
      };

      await api.createStandalonePOC(pocData);
      
      message.success('POC created successfully!');
      setTimeout(() => {
        navigate("/pocs");
      }, 1500);
      
    } catch (error) {
      console.error('Error creating POC:', error);
      message.error('Failed to create POC');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/pocs");
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
                danger
                onClick={() => handleRemoveTeamMember(member.id)}
                className="text-gray-400 hover:text-red-500"
              >
                Remove
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Name *
              </label>
              <Input
                placeholder="John Smith"
                value={member.name}
                onChange={(e) => handleTeamMemberChange(member.id, 'name', e.target.value)}
                className="rounded-lg border-gray-300"
                size="large"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email *
              </label>
              <Input
                placeholder="john.smith@company.com"
                value={member.email}
                onChange={(e) => handleTeamMemberChange(member.id, 'email', e.target.value)}
                className="rounded-lg border-gray-300"
                size="large"
                prefix={<MailOutlined className="text-gray-400" />}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Role *
                </label>
                <Input
                  placeholder="Technical Lead"
                  value={member.role}
                  onChange={(e) => handleTeamMemberChange(member.id, 'role', e.target.value)}
                  className="rounded-lg border-gray-300"
                  size="large"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Hours Allocated
                </label>
                <InputNumber
                  min={0}
                  placeholder="200"
                  value={member.hoursAllocated}
                  onChange={(value) => handleTeamMemberChange(member.id, 'hoursAllocated', value?.toString() || "0")}
                  className="w-full rounded-lg border-gray-300"
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

  const technologiesContent = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Technologies *
        </label>
        <AutoComplete
          options={availableTechnologies.map(tech => ({ value: tech }))}
          onSelect={handleTechnologyAdd}
          onSearch={(value) => {
            // Filter technologies based on search
            if (value && !availableTechnologies.includes(value)) {
              setAvailableTechnologies([...availableTechnologies, value]);
            }
          }}
          placeholder="Type and press Enter to add technology"
          className="w-full"
        >
          <Input
            size="large"
            className="rounded-lg border-gray-300"
            onPressEnter={(e: any) => {
              handleTechnologyAdd(e.target.value);
              e.target.value = "";
            }}
          />
        </AutoComplete>
        <p className="text-xs text-gray-500 mt-1">
          Type technology name and press Enter to add
        </p>
      </div>

      <div className="mt-4">
        <div className="text-sm font-semibold text-gray-700 mb-2">
          Selected Technologies ({technologies.length})
        </div>
        <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg bg-gray-50 min-h-[60px]">
          {technologies.length > 0 ? (
            technologies.map((tech, index) => (
              <Tag
                key={index}
                color="blue"
                closable
                onClose={() => handleTechnologyRemove(tech)}
                className="px-3 py-1 text-sm font-medium"
              >
                {tech}
              </Tag>
            ))
          ) : (
            <div className="text-gray-400 text-sm italic">
              No technologies added yet
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const sections = [
    {
      key: "poc-details",
      title: "POC Details",
      subtitle: "Core information about the proof of concept",
      color: "#2563eb",
      content: (
        <>
          <Form.Item
            label={<span className="font-semibold">POC Title</span>}
            name="title"
            rules={[{ required: true, message: 'Please enter POC title' }]}
          >
            <Input 
              placeholder="Microservices Architecture with gRPC" 
              size="large"
              className="rounded-lg border-gray-300"
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-semibold">Description</span>}
            name="description"
            rules={[{ required: true, message: 'Please enter POC description' }]}
          >
            <TextArea 
              placeholder="Brief description of what this POC aims to achieve"
              rows={2}
              className="rounded-lg border-gray-300"
              maxLength={200}
              showCount
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-semibold">Overview</span>}
            name="overview"
            rules={[{ required: true, message: 'Please enter POC overview' }]}
          >
            <TextArea 
              placeholder="Detailed technical overview of the approach and methodology"
              rows={3}
              className="rounded-lg border-gray-300"
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-semibold">End Goal</span>}
            name="endGoal"
            rules={[{ required: true, message: 'Please enter POC end goal' }]}
          >
            <TextArea 
              placeholder="What success looks like and key deliverables"
              rows={2}
              className="rounded-lg border-gray-300"
              maxLength={200}
              showCount
            />
          </Form.Item>
        </>
      )
    },
    {
      key: "technologies",
      title: "Technologies",
      subtitle: "Select technologies to be used in this POC",
      color: "#7c3aed",
      content: technologiesContent
    },
    {
      key: "planning",
      title: "Planning",
      subtitle: "Set status, timeline and progress",
      color: "#059669",
      content: (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              label={<span className="font-semibold">Status</span>}
              name="status"
              rules={[{ required: true, message: 'Please select POC status' }]}
              initialValue="planning"
            >
              <Select 
                placeholder="Select Status" 
                size="large"
                className="rounded-lg border-gray-300"
              >
                {pocStatuses.map(status => (
                  <Option key={status.value} value={status.value}>{status.label}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label={<span className="font-semibold">Progress (%)</span>}
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
        </>
      )
    },
    {
      key: "team-members",
      title: "Team Members",
      subtitle: "Add team members working on this POC",
      color: "#ea580c",
      content: teamMembersContent
    }
  ];

  return (
    <FormTemplate
      backPath="/pocs"
      title="Add New POC"
      subtitle="Create a proof of concept to explore new technologies and validate ideas"
      submitText="Create POC"
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
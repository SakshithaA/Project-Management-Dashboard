import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Select, DatePicker, InputNumber, Button } from "antd";
import { UserOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import FormTemplate from "../../components/FormTemplate";

const { TextArea } = Input;
const { Option } = Select;

interface TeamMember {
  id: number;
  name: string;
  role: string;
  hoursAllocated: number;
}

export default function AddProject() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: 1, name: "", role: "", hoursAllocated: 0 }
  ]);
  
  // Add state for form validity
  const [isFormValid, setIsFormValid] = useState(false);

  const projectTypes = [
    "Fullstack",
    "Data Engineering", 
    "Cloud",
    "Mobile",
    "Frontend",
    "Backend",
    "DevOps"
  ];

  const projectStages = [
    "Not Started",
    "In Progress",
    "On Hold",
    "Completed",
    "Cancelled"
  ];

  // Check form validity whenever form values or team members change
  useEffect(() => {
    const checkFormValidity = async () => {
      try {
        // Validate all form fields
        await form.validateFields();
        
        // Check if all team members have required fields filled
        const hasInvalidTeamMembers = teamMembers.some(member => 
          !member.name.trim() || !member.role.trim() || member.hoursAllocated < 0
        );
        
        // Set form validity based on both form fields and team members
        setIsFormValid(!hasInvalidTeamMembers);
      } catch (error) {
        // If form validation fails, form is invalid
        setIsFormValid(false);
      }
    };

    checkFormValidity();
  }, [form, teamMembers]);

  const handleAddTeamMember = () => {
    setTeamMembers([...teamMembers, {
      id: teamMembers.length + 1,
      name: "",
      role: "",
      hoursAllocated: 0
    }]);
  };

  const handleRemoveTeamMember = (id: number) => {
    if (teamMembers.length > 1) {
      setTeamMembers(teamMembers.filter(member => member.id !== id));
    }
  };

  const handleTeamMemberChange = (id: number, field: keyof TeamMember, value: string | number) => {
    setTeamMembers(teamMembers.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  const handleSubmit = (values: any) => {
    // Double-check form validity before submission
    if (!isFormValid) return;
    
    console.log("Project data:", { ...values, teamMembers });
    // API call would go here
    navigate("/overview");
  };

  // Team Members Section Content
  const teamMembersContent = (
    <div className="space-y-6">
      {teamMembers.map((member, index) => (
        <div key={member.id} className="space-y-4 p-4 border border-gray-100 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <UserOutlined className="text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-700">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <Input
                placeholder="ex Sarah Johnson"
                value={member.name}
                onChange={(e) => handleTeamMemberChange(member.id, 'name', e.target.value)}
                className="rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role *
              </label>
              <Input
                placeholder="ex Lead Developer"
                value={member.role}
                onChange={(e) => handleTeamMemberChange(member.id, 'role', e.target.value)}
                className="rounded-lg"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Allocated Hours *
            </label>
            <InputNumber
              min={0}
              placeholder="0"
              value={member.hoursAllocated}
              onChange={(value) => handleTeamMemberChange(member.id, 'hoursAllocated', value || 0)}
              className="w-full rounded-lg"
              addonAfter="hours"
              required
            />
          </div>
        </div>
      ))}

      <Button
        type="dashed"
        icon={<PlusOutlined />}
        onClick={handleAddTeamMember}
        className="w-full h-12 border-dashed border-2 border-gray-300 hover:border-blue-400 hover:text-blue-500 rounded-lg"
      >
        Add Team Member
      </Button>
    </div>
  );

  // Define the form sections
  const sections = [
    {
      key: "basic-info",
      title: "Basic Information",
      subtitle: "Core details about the project",
      color: "#3b82f6", // blue-500
      content: (
        <>
          <Form.Item
            label="Project Title"
            name="title"
            rules={[{ required: true, message: 'Please enter project title' }]}
          >
            <Input 
              placeholder="E-commerce Platform Rebuild" 
              size="large"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            label="Client"
            name="client"
            rules={[{ required: true, message: 'Please enter client name' }]}
          >
            <Input 
              placeholder="RetailCo Inc" 
              size="large"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please enter project description' }]}
          >
            <TextArea 
              placeholder="Detailed description of the project scope and objectives"
              rows={4}
              className="rounded-lg"
            />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              label="Project Type"
              name="type"
              rules={[{ required: true, message: 'Please select project type' }]}
            >
              <Select 
                placeholder="Fullstack" 
                size="large"
                className="rounded-lg"
              >
                {projectTypes.map(type => (
                  <Option key={type} value={type}>{type}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Project Stage"
              name="stage"
              rules={[{ required: true, message: 'Please select project stage' }]}
            >
              <Select 
                placeholder="Not Started" 
                size="large"
                className="rounded-lg"
              >
                {projectStages.map(stage => (
                  <Option key={stage} value={stage}>{stage}</Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            label="Initial Progress (%)"
            name="progress"
            initialValue={0}
          >
            <InputNumber
              min={0}
              max={100}
              placeholder="0"
              size="large"
              className="w-full rounded-lg"
              addonAfter="%"
            />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              label="Start Date"
              name="startDate"
              rules={[{ required: true, message: 'Please select start date' }]}
            >
              <DatePicker 
                placeholder="dd-mm-yyyy" 
                format="DD-MM-YYYY"
                size="large"
                className="w-full rounded-lg"
              />
            </Form.Item>

            <Form.Item
              label="End Date"
              name="endDate"
              rules={[{ required: true, message: 'Please select end date' }]}
            >
              <DatePicker 
                placeholder="dd-mm-yyyy" 
                format="DD-MM-YYYY"
                size="large"
                className="w-full rounded-lg"
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
      color: "#8b5cf6", // purple-500
      content: teamMembersContent
    }
  ];

  return (
    <FormTemplate
      backPath="/overview"
      title="Add New Project"
      subtitle="Enter project details to track progress and manage team members"
      submitText="Create Project"
      onFinish={handleSubmit}
      form={form}
      sections={sections}
      // Add this prop to control submit button disabled state
      submitDisabled={!isFormValid}
    />
  );
}
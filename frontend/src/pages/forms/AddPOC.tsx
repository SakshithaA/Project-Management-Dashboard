import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Select, DatePicker, Button, InputNumber } from "antd";
import { PlusOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import FormTemplate from "../../components/FormTemplate";

const { TextArea } = Input;
const { Option } = Select;

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function AddPOC() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: 1, name: "", email: "", role: "" }
  ]);

  const pocStatuses = [
    "Planning",
    "In Progress",
    "On Hold",
    "Completed",
    "Cancelled"
  ];

  const handleAddTeamMember = () => {
    setTeamMembers([...teamMembers, {
      id: teamMembers.length + 1,
      name: "",
      email: "",
      role: ""
    }]);
  };

  const handleRemoveTeamMember = (id: number) => {
    if (teamMembers.length > 1) {
      setTeamMembers(teamMembers.filter(member => member.id !== id));
    }
  };

  const handleTeamMemberChange = (id: number, field: keyof TeamMember, value: string) => {
    setTeamMembers(teamMembers.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  const handleSubmit = (values: any) => {
    console.log("POC data:", { 
      ...values, 
      teamMembers 
    });
    // API call would go here
    navigate("/pocs");
  };

  // POC Details Section Content
  const pocDetailsContent = (
    <>
      <Form.Item
        label="POC Title"
        name="title"
        rules={[{ required: true, message: 'Please enter POC title' }]}
      >
        <Input 
          placeholder="Microservices Architecture with gRPC" 
          size="large"
          className="rounded-lg"
        />
      </Form.Item>

      <Form.Item
        label="Overview"
        name="overview"
        rules={[{ required: true, message: 'Please enter POC overview' }]}
      >
        <TextArea 
          placeholder="High-level overview of what this POC aims to explore"
          rows={2}
          className="rounded-lg"
        />
      </Form.Item>

      <Form.Item
        label="Technical Details"
        name="technicalDetails"
        rules={[{ required: true, message: 'Please enter technical details' }]}
      >
        <TextArea 
          placeholder="Detailed technical description of the approach and methodology"
          rows={3}
          className="rounded-lg"
        />
      </Form.Item>

      <Form.Item
        label="Success Criteria"
        name="successCriteria"
        rules={[{ required: true, message: 'Please enter success criteria' }]}
      >
        <TextArea 
          placeholder="What success looks like and key deliverables"
          rows={2}
          className="rounded-lg"
        />
      </Form.Item>

      <Form.Item
        label="Technologies"
        name="technologies"
        rules={[{ required: true, message: 'Please enter technologies' }]}
        help="Enter technologies separated by commas"
      >
        <Input 
          placeholder="React, Node.js, PostgreSQL" 
          size="large"
          className="rounded-lg"
        />
      </Form.Item>
    </>
  );

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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <Input
                placeholder="John Smith"
                value={member.name}
                onChange={(e) => handleTeamMemberChange(member.id, 'name', e.target.value)}
                className="rounded-lg"
                size="large"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                placeholder="john.smith@company.com"
                value={member.email}
                onChange={(e) => handleTeamMemberChange(member.id, 'email', e.target.value)}
                className="rounded-lg"
                size="large"
                prefix={<MailOutlined className="text-gray-400" />}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <Input
                placeholder="Technical Lead"
                value={member.role}
                onChange={(e) => handleTeamMemberChange(member.id, 'role', e.target.value)}
                className="rounded-lg"
                size="large"
              />
            </div>
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
      key: "poc-details",
      title: "POC Details",
      subtitle: "Core information about the proof of concept",
      color: "#3b82f6", // blue-500
      content: pocDetailsContent
    },
    {
      key: "planning",
      title: "Planning",
      subtitle: "Set status, timeline and progress",
      color: "#10b981", // green-500
      content: (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: 'Please select POC status' }]}
              initialValue="Planning"
            >
              <Select 
                placeholder="Select Status" 
                size="large"
                className="rounded-lg"
              >
                {pocStatuses.map(status => (
                  <Option key={status} value={status}>{status}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Progress (%)"
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
          </div>

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
      subtitle: "Add team members working on this POC",
      color: "#8b5cf6", // purple-500
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
      form={form}
      sections={sections}
    />
  );
}
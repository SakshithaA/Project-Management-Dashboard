import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Input, Select, InputNumber, Avatar, Tag, message } from "antd";
import { UserOutlined, MailOutlined, EnvironmentOutlined, TeamOutlined } from "@ant-design/icons";
import FormTemplate from "../../components/FormTemplate";
import { api } from "../../services/api";

const { Option } = Select;

export default function UpdateTeamMember() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [isFormValid, setIsFormValid] = useState(false);
  const [memberData, setMemberData] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [allTeamMembers, setAllTeamMembers] = useState<any[]>([]);
  const [interns, setInterns] = useState<any[]>([]);

  // Departments list
  const departments = [
    "Engineering",
    "Product", 
    "Design",
    "QA",
    "DevOps",
    "Data Science",
    "Full Stack Development",
    "Mobile Development"
  ];

  // Job titles/Roles list
  const jobTitles = [
    "Lead Developer & Mentor",
    "Senior Developer",
    "Lead Developer", 
    "Technical Lead",
    "Architect",
    "Engineering Manager",
    "Product Manager",
    "QA Lead"
  ];

  // Status options
  const statusOptions = [
    { value: "active", label: "Active", color: "green" },
    { value: "on-leave", label: "On Leave", color: "orange" },
    { value: "inactive", label: "Inactive", color: "red" }
  ];

  // Avatar colors
  const avatarColors = [
    "#3b82f6", "#10b981", "#8b5cf6", "#f59e0b",
    "#ef4444", "#06b6d4", "#ec4899", "#84cc16"
  ];

  useEffect(() => {
    if (id) {
      fetchMemberData(parseInt(id));
      fetchAllData();
    }
  }, [id]);

  useEffect(() => {
    const checkFormValidity = async () => {
      try {
        await form.validateFields();
        setIsFormValid(true);
      } catch (error) {
        setIsFormValid(false);
      }
    };

    checkFormValidity();
  }, [form]);

  const fetchAllData = async () => {
    try {
      const [projectsData, teamMembersData, internsData] = await Promise.all([
        api.getProjects(),
        api.getAllTeamMembers(),
        api.getAllInterns()
      ]);
      setProjects(projectsData);
      setAllTeamMembers(teamMembersData);
      setInterns(internsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Failed to load data');
    }
  };

  const fetchMemberData = async (memberId: number) => {
    try {
      setLoading(true);
      const data = await api.getTeamMember(memberId);
      if (data) {
        setMemberData(data);
        
        // Get member's projects
        const memberProjects = await api.getProjectsByTeamMember(memberId);
        
        form.setFieldsValue({
          name: data.name,
          jobTitle: data.jobTitle || data.role,
          email: data.email || '',
          department: data.department || 'Engineering',
          workload: data.workload || 0,
          hoursAllocated: data.hoursAllocated || 40,
          activeProjects: data.activeProjects || 0,
          activePOCs: data.activePOCs || 0,
          certifications: data.certifications || 0,
          hasInterns: data.hasInterns || false,
          avatarColor: data.avatarColor || '#3b82f6',
          // Project assignments
          projectIds: data.projectIds || memberProjects.map(p => p.id),
          // Intern assignments
          internIds: data.internIds || []
        });
      }
    } catch (error) {
      console.error('Error fetching member data:', error);
      message.error('Failed to load team member data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    if (!isFormValid || !id) return;

    try {
      console.log('Updating team member:', values);
      
      // Here you would typically update the JSON data
      // For now, just show success
      message.success('Team member updated successfully!');
      
      await new Promise(resolve => setTimeout(resolve, 500));
      navigate(`/team-member/${id}`);
    } catch (error) {
      console.error('Error updating team member:', error);
      message.error('Failed to update team member');
    }
  };

  // Filter interns that don't already have this mentor
  const availableInterns = interns.filter(intern => 
    !memberData?.internIds?.includes(intern.id) || intern.mentorId === parseInt(id || '0')
  );

  // Basic Information Section
  const basicInfoContent = (
    <>
      <div className="flex items-center mb-6">
        <Avatar 
          size={80}
          style={{ backgroundColor: memberData?.avatarColor || '#3b82f6' }}
          className="mr-4"
        >
          {memberData?.name?.split(' ').map((n: string) => n[0]).join('')}
        </Avatar>
        <div>
          <h3 className="text-lg font-semibold">{memberData?.name || 'Team Member'}</h3>
          <p className="text-gray-500">Member ID: {id}</p>
        </div>
      </div>

      <Form.Item
        label="Full Name"
        name="name"
        rules={[{ required: true, message: 'Please enter full name' }]}
      >
        <Input 
          placeholder="Sarah Johnson" 
          size="large"
          className="rounded-lg"
          prefix={<UserOutlined className="text-gray-400" />}
        />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: 'Please enter email' },
          { type: 'email', message: 'Please enter a valid email' }
        ]}
      >
        <Input 
          placeholder="sarah.johnson@company.com" 
          size="large"
          className="rounded-lg"
          prefix={<MailOutlined className="text-gray-400" />}
        />
      </Form.Item>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Form.Item
          label="Job Title"
          name="jobTitle"
          rules={[{ required: true, message: 'Please select job title' }]}
        >
          <Select 
            placeholder="Lead Developer & Mentor" 
            size="large"
            className="rounded-lg"
            showSearch
          >
            {jobTitles.map(title => (
              <Option key={title} value={title}>{title}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Department"
          name="department"
          rules={[{ required: true, message: 'Please select department' }]}
        >
          <Select 
            placeholder="Full Stack Development" 
            size="large"
            className="rounded-lg"
            showSearch
          >
            {departments.map(dept => (
              <Option key={dept} value={dept}>{dept}</Option>
            ))}
          </Select>
        </Form.Item>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Form.Item
          label="Avatar Color"
          name="avatarColor"
          rules={[{ required: true, message: 'Please select avatar color' }]}
        >
          <Select 
            placeholder="Select color" 
            size="large"
            className="rounded-lg"
          >
            {avatarColors.map(color => (
              <Option key={color} value={color}>
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: color }}
                  ></div>
                  <span>{color}</span>
                </div>
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: 'Please select status' }]}
        >
          <Select 
            placeholder="Select status" 
            size="large"
            className="rounded-lg"
          >
            {statusOptions.map(status => (
              <Option key={status.value} value={status.value}>
                <Tag color={status.color}>{status.label}</Tag>
              </Option>
            ))}
          </Select>
        </Form.Item>
      </div>
    </>
  );

  // Workload & Projects Section
  const workloadProjectsContent = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Form.Item
          label="Workload (%)"
          name="workload"
          rules={[
            { required: true, message: 'Please enter workload' },
            { type: 'number', min: 0, max: 100, message: 'Workload must be between 0 and 100' }
          ]}
        >
          <InputNumber
            min={0}
            max={100}
            placeholder="85"
            size="large"
            className="w-full rounded-lg"
            addonAfter="%"
          />
        </Form.Item>

        <Form.Item
          label="Hours Allocated"
          name="hoursAllocated"
          rules={[
            { required: true, message: 'Please enter allocated hours' },
            { type: 'number', min: 0, max: 168, message: 'Hours must be between 0 and 168' }
          ]}
        >
          <InputNumber
            min={0}
            max={168}
            placeholder="40"
            size="large"
            className="w-full rounded-lg"
            addonAfter="hours"
          />
        </Form.Item>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Form.Item
          label="Active Projects"
          name="activeProjects"
          rules={[
            { type: 'number', min: 0, message: 'Must be 0 or more' }
          ]}
        >
          <InputNumber
            min={0}
            placeholder="1"
            size="large"
            className="w-full rounded-lg"
          />
        </Form.Item>

        <Form.Item
          label="Active POCs"
          name="activePOCs"
          rules={[
            { type: 'number', min: 0, message: 'Must be 0 or more' }
          ]}
        >
          <InputNumber
            min={0}
            placeholder="1"
            size="large"
            className="w-full rounded-lg"
          />
        </Form.Item>

        <Form.Item
          label="Certifications"
          name="certifications"
          rules={[
            { type: 'number', min: 0, message: 'Must be 0 or more' }
          ]}
        >
          <InputNumber
            min={0}
            placeholder="2"
            size="large"
            className="w-full rounded-lg"
          />
        </Form.Item>
      </div>

      <Form.Item
        label="Project Assignments"
        name="projectIds"
        help="Select projects this team member is assigned to"
      >
        <Select
          mode="multiple"
          placeholder="Select projects"
          size="large"
          className="rounded-lg"
          showSearch
          optionFilterProp="children"
        >
          {projects.map(project => (
            <Option key={project.id} value={project.id}>
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: project.color }}
                ></div>
                <span>{project.title} - {project.client}</span>
              </div>
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Intern Assignments"
        name="internIds"
        help="Select interns this team member is mentoring"
      >
        <Select
          mode="multiple"
          placeholder="Select interns"
          size="large"
          className="rounded-lg"
          showSearch
          optionFilterProp="children"
        >
          {availableInterns.map(intern => (
            <Option key={intern.id} value={intern.id}>
              <div className="flex items-center">
                <Avatar 
                  size="small" 
                  className="mr-2"
                  style={{ backgroundColor: '#8b5cf6' }}
                >
                  {intern.name?.split(' ').map((n: string) => n[0]).join('')}
                </Avatar>
                <span>{intern.name} - {intern.studyTrack}</span>
              </div>
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Has Interns?"
        name="hasInterns"
        valuePropName="checked"
      >
        <Select 
          placeholder="Select option" 
          size="large"
          className="rounded-lg"
        >
          <Option value={true}>Yes, managing interns</Option>
          <Option value={false}>No interns assigned</Option>
        </Select>
      </Form.Item>
    </>
  );

  // Define the form sections
  const sections = [
    {
      key: "basic-info",
      title: "Basic Information",
      subtitle: "Update personal and professional details",
      color: "#3b82f6",
      content: basicInfoContent
    },
    {
      key: "workload-projects",
      title: "Workload & Assignments",
      subtitle: "Update workload, projects, and intern assignments",
      color: "#10b981",
      content: workloadProjectsContent
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading team member data...</div>
      </div>
    );
  }

  return (
    <FormTemplate
      backPath={`/team-member/${id}`}
      title="Update Team Member"
      subtitle="Edit team member details, assignments, and workload"
      submitText="Update Team Member"
      cancelText="Cancel"
      onFinish={handleSubmit}
      form={form}
      sections={sections}
      submitDisabled={!isFormValid}
    />
  );
}
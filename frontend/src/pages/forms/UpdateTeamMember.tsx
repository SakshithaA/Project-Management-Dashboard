import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Input, Select, InputNumber, Avatar, Tag, message, AutoComplete, Button } from "antd";
import { UserOutlined, MailOutlined, EnvironmentOutlined, TeamOutlined, DatabaseOutlined } from "@ant-design/icons";
import FormTemplate from "../../components/FormTemplate";
import { api } from "../../lib/api";

const { Option } = Select;

export default function UpdateTeamMember() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [memberData, setMemberData] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [interns, setInterns] = useState<any[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [selectedInterns, setSelectedInterns] = useState<string[]>([]);

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

  const userRoles = [
    { value: "manager", label: "Manager" },
    { value: "team-lead", label: "Team Lead" },
    { value: "developer", label: "Developer" },
    { value: "intern", label: "Intern" }
  ];

  const avatarColors = [
    { value: "#2563eb", label: "Blue" },
    { value: "#059669", label: "Green" },
    { value: "#7c3aed", label: "Purple" },
    { value: "#ea580c", label: "Orange" },
    { value: "#dc2626", label: "Red" },
    { value: "#0891b2", label: "Cyan" },
    { value: "#db2777", label: "Pink" },
    { value: "#84cc16", label: "Lime" }
  ];

  const commonSkills = [
    "React", "Node.js", "TypeScript", "Python", "Java", "SQL", "Git",
    "Docker", "AWS", "Azure", "GCP", "Kubernetes", "MongoDB", "PostgreSQL",
    "GraphQL", "Vue.js", "Angular", "Flutter", "React Native", "Machine Learning"
  ];

  useEffect(() => {
    if (id) {
      fetchMemberData();
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
      const [projectsData, teamMembersData] = await Promise.all([
        api.getProjects(),
        api.getTeamMembers({ userRole: 'intern' })
      ]);
      setProjects(projectsData.data);
      setInterns(teamMembersData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Failed to load data');
    }
  };

  const fetchMemberData = async () => {
    try {
      setLoading(true);
      const data = await api.getTeamMember(id!);
      
      if (data) {
        setMemberData(data);
        setSkills(data.skills || []);
        setSelectedProjects(data.projects?.map((p: any) => p.projectId) || []);
        
        // Fetch intern assignments for LC
        if (data.isLC) {
          const internAssignments = await api.getInternAssignments(id!);
          setSelectedInterns(internAssignments.data.map((ia: any) => ia.internId));
        }

        form.setFieldsValue({
          name: data.name,
          email: data.email || '',
          userRole: data.userRole,
          isLC: data.isLC,
          workloadPercentage: data.workloadPercentage || 0,
          joinDate: data.joinDate ? data.joinDate : undefined,
          avatarColor: "#2563eb", // Default color
          projectIds: data.projects?.map((p: any) => p.projectId) || [],
          internIds: data.isLC ? selectedInterns : []
        });
      }
    } catch (error) {
      console.error('Error fetching member data:', error);
      message.error('Failed to load team member data');
    } finally {
      setLoading(false);
    }
  };

  const handleSkillAdd = (skill: string) => {
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
  };

  const handleSkillRemove = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleSubmit = async (values: any) => {
    if (!isFormValid || !id) return;

    try {
      setSaving(true);
      
      const updateData = {
        name: values.name,
        email: values.email,
        userRole: values.userRole,
        isLC: values.isLC,
        workloadPercentage: values.workloadPercentage,
        joinDate: values.joinDate,
        skills: skills
      };

      await api.updateTeamMember(id, updateData);
      
      // Update LC assignments if member is LC
      if (values.isLC && selectedInterns.length > 0) {
        await api.updateInternAssignments(id, { internIds: selectedInterns });
      }
      
      message.success('Team member updated successfully!');
      setTimeout(() => {
        navigate(`/team-member/${id}`);
      }, 1500);
      
    } catch (error) {
      console.error('Error updating team member:', error);
      message.error('Failed to update team member');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/team-member/${id}`);
  };

  const basicInfoContent = (
    <>
      <div className="flex items-center mb-6">
        <Avatar 
          size={80}
          style={{ backgroundColor: form.getFieldValue('avatarColor') || '#2563eb' }}
          className="mr-4 shadow-sm"
        >
          {memberData?.name?.split(' ').map((n: string) => n[0]).join('')}
        </Avatar>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{memberData?.name || 'Team Member'}</h3>
          <p className="text-gray-600 text-sm font-medium">Member ID: {id}</p>
        </div>
      </div>

      <Form.Item
        label={<span className="font-semibold">Full Name</span>}
        name="name"
        rules={[{ required: true, message: 'Please enter full name' }]}
      >
        <Input 
          placeholder="Sarah Johnson" 
          size="large"
          className="rounded-lg border-gray-300"
          prefix={<UserOutlined className="text-gray-400" />}
        />
      </Form.Item>

      <Form.Item
        label={<span className="font-semibold">Email</span>}
        name="email"
        rules={[
          { required: true, message: 'Please enter email' },
          { type: 'email', message: 'Please enter a valid email' }
        ]}
      >
        <Input 
          placeholder="sarah.johnson@company.com" 
          size="large"
          className="rounded-lg border-gray-300"
          prefix={<MailOutlined className="text-gray-400" />}
        />
      </Form.Item>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Form.Item
          label={<span className="font-semibold">User Role</span>}
          name="userRole"
          rules={[{ required: true, message: 'Please select user role' }]}
        >
          <Select 
            placeholder="Select role" 
            size="large"
            className="rounded-lg border-gray-300"
          >
            {userRoles.map(role => (
              <Option key={role.value} value={role.value}>{role.label}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label={<span className="font-semibold">Avatar Color</span>}
          name="avatarColor"
        >
          <Select 
            placeholder="Select color" 
            size="large"
            className="rounded-lg border-gray-300"
          >
            {avatarColors.map(color => (
              <Option key={color.value} value={color.value}>
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-2 border border-gray-300"
                    style={{ backgroundColor: color.value }}
                  ></div>
                  <span className="font-medium">{color.label}</span>
                </div>
              </Option>
            ))}
          </Select>
        </Form.Item>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Form.Item
          label={<span className="font-semibold">Is Learning Catalyst?</span>}
          name="isLC"
          valuePropName="checked"
        >
          <Select 
            placeholder="Select option" 
            size="large"
            className="rounded-lg border-gray-300"
          >
            <Option value={true}>Yes</Option>
            <Option value={false}>No</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label={<span className="font-semibold">Join Date</span>}
          name="joinDate"
        >
          <Input 
            type="date"
            size="large"
            className="rounded-lg border-gray-300"
          />
        </Form.Item>
      </div>
    </>
  );

  const skillsWorkloadContent = (
    <>
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Technical Skills
        </label>
        <AutoComplete
          options={commonSkills.map(skill => ({ value: skill }))}
          onSelect={handleSkillAdd}
          onSearch={(value) => {
            if (value && !commonSkills.includes(value)) {
              // Add custom skill to suggestions
            }
          }}
          placeholder="Type and press Enter to add skill"
          className="w-full"
        >
          <Input
            size="large"
            className="rounded-lg border-gray-300"
            onPressEnter={(e: any) => {
              handleSkillAdd(e.target.value);
              e.target.value = "";
            }}
          />
        </AutoComplete>
        
        <div className="mt-3 flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <Tag
              key={index}
              color="blue"
              closable
              onClose={() => handleSkillRemove(skill)}
              className="px-3 py-1 text-sm font-medium"
            >
              {skill}
            </Tag>
          ))}
          {skills.length === 0 && (
            <div className="text-gray-400 text-sm italic">
              No skills added yet
            </div>
          )}
        </div>
      </div>

      <Form.Item
        label={<span className="font-semibold">Workload (%)</span>}
        name="workloadPercentage"
        rules={[
          { required: true, message: 'Please enter workload percentage' },
          { type: 'number', min: 0, max: 100, message: 'Workload must be between 0 and 100' }
        ]}
      >
        <InputNumber
          min={0}
          max={100}
          placeholder="85"
          size="large"
          className="w-full rounded-lg border-gray-300"
          addonAfter="%"
        />
      </Form.Item>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Form.Item
          label={<span className="font-semibold">Active Projects</span>}
          name="activeProjects"
        >
          <InputNumber
            min={0}
            placeholder="3"
            size="large"
            className="w-full rounded-lg border-gray-300"
          />
        </Form.Item>

        <Form.Item
          label={<span className="font-semibold">Active POCs</span>}
          name="activePOCs"
        >
          <InputNumber
            min={0}
            placeholder="2"
            size="large"
            className="w-full rounded-lg border-gray-300"
          />
        </Form.Item>

        <Form.Item
          label={<span className="font-semibold">Certifications</span>}
          name="certifications"
        >
          <InputNumber
            min={0}
            placeholder="5"
            size="large"
            className="w-full rounded-lg border-gray-300"
          />
        </Form.Item>
      </div>
    </>
  );

  const assignmentsContent = (
    <>
      <Form.Item
        label={<span className="font-semibold">Project Assignments</span>}
        name="projectIds"
      >
        <Select
          mode="multiple"
          placeholder="Select projects"
          size="large"
          className="rounded-lg border-gray-300"
          value={selectedProjects}
          onChange={setSelectedProjects}
          showSearch
          optionFilterProp="children"
        >
          {projects.map(project => (
            <Option key={project.id} value={project.id}>
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: '#2563eb' }}
                ></div>
                <span className="font-medium">{project.name}</span>
                <span className="ml-2 text-xs text-gray-500">({project.client})</span>
              </div>
            </Option>
          ))}
        </Select>
      </Form.Item>

      {form.getFieldValue('isLC') && (
        <Form.Item
          label={<span className="font-semibold">Intern Assignments</span>}
          name="internIds"
        >
          <Select
            mode="multiple"
            placeholder="Select interns"
            size="large"
            className="rounded-lg border-gray-300"
            value={selectedInterns}
            onChange={setSelectedInterns}
            showSearch
            optionFilterProp="children"
          >
            {interns.map(intern => (
              <Option key={intern.id} value={intern.id}>
                <div className="flex items-center">
                  <Avatar 
                    size="small" 
                    className="mr-2"
                    style={{ backgroundColor: '#7c3aed' }}
                  >
                    {intern.name?.split(' ').map((n: string) => n[0]).join('')}
                  </Avatar>
                  <span className="font-medium">{intern.name}</span>
                  <span className="ml-2 text-xs text-gray-500">({intern.email})</span>
                </div>
              </Option>
            ))}
          </Select>
        </Form.Item>
      )}
    </>
  );

  const sections = [
    {
      key: "basic-info",
      title: "Basic Information",
      subtitle: "Update personal and professional details",
      color: "#2563eb",
      content: basicInfoContent
    },
    {
      key: "skills-workload",
      title: "Skills & Workload",
      subtitle: "Update technical skills and workload capacity",
      color: "#059669",
      content: skillsWorkloadContent
    },
    {
      key: "assignments",
      title: "Assignments",
      subtitle: "Update project and intern assignments",
      color: "#7c3aed",
      content: assignmentsContent
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading team member data...</p>
        </div>
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
      onCancel={handleCancel}
      form={form}
      sections={sections}
      submitDisabled={!isFormValid || saving}
      loading={saving}
      width="65%"
    />
  );
}
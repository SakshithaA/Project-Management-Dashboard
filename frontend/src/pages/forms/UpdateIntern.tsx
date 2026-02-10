import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Input, Select, InputNumber, Avatar, DatePicker, Tag, message, AutoComplete, Button } from "antd";
import { UserOutlined, BookOutlined, TeamOutlined, CalendarOutlined, TrophyOutlined } from "@ant-design/icons";
import FormTemplate from "../../components/FormTemplate";
import { api } from "../../lib/api";
import dayjs from "dayjs";

const { Option } = Select;
const { TextArea } = Input;

export default function UpdateIntern() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [internData, setInternData] = useState<any>(null);
  const [mentors, setMentors] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [certifications, setCertifications] = useState<string[]>([]);

  const studyTracks = [
    "Computer Science",
    "Software Engineering",
    "Data Science",
    "Information Technology",
    "Computer Engineering",
    "Web Development",
    "Mobile Development",
    "Cloud Computing",
    "Full Stack Development"
  ];

  const universities = [
    "Tech University",
    "University of Technology",
    "State University",
    "Engineering College",
    "Institute of Science",
    "Polytechnic University",
    "Technical Institute"
  ];

  const durationOptions = [
    "3 months internship",
    "6 months internship",
    "1 year internship",
    "Summer internship",
    "Winter internship"
  ];

  const commonSkills = [
    "React", "Node.js", "MongoDB", "Express", "JavaScript",
    "TypeScript", "Python", "Java", "SQL", "Git", "Docker",
    "AWS", "Azure", "HTML/CSS", "Vue.js", "Angular", "React Native"
  ];

  const commonCertifications = [
    "MERN Stack Certification",
    "AWS Fundamentals",
    "React Developer",
    "Node.js Certification",
    "MongoDB Developer",
    "JavaScript Essentials",
    "Python for Data Science",
    "Cloud Practitioner",
    "Google Cloud Fundamentals",
    "Microsoft Azure Fundamentals"
  ];

  useEffect(() => {
    if (id) {
      fetchInternData();
      fetchMentorsAndProjects();
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

  const fetchInternData = async () => {
    try {
      setLoading(true);
      console.log('Fetching intern with ID:', id);
      
      // Since interns are team members with userRole = 'intern'
      const memberData = await api.getTeamMember(id!);
      
      if (memberData && memberData.userRole === 'intern') {
        setInternData(memberData);
        
        form.setFieldsValue({
          name: memberData.name,
          email: memberData.email || '',
          progress: 45, // Default value for demonstration
          skills: memberData.skills || [],
          certifications: [] // Would come from separate API
        });
        
        setSkills(memberData.skills || []);
      }
    } catch (error) {
      console.error('Error fetching intern data:', error);
      message.error('Failed to load intern data');
    } finally {
      setLoading(false);
    }
  };

  const fetchMentorsAndProjects = async () => {
    try {
      const [mentorsData, projectsData] = await Promise.all([
        api.getTeamMembers({ userRole: 'team-lead' }),
        api.getProjects()
      ]);
      setMentors(mentorsData.data);
      setProjects(projectsData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Failed to load data');
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

  const handleCertificationAdd = (cert: string) => {
    if (cert && !certifications.includes(cert)) {
      setCertifications([...certifications, cert]);
    }
  };

  const handleCertificationRemove = (cert: string) => {
    setCertifications(certifications.filter(c => c !== cert));
  };

  const handleSubmit = async (values: any) => {
    if (!isFormValid || !id) return;

    try {
      setSaving(true);
      
      const updateData = {
        name: values.name,
        email: values.email,
        skills: skills,
        userRole: 'intern',
        workloadPercentage: values.progress || 0,
        // Note: We need to handle LC assignments separately
      };

      await api.updateTeamMember(id, updateData);
      
      message.success('Intern updated successfully!');
      setTimeout(() => {
        navigate(`/intern/${id}`);
      }, 1500);
      
    } catch (error) {
      console.error('Error updating intern:', error);
      message.error('Failed to update intern');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/intern/${id}`);
  };

  const basicInfoContent = (
    <>
      <div className="flex items-center mb-6">
        <Avatar 
          size={70}
          style={{ backgroundColor: '#7c3aed' }}
          className="mr-4 shadow-sm"
        >
          {internData?.name?.split(' ').map((n: string) => n[0]).join('')}
        </Avatar>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-gray-900">{internData?.name || 'Intern'}</h3>
          <p className="text-gray-600 text-sm font-medium">Intern ID: {id}</p>
        </div>
      </div>

      <Form.Item
        label={<span className="font-semibold">Full Name</span>}
        name="name"
        rules={[{ required: true, message: 'Please enter full name' }]}
      >
        <Input 
          placeholder="Alex Johnson" 
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
          placeholder="alex.johnson@company.com" 
          size="large"
          className="rounded-lg border-gray-300"
          prefix={<UserOutlined className="text-gray-400" />}
        />
      </Form.Item>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Form.Item
          label={<span className="font-semibold">University</span>}
          name="university"
          initialValue="Tech University"
        >
          <Select 
            placeholder="Select university" 
            size="large"
            className="rounded-lg border-gray-300"
            showSearch
          >
            {universities.map(university => (
              <Option key={university} value={university}>{university}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label={<span className="font-semibold">Study Track</span>}
          name="studyTrack"
          initialValue="Computer Science"
        >
          <Select 
            placeholder="Select study track" 
            size="large"
            className="rounded-lg border-gray-300"
            showSearch
          >
            {studyTracks.map(track => (
              <Option key={track} value={track}>{track}</Option>
            ))}
          </Select>
        </Form.Item>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Form.Item
          label={<span className="font-semibold">Duration</span>}
          name="duration"
          initialValue="6 months internship"
        >
          <Select 
            placeholder="Select duration" 
            size="large"
            className="rounded-lg border-gray-300"
          >
            {durationOptions.map(duration => (
              <Option key={duration} value={duration}>{duration}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label={<span className="font-semibold">Next Review Date</span>}
          name="nextReview"
        >
          <DatePicker 
            placeholder="Select review date" 
            format="YYYY-MM-DD"
            size="large"
            className="w-full rounded-lg border-gray-300"
          />
        </Form.Item>
      </div>
    </>
  );

  const assignmentContent = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Form.Item
          label={<span className="font-semibold">Mentor</span>}
          name="mentorId"
        >
          <Select 
            placeholder="Select mentor" 
            size="large"
            className="rounded-lg border-gray-300"
            showSearch
            optionFilterProp="children"
          >
            {mentors.map(mentor => (
              <Option key={mentor.id} value={mentor.id}>
                <div className="flex items-center">
                  <Avatar 
                    size="small" 
                    className="mr-2"
                    style={{ backgroundColor: '#2563eb' }}
                  >
                    {mentor.name?.split(' ').map((n: string) => n[0]).join('')}
                  </Avatar>
                  <span className="font-medium">{mentor.name}</span>
                </div>
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label={<span className="font-semibold">Project</span>}
          name="projectId"
        >
          <Select 
            placeholder="Select project" 
            size="large"
            className="rounded-lg border-gray-300"
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
                </div>
              </Option>
            ))}
          </Select>
        </Form.Item>
      </div>

      <Form.Item
        label={<span className="font-semibold">Progress (%)</span>}
        name="progress"
        rules={[
          { required: true, message: 'Please enter progress' },
          { type: 'number', min: 0, max: 100, message: 'Progress must be between 0 and 100' }
        ]}
      >
        <InputNumber
          min={0}
          max={100}
          placeholder="80"
          size="large"
          className="w-full rounded-lg border-gray-300"
          addonAfter="%"
        />
      </Form.Item>
    </>
  );

  const skillsCertificationsContent = (
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

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Certifications
        </label>
        <AutoComplete
          options={commonCertifications.map(cert => ({ value: cert }))}
          onSelect={handleCertificationAdd}
          onSearch={(value) => {
            if (value && !commonCertifications.includes(value)) {
              // Add custom certification to suggestions
            }
          }}
          placeholder="Type and press Enter to add certification"
          className="w-full"
        >
          <Input
            size="large"
            className="rounded-lg border-gray-300"
            onPressEnter={(e: any) => {
              handleCertificationAdd(e.target.value);
              e.target.value = "";
            }}
          />
        </AutoComplete>
        
        <div className="mt-3 flex flex-wrap gap-2">
          {certifications.map((cert, index) => (
            <Tag
              key={index}
              color="green"
              closable
              onClose={() => handleCertificationRemove(cert)}
              className="px-3 py-1 text-sm font-medium"
            >
              {cert}
            </Tag>
          ))}
          {certifications.length === 0 && (
            <div className="text-gray-400 text-sm italic">
              No certifications added yet
            </div>
          )}
        </div>
      </div>

      <Form.Item
        label={<span className="font-semibold">Recent Activity Notes</span>}
        name="recentActivity"
      >
        <TextArea 
          placeholder="e.g., Completed payment module API integration on 2024-03-25"
          rows={3}
          className="rounded-lg border-gray-300"
        />
      </Form.Item>

      <Form.Item
        label={<span className="font-semibold">Additional Notes</span>}
        name="notes"
      >
        <TextArea 
          placeholder="Additional information about the intern..."
          rows={2}
          className="rounded-lg border-gray-300"
        />
      </Form.Item>
    </>
  );

  const sections = [
    {
      key: "basic-info",
      title: "Basic Information",
      subtitle: "Update intern's personal and academic details",
      color: "#7c3aed",
      content: basicInfoContent
    },
    {
      key: "assignment",
      title: "Assignment & Progress",
      subtitle: "Update mentor, project, and progress tracking",
      color: "#059669",
      content: assignmentContent
    },
    {
      key: "skills-certifications",
      title: "Skills & Certifications",
      subtitle: "Update technical skills and certifications",
      color: "#ea580c",
      content: skillsCertificationsContent
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading intern data...</p>
        </div>
      </div>
    );
  }

  return (
    <FormTemplate
      backPath={`/intern/${id}`}
      title="Update Intern"
      subtitle="Edit intern details, assignments, skills, and progress"
      submitText="Update Intern"
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
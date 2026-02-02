import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Input, Select, InputNumber, Avatar, DatePicker, Tag, message } from "antd";
import { UserOutlined, BookOutlined, TeamOutlined, CalendarOutlined } from "@ant-design/icons";
import FormTemplate from "../../components/FormTemplate";
import { api } from "../../services/api";

const { Option } = Select;
const { TextArea } = Input;

export default function UpdateIntern() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [isFormValid, setIsFormValid] = useState(false);
  const [internData, setInternData] = useState<any>(null);
  const [mentors, setMentors] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  // Study tracks
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

  // Universities
  const universities = [
    "Tech University",
    "University of Technology",
    "State University",
    "Engineering College",
    "Institute of Science",
    "Polytechnic University",
    "Technical Institute"
  ];

  // Duration options
  const durationOptions = [
    "3 months internship",
    "6 months internship",
    "1 year internship",
    "Summer internship",
    "Winter internship"
  ];

  // Technical Skills (for suggestions)
  const commonSkills = [
    "React", "Node.js", "MongoDB", "Express", "JavaScript",
    "TypeScript", "Python", "Java", "SQL", "Git", "Docker",
    "AWS", "Azure", "HTML/CSS", "Vue.js", "Angular", "React Native"
  ];

  // Common Certifications
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
      fetchInternData(parseInt(id));
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

  const fetchInternData = async (internId: number) => {
    try {
      setLoading(true);
      const data = await api.getIntern(internId);
      if (data) {
        setInternData(data);
        form.setFieldsValue({
          name: data.name,
          studyTrack: data.studyTrack,
          university: data.university,
          duration: data.duration,
          progress: data.progress,
          skills: data.skills || [],
          certifications: data.certifications || [],
          nextReview: data.nextReview || '2024-04-20',
          mentorId: data.mentorId,
          projectId: data.projectId
        });
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
        api.getAllTeamMembers(),
        api.getProjects()
      ]);
      setProjects(projectsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Failed to load data');
    }
  };

  const handleSubmit = async (values: any) => {
    if (!isFormValid || !id) return;

    try {
      console.log('Updating intern:', values);
      
      // Here you would update the JSON data
      message.success('Intern updated successfully!');
      
      await new Promise(resolve => setTimeout(resolve, 500));
      navigate(`/intern/${id}`);
    } catch (error) {
      console.error('Error updating intern:', error);
      message.error('Failed to update intern');
    }
  };

  // Basic Information Section
  const basicInfoContent = (
    <>
      <div className="flex items-center mb-6">
        <Avatar 
          size={70}
          style={{ backgroundColor: '#8b5cf6' }}
          className="mr-4"
        >
          {internData?.name?.split(' ').map((n: string) => n[0]).join('')}
        </Avatar>
        <div className="ml-4">
          <h3 className="text-lg font-semibold">{internData?.name || 'Intern'}</h3>
          <p className="text-gray-500">Intern ID: {id}</p>
        </div>
      </div>

      <Form.Item
        label="Full Name"
        name="name"
        rules={[{ required: true, message: 'Please enter full name' }]}
      >
        <Input 
          placeholder="Alex Johnson" 
          size="large"
          className="rounded-lg"
          prefix={<UserOutlined className="text-gray-400" />}
        />
      </Form.Item>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-0">
        <Form.Item
          label="University"
          name="university"
          rules={[{ required: true, message: 'Please select university' }]}
        >
          <Select 
            placeholder="Tech University" 
            size="large"
            className="rounded-lg"
            showSearch
            allowClear
          >
            {universities.map(university => (
              <Option key={university} value={university}>{university}</Option>
            ))}
            <Option value="other">Other (type below)</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Study Track"
          name="studyTrack"
          rules={[{ required: true, message: 'Please select study track' }]}
        >
          <Select 
            placeholder="Computer Science" 
            size="large"
            className="rounded-lg"
            showSearch
            allowClear
          >
            {studyTracks.map(track => (
              <Option key={track} value={track}>{track}</Option>
            ))}
            <Option value="other">Other (type below)</Option>
          </Select>
        </Form.Item>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
        <Form.Item
          label="Duration"
          name="duration"
          rules={[{ required: true, message: 'Please select duration' }]}
        >
          <Select 
            placeholder="6 months internship" 
            size="large"
            className="rounded-lg"
            showSearch
          >
            {durationOptions.map(duration => (
              <Option key={duration} value={duration}>{duration}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Next Review Date"
          name="nextReview"
          rules={[{ required: true, message: 'Please select next review date' }]}
        >
          <DatePicker 
            placeholder="Select review date" 
            format="YYYY-MM-DD"
            size="large"
            className="w-full rounded-lg"
          />
        </Form.Item>
      </div>
    </>
  );

  // Assignment Section
  const assignmentContent = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Form.Item
          label="Mentor"
          name="mentorId"
          rules={[{ required: true, message: 'Please select a mentor' }]}
        >
          <Select 
            placeholder="Select mentor" 
            size="large"
            className="rounded-lg"
            showSearch
            optionFilterProp="children"
            allowClear
          >
            {mentors.map(mentor => (
              <Option key={mentor.id} value={mentor.id}>
                <div className="flex items-center">
                  <Avatar 
                    size="small" 
                    className="mr-2"
                    style={{ backgroundColor: mentor.avatarColor || '#3b82f6' }}
                  >
                    {mentor.name?.split(' ').map((n: string) => n[0]).join('')}
                  </Avatar>
                  <span>{mentor.name} - {mentor.jobTitle || mentor.role}</span>
                </div>
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Project"
          name="projectId"
          rules={[{ required: true, message: 'Please select a project' }]}
        >
          <Select 
            placeholder="Select project" 
            size="large"
            className="rounded-lg"
            showSearch
            optionFilterProp="children"
            allowClear
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
      </div>

      <Form.Item
        label="Progress (%)"
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
          className="w-full rounded-lg"
          addonAfter="%"
        />
      </Form.Item>
    </>
  );

  // Skills & Certifications Section
  const skillsCertificationsContent = (
    <>
      <Form.Item
        label="Technical Skills"
        name="skills"
        help="Select skills or type new ones (press Enter to add)"
      >
        <Select
          mode="tags"
          size="large"
          placeholder="Select or type skills"
          className="rounded-lg"
          tokenSeparators={[',']}
          showSearch
        >
          {commonSkills.map(skill => (
            <Option key={skill} value={skill}>
              <Tag color="blue">{skill}</Tag>
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Certifications"
        name="certifications"
        help="Select certifications or type new ones"
      >
        <Select
          mode="tags"
          size="large"
          placeholder="Select or type certifications"
          className="rounded-lg"
          tokenSeparators={[',']}
          showSearch
        >
          {commonCertifications.map(cert => (
            <Option key={cert} value={cert}>
              <Tag color="green">{cert}</Tag>
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Recent Activity Notes"
        name="recentActivity"
        help="Add recent activity notes for timeline (optional)"
      >
        <TextArea 
          placeholder="e.g., Completed payment module API integration on 2024-03-25"
          rows={3}
          className="rounded-lg"
        />
      </Form.Item>

      <Form.Item
        label="Additional Notes"
        name="notes"
        help="Any additional notes or comments (optional)"
      >
        <TextArea 
          placeholder="Additional information about the intern..."
          rows={2}
          className="rounded-lg"
        />
      </Form.Item>
    </>
  );

  // Define the form sections
  const sections = [
    {
      key: "basic-info",
      title: "Basic Information",
      subtitle: "Update intern's personal and academic details",
      color: "#8b5cf6",
      content: basicInfoContent
    },
    {
      key: "assignment",
      title: "Assignment & Progress",
      subtitle: "Update mentor, project, and progress tracking",
      color: "#10b981",
      content: assignmentContent
    },
    {
      key: "skills-certifications",
      title: "Skills & Certifications",
      subtitle: "Update technical skills and certifications",
      color: "#f59e0b",
      content: skillsCertificationsContent
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading intern data...</div>
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
      form={form}
      sections={sections}
      submitDisabled={!isFormValid}
    />
  );
}
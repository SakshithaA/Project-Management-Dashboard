import { useState, useEffect } from "react";
import { Card, Progress, Tag, Avatar, Button, Row, Col, Timeline, Divider } from "antd";
import { 
  ArrowLeftOutlined,
  UserOutlined,
  BookOutlined,
  TrophyOutlined,
  CalendarOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/api";
import type{ Intern, TeamMember, Project } from "../../services/api";

export default function InternDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [intern, setIntern] = useState<Intern | null>(null);
  const [mentor, setMentor] = useState<TeamMember | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchInternData(parseInt(id));
    }
  }, [id]);

  const fetchInternData = async (internId: number) => {
    try {
      setLoading(true);
      const internData = await api.getIntern(internId);
      if (internData) {
        setIntern(internData);
        
        // Fetch mentor and project data
        const [mentorData, projectData] = await Promise.all([
          api.getTeamMember(internData.mentorId),
          api.getProject(internData.projectId)
        ]);
        
        setMentor(mentorData);
        setProject(projectData);
      }
    } catch (error) {
      console.error('Error fetching intern data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Learning timeline data based on intern duration
  const timelineData = [
    {
      time: 'Jan 2024',
      color: 'green',
      title: 'Orientation & Onboarding',
      description: 'Company culture, tools setup, team introduction'
    },
    {
      time: 'Feb 2024',
      color: 'blue',
      title: 'React Native Fundamentals',
      description: 'Completed React Native basics and first mobile app'
    },
    {
      time: 'Mar 2024',
      color: 'blue',
      title: 'API Integration Project',
      description: 'Successfully integrated 3 external APIs into main project'
    },
    {
      time: 'Apr 2024',
      color: 'purple',
      title: 'Current: Payment Module',
      description: 'Developing secure payment processing module'
    },
    {
      time: 'May 2024',
      color: 'gray',
      title: 'Performance Optimization',
      description: 'Planned: Mobile app performance enhancement'
    },
    {
      time: 'Jun 2024',
      color: 'gray',
      title: 'Final Project & Presentation',
      description: 'Complete full project implementation'
    }
  ];

  // Milestones data
  const milestones = [
    { title: '1st Test', date: '2024-01-25', status: 'completed' },
    { title: '2nd Test', date: '2024-02-10', status: 'completed' },
    { title: 'Certification Completed', date: '2024-02-28', status: 'completed' },
    { title: '4th Month Presentation', date: '2024-06-15', status: 'upcoming' }
  ];

  // Recent activities
  const activities = [
    { action: 'Completed payment module API integration', date: '2024-03-25' },
    { action: 'Passed code review for authentication module', date: '2024-03-22' },
    { action: 'Fixed critical bug in checkout flow', date: '2024-03-20' },
    { action: 'Attended React Native workshop', date: '2024-03-18' },
    { action: 'Completed TypeScript certification', date: '2024-03-15' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="text-center py-12">Loading...</div>
      </div>
    );
  }

  if (!intern) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Intern not found</h2>
          <Button onClick={() => navigate(`/overview`)}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar-like Back Bar */}
      <div className="bg-white border-b border-gray-200 px-7 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Button 
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(`/team-member/${intern.mentorId}`)}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors duration-150"
          >
            Back to Mentor
          </Button>
          <Button 
            type="primary" 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate(`/intern/${intern.id}/edit`)}
          >
            Update Progress
          </Button>
        </div>
      </div>

      {/* Intern Content */}
      <div className="p-6 mx-20">
        <div className="max-w-6xl mx-auto">
          {/* Intern Header */}
          <div className="mb-6">
            <div className="flex items-center mb-4 ">
              <Avatar 
                size={70}
                style={{ backgroundColor: '#8b5cf6' }}
                className="mr-4"
              >
                {intern.name.split(' ').map((n: string) => n[0]).join('')}
              </Avatar>
              <div className="ml-5">
                <h1 className="text-2xl font-bold text-gray-900">{intern.name}</h1>
                <p className="text-gray-500">{intern.studyTrack}</p>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center text-sm text-gray-600">
                    <BookOutlined className="mr-1" />
                    {intern.university}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <TeamOutlined className="mr-1" />
                    Mentor: <span className="font-medium ml-1">{mentor?.name || 'Not assigned'}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarOutlined className="mr-1" />
                    {intern.duration}
                  </div>
                </div>
              </div>
            </div>

            {/* Badges and Progress */}
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                <Tag color="purple" className="text-xs" icon={<UserOutlined />}>Intern</Tag>
                {project && (
                  <Tag color="blue" className="text-xs">
                    Assigned to: {project.title}
                  </Tag>
                )}
              </div>
              
              {/* Progress Circle */}
              <div className="flex items-center mr-10">
                <Progress 
                  type="circle" 
                  percent={intern.progress} 
                  strokeColor="#8b5cf6" 
                  size={60}
                  format={percent => (
                    <div className="text-center">
                      <div className="text-md font-bold">{percent}%</div>
                      <div className="text-gray-500 text-xs">Progress</div>
                    </div>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Main Content - 2 Column Layout */}
          <div className="grid lg:grid-cols-3 gap-4">
            {/* Left Column - Timeline and Milestones (2/3 width) */}
            <div className="lg:col-span-2 space-y-4">
              {/* Learning Timeline */}
              <Card title="Learning Timeline" className="border border-gray-200" size="small">
                <Timeline
                  items={timelineData.map((item, index) => ({
                    color: item.color,
                    children: (
                      <div className="pl-3">
                        <div className="font-medium text-sm text-gray-900">{item.title}</div>
                        <div className="text-gray-600 text-xs mt-1">{item.description}</div>
                        <div className="text-gray-400 text-xs mt-1">{item.time}</div>
                      </div>
                    )
                  }))}
                />
              </Card>

              {/* Key Milestones */}
              <Card title="Key Milestones" className="border border-gray-200 mt-8" size="small">
                <div className="space-y-2">
                  {milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded transition-colors">
                      <div>
                        <div className="font-medium text-sm text-gray-900">{milestone.title}</div>
                        <div className="text-gray-500 text-xs mt-1">{milestone.date}</div>
                      </div>
                      <Tag 
                        color={milestone.status === 'completed' ? 'green' : 'blue'}
                        className="px-2 py-0.5 text-xs"
                      >
                        {milestone.status}
                      </Tag>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Recent Activities */}
              <Card title="Recent Activities" className="border border-gray-200" size="small">
                <div className="space-y-3">
                  {activities.map((activity, index) => (
                    <div key={index} className="border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                      <div className="font-medium text-gray-900 text-xs">{activity.action}</div>
                      <div className="flex justify-between items-center mt-1">
                        <div className="text-gray-500 text-xs">{activity.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right Column - Upcoming Review (1/3 width) */}
            <div className="space-y-4">
              {/* Upcoming Review - Big Card */}
              <Card className="border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50" size="small">
                <div className="p-4">
                  <div className="text-center mb-4">
                    <CalendarOutlined className="text-3xl text-blue-500 mb-2" />
                    <div className="font-bold text-lg text-gray-900">Performance Review</div>
                    <div className="text-gray-600 text-sm mb-2">Scheduled for</div>
                    
                    {/* Date Display */}
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {intern.nextReview}
                    </div>
                    
                    <div className="text-gray-500 text-sm mb-4">
                      {new Date(intern.nextReview) > new Date() ? "Upcoming" : "Due"}
                    </div>
                  </div>

                  <Divider className="my-3" />

                  {/* Review Details */}
                  <div className="text-left bg-white p-3 rounded border border-blue-100 mb-4">
                    <div className="font-medium text-gray-900 text-sm mb-2">Review Details</div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium">Quarterly Performance Review</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">60 minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Reviewer:</span>
                        <span className="font-medium">{mentor?.name || 'Not assigned'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Project:</span>
                        <span className="font-medium">{project?.title || 'Not assigned'}</span>
                      </div>
                    </div>
                  </div>

                  <Button type="primary" block className="bg-blue-600 hover:bg-blue-700 h-10 text-sm">
                    Prepare Review Notes
                  </Button>
                </div>
              </Card>

              {/* Certifications Earned */}
              <Card title="Certifications Earned" className="border border-gray-200" size="small">
                <div className="space-y-2">
                  {intern.certifications.length > 0 ? (
                    intern.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center p-2 bg-green-50 border border-green-200 rounded">
                        <TrophyOutlined className="text-green-500 mr-2" />
                        <div>
                          <div className="font-medium text-sm">{cert}</div>
                          <div className="text-gray-500 text-xs">Completed</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-2 text-gray-500 text-sm">
                      No certifications yet
                    </div>
                  )}
                </div>
              </Card>

              {/* Technical Skills */}
              <Card title="Technical Skills" className="border border-gray-200" size="small">
                <div className="flex flex-wrap gap-1">
                  {intern.skills.map((skill, index) => (
                    <Tag key={index} color="blue" className="text-xs px-2 py-0.5">
                      {skill}
                    </Tag>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { Card, Progress, Tag, Avatar, Button, Row, Col, Timeline, Divider, Spin, Alert } from "antd";
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
import { api } from "../../lib/api";
import { LoadingSkeleton } from "../../components/LoadingSkeleton";

export default function InternDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [intern, setIntern] = useState<any>(null);
  const [mentor, setMentor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchInternData();
    }
  }, [id]);

  const fetchInternData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Note: You'll need to create this endpoint or fetch from LC assignments
      const assignments = await api.getInternAssignments('lc-id-placeholder');
      const internAssignment = assignments.data.find((a: any) => a.internId === id);
      
      if (internAssignment) {
        setIntern({
          id: internAssignment.internId,
          name: internAssignment.name,
          email: internAssignment.email,
          assignedAt: internAssignment.assignedAt,
          progress: 45, // Mock data - should come from API
          skills: ["React", "TypeScript", "Node.js"], // Mock data
          certifications: ["AWS Fundamentals", "React Developer"], // Mock data
          nextReview: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        });
        
        // Fetch mentor data
        const mentorData = await api.getTeamMember(internAssignment.lcId);
        setMentor(mentorData);
      } else {
        // Fallback: Try to get team member as intern
        try {
          const memberData = await api.getTeamMember(id);
          if (memberData && memberData.userRole === 'intern') {
            setIntern(memberData);
          }
        } catch (memberErr) {
          // Handle as needed
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load intern data');
      console.error('Error fetching intern data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Mock timeline data (should come from API)
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

  // Mock milestones data
  const milestones = [
    { title: '1st Test', date: '2024-01-25', status: 'completed' },
    { title: '2nd Test', date: '2024-02-10', status: 'completed' },
    { title: 'Certification Completed', date: '2024-02-28', status: 'completed' },
    { title: '4th Month Presentation', date: '2024-06-15', status: 'upcoming' }
  ];

  // Mock activities data
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
        <LoadingSkeleton type="card" count={3} />
      </div>
    );
  }

  if (error || !intern) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-6">
          <Alert
            message="Error Loading Intern"
            description={error || "Intern not found"}
            type="error"
            showIcon
            className="mb-4"
          />
          <Button onClick={() => navigate(`/overview`)}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar-like Back Bar */}
      <div className="bg-white border-b border-gray-300 px-7 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Button 
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(mentor ? `/team-member/${mentor.id}` : `/overview`)}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors duration-150"
          >
            {mentor ? `Back to ${mentor.name}` : 'Back to Dashboard'}
          </Button>
          <Button 
            type="primary" 
            className="bg-blue-600 hover:bg-blue-700 border-blue-600"
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
            <div className="flex items-center mb-4">
              <Avatar 
                size={70}
                style={{ backgroundColor: '#7c3aed' }}
                className="mr-4 shadow-sm"
              >
                {intern.name.split(' ').map((n: string) => n[0]).join('')}
              </Avatar>
              <div className="ml-5">
                <h1 className="text-2xl font-bold text-gray-900">{intern.name}</h1>
                <p className="text-gray-700 font-medium">Intern</p>
                <div className="flex items-center gap-4 mt-1">
                  {intern.email && (
                    <div className="flex items-center text-sm text-gray-700">
                      <UserOutlined className="mr-1" />
                      {intern.email}
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-700">
                    <TeamOutlined className="mr-1" />
                    Mentor: <span className="font-medium ml-1">{mentor?.name || 'Not assigned'}</span>
                  </div>
                  {intern.assignedAt && (
                    <div className="flex items-center text-sm text-gray-700">
                      <CalendarOutlined className="mr-1" />
                      Since: {new Date(intern.assignedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Badges and Progress */}
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                <Tag color="purple" className="text-xs font-medium" icon={<UserOutlined />}>Intern</Tag>
                {intern.skills?.slice(0, 3).map((skill: string, index: number) => (
                  <Tag key={index} color="blue" className="text-xs font-medium">
                    {skill}
                  </Tag>
                ))}
              </div>
              
              {/* Progress Circle */}
              <div className="flex items-center mr-10">
                <Progress 
                  type="circle" 
                  percent={intern.progress || 0} 
                  strokeColor="#7c3aed" 
                  size={60}
                  format={percent => (
                    <div className="text-center">
                      <div className="text-md font-bold text-gray-900">{percent}%</div>
                      <div className="text-gray-600 text-xs font-medium">Progress</div>
                    </div>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Main Content - 2 Column Layout */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Timeline and Milestones (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Learning Timeline */}
              <Card title="Learning Timeline" className="border border-gray-300 shadow-sm">
                <Timeline
                  items={timelineData.map((item, index) => ({
                    color: item.color,
                    children: (
                      <div className="pl-3">
                        <div className="font-medium text-sm text-gray-900">{item.title}</div>
                        <div className="text-gray-700 text-xs mt-1">{item.description}</div>
                        <div className="text-gray-500 text-xs mt-1">{item.time}</div>
                      </div>
                    )
                  }))}
                />
              </Card>

              {/* Key Milestones */}
              <Card title="Key Milestones" className="border border-gray-300 shadow-sm">
                <div className="space-y-2">
                  {milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded transition-colors border border-gray-200">
                      <div>
                        <div className="font-medium text-sm text-gray-900">{milestone.title}</div>
                        <div className="text-gray-600 text-xs mt-1">{milestone.date}</div>
                      </div>
                      <Tag 
                        color={milestone.status === 'completed' ? 'green' : 'blue'}
                        className="px-2 py-0.5 text-xs font-medium"
                      >
                        {milestone.status}
                      </Tag>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Recent Activities */}
              <Card title="Recent Activities" className="border border-gray-300 shadow-sm">
                <div className="space-y-3">
                  {activities.map((activity, index) => (
                    <div key={index} className="border-b border-gray-200 pb-2 last:border-0 last:pb-0">
                      <div className="font-medium text-gray-900 text-xs">{activity.action}</div>
                      <div className="flex justify-between items-center mt-1">
                        <div className="text-gray-600 text-xs">{activity.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right Column - Upcoming Review (1/3 width) */}
            <div className="space-y-6">
              {/* Upcoming Review - Big Card */}
              <Card className="border border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-sm">
                <div className="p-4">
                  <div className="text-center mb-4">
                    <CalendarOutlined className="text-3xl text-blue-600 mb-2" />
                    <div className="font-bold text-lg text-gray-900">Performance Review</div>
                    <div className="text-gray-700 text-sm mb-2">Scheduled for</div>
                    
                    {/* Date Display */}
                    <div className="text-2xl font-bold text-blue-700 mb-1">
                      {intern.nextReview ? new Date(intern.nextReview).toLocaleDateString() : 'Not scheduled'}
                    </div>
                    
                    <div className="text-gray-600 text-sm mb-4">
                      {intern.nextReview && new Date(intern.nextReview) > new Date() ? "Upcoming" : "Due"}
                    </div>
                  </div>

                  <Divider className="my-3" />

                  {/* Review Details */}
                  <div className="text-left bg-white p-3 rounded border border-blue-200 mb-4 shadow-sm">
                    <div className="font-medium text-gray-900 text-sm mb-2">Review Details</div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-700 font-medium">Type:</span>
                        <span className="font-semibold">Quarterly Performance Review</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700 font-medium">Duration:</span>
                        <span className="font-semibold">60 minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700 font-medium">Reviewer:</span>
                        <span className="font-semibold">{mentor?.name || 'Not assigned'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Certifications Earned */}
              <Card title="Certifications Earned" className="border border-gray-300 shadow-sm">
                <div className="space-y-2">
                  {intern.certifications && intern.certifications.length > 0 ? (
                    intern.certifications.map((cert: string, index: number) => (
                      <div key={index} className="flex items-center p-2 bg-green-50 border border-green-200 rounded">
                        <TrophyOutlined className="text-green-600 mr-2" />
                        <div>
                          <div className="font-medium text-sm text-gray-900">{cert}</div>
                          <div className="text-gray-600 text-xs">Completed</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-2 text-gray-600 text-sm">
                      No certifications yet
                    </div>
                  )}
                </div>
              </Card>

              {/* Technical Skills */}
              <Card title="Technical Skills" className="border border-gray-300 shadow-sm">
                <div className="flex flex-wrap gap-1">
                  {intern.skills && intern.skills.map((skill: string, index: number) => (
                    <Tag key={index} color="blue" className="text-xs px-2 py-0.5 font-medium">
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
import { useState, useEffect } from "react";
import { 
  TeamOutlined,
  ClockCircleOutlined,
  DashboardOutlined,
  AlertOutlined,
} from "@ant-design/icons";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, LineChart, Line,
  PieChart, Pie, Cell
} from 'recharts';
import { Card, Spin, Alert } from "antd";
import StatsCards from "../components/StatsCards";
import { api } from "../lib/api";
import { LoadingSkeleton } from "../components/LoadingSkeleton";

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [projectStats, setProjectStats] = useState<any>(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [
        summary,
        byType,
        byStatus,
        teamWorkload,
        projectTimeline,
        issueStats
      ] = await Promise.all([
        api.getAnalyticsSummary(),
        api.getProjectsByType(),
        api.getProjectsByStatus(),
        api.getTeamWorkload({ limit: 10 }),
        api.getProjectTimeline(),
        api.getIssueStats()
      ]);

      setAnalyticsData({
        summary,
        byType: byType.data,
        byStatus: byStatus.data,
        teamWorkload: teamWorkload.data,
        projectTimeline: projectTimeline.data,
        issueStats: issueStats.data
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics data');
      console.error('Error fetching analytics data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-10">
        <LoadingSkeleton type="stats" count={1} />
        <div className="mt-8">
          <LoadingSkeleton type="card" count={2} />
        </div>
      </div>
    );
  }

  if (error || !analyticsData) {
    return (
      <div className="min-h-screen bg-gray-50 p-10">
        <Alert
          message="Error Loading Analytics"
          description={error || "No data available"}
          type="error"
          showIcon
          className="mb-4"
        />
      </div>
    );
  }

  const analyticsStats = [
    {
      title: "Total Team Members",
      value: analyticsData.summary.totalTeamMembers,
      icon: <TeamOutlined />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Hours",
      value: `${Math.round(analyticsData.summary.totalHoursAllocated)}h`,
      icon: <ClockCircleOutlined />,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Avg Progress",
      value: `${analyticsData.summary.averageProgress.toFixed(1)}%`,
      icon: <DashboardOutlined />,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Open Issues",
      value: analyticsData.summary.openIssues,
      icon: <AlertOutlined />,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  const projectTypeData = analyticsData.byType.map((item: any) => ({
    name: item.type.replace('-', ' ').toUpperCase(),
    value: item.count,
    color: getTypeColorHex(item.type)
  }));

  const projectStatusData = analyticsData.byStatus.map((item: any) => ({
    name: item.status.replace('-', ' ').toUpperCase(),
    value: item.count,
    color: getStatusColorHex(item.status)
  }));

  const issueStatusData = [
    { name: 'Open', value: analyticsData.issueStats.open, color: '#dc2626' },
    { name: 'In Progress', value: analyticsData.issueStats.inProgress, color: '#ea580c' },
    { name: 'Resolved', value: analyticsData.issueStats.resolved, color: '#059669' },
    { name: 'Closed', value: analyticsData.issueStats.closed, color: '#6b7280' },
  ];

  function getTypeColorHex(type: string) {
    switch(type.toLowerCase()) {
      case 'fullstack': return '#2563eb';
      case 'data-engineering': return '#7c3aed';
      case 'devops': return '#059669';
      case 'cloud': return '#4f46e5';
      case 'mobile': return '#db2777';
      case 'frontend': return '#0891b2';
      case 'backend': return '#ea580c';
      default: return '#6b7280';
    }
  }

  function getStatusColorHex(status: string) {
    switch(status.toLowerCase()) {
      case 'not-started': return '#6b7280';
      case 'in-progress': return '#2563eb';
      case 'on-hold': return '#ea580c';
      case 'cancelled': return '#dc2626';
      case 'completed': return '#059669';
      default: return '#6b7280';
    }
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-md shadow-lg border border-gray-300 text-sm">
          <p className="font-semibold text-gray-900">{payload[0].name}</p>
          <p className="text-gray-700">{payload[0].value} projects</p>
        </div>
      );
    }
    return null;
  };

  const BarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-md shadow-lg border border-gray-300 text-sm">
          <p className="font-semibold text-gray-900">{payload[0].payload.name}</p>
          <p className="text-gray-700">Hours: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  const LineTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-md shadow-lg border border-gray-300 text-sm">
          <p className="font-semibold text-gray-900">{label}</p>
          <p className="text-gray-700">Projects: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, value, name } = props;
    const RADIAN = Math.PI / 180;
    
    const radius = outerRadius + 20;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <g>
        <text 
          x={x} 
          y={y} 
          fill="#1f2937"
          textAnchor={x > cx ? 'start' : 'end'} 
          dominantBaseline="central"
          className="text-[11px] font-semibold"
        >
          {name} ({value})
        </text>
        <line 
          x1={cx + (outerRadius + 3) * Math.cos(-midAngle * RADIAN)} 
          y1={cy + (outerRadius + 3) * Math.sin(-midAngle * RADIAN)} 
          x2={cx + (outerRadius + 15) * Math.cos(-midAngle * RADIAN)} 
          y2={cy + (outerRadius + 15) * Math.sin(-midAngle * RADIAN)} 
          stroke="#9ca3af"
          strokeWidth="1"
        />
      </g>
    );
  };

  const renderFirstRowPieChart = (title: string, description: string, data: any[]) => (
    <Card className="rounded-lg border border-gray-300 h-full p-4 shadow-sm">
      <div className="mb-3">
        <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
        <p className="text-xs text-gray-600 mt-0.5 font-medium">{description}</p>
      </div>
      
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={renderCustomLabel}
              outerRadius={70}
              innerRadius={20}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );

  const renderSecondRowPieChart = (title: string, description: string, data: any[]) => (
    <Card className="rounded-lg border border-gray-300 h-full p-4 shadow-sm">
      <div className="mb-3">
        <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
        <p className="text-xs text-gray-600 mt-0.5 font-medium">{description}</p>
      </div>
      
      <div className="flex">
        <div className="h-[180px] w-1/2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={55}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="w-1/2 pl-3 flex flex-col justify-center">
          <div className="space-y-2">
            {data.map((item, index) => (
              <div key={index} className="flex items-center gap-1.5">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm" 
                  style={{ backgroundColor: item.color }}
                />
                <div>
                  <p className="text-xs font-semibold text-gray-900">{item.name}</p>
                  <p className="text-[10px] text-gray-600 font-medium">{item.value} issues</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Analytics Overview</h1>
        <p className="text-gray-700 mt-1 text-xs font-medium">
          Comprehensive insights into project performance and team workload
        </p>
      </div>

      <StatsCards stats={analyticsStats} />

      <div className="mt-8">
        <h2 className="text-sm font-semibold text-gray-800 mb-4">Project Distribution</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {renderFirstRowPieChart(
            "Projects by Type",
            "Distribution of project types across the portfolio",
            projectTypeData
          )}
          
          {renderFirstRowPieChart(
            "Projects by Status",
            "Current status distribution of all projects",
            projectStatusData
          )}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderSecondRowPieChart(
          "Issue Status",
          "Distribution of issue statuses across all projects",
          issueStatusData
        )}

        <Card className="rounded-lg border border-gray-300 p-4 shadow-sm">
          <div className="mb-3">
            <h3 className="font-semibold text-gray-900 text-sm">Team Workload Analysis</h3>
            <p className="text-xs text-gray-600 mt-0.5 font-medium">Top team members by allocated hours</p>
          </div>
          
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analyticsData.teamWorkload}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="2 2" stroke="#e5e7eb" horizontal={true} vertical={false} />
                <XAxis 
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 500 }}
                  domain={[0, 600]}
                  ticks={[0, 150, 300, 450, 600]}
                />
                <YAxis 
                  type="category" 
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#374151', fontSize: 9, fontWeight: 500 }}
                  width={90}
                />
                <Tooltip content={<BarTooltip />} />
                <Bar 
                  dataKey="totalHours" 
                  name="Hours"
                  fill="#1f2937"
                  radius={[0, 3, 3, 0]}
                  barSize={12}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
        </Card>
      </div>

      <div className="mt-8">
        <Card className="rounded-lg border border-gray-300 p-4 shadow-sm">
          <div className="mb-3">
            <h3 className="font-semibold text-gray-900 text-sm">Project Timeline</h3>
            <p className="text-xs text-gray-600 mt-0.5 font-medium">Project starts over time</p>
          </div>
          
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={analyticsData.projectTimeline}
                margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="2 2" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#4b5563', fontSize: 11, fontWeight: 500 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 500 }}
                  domain={[0, 'auto']}
                />
                <Tooltip content={<LineTooltip />} />
                <Line 
                  type="monotone"
                  dataKey="count"
                  name="Projects"
                  stroke="#1f2937"
                  strokeWidth={2}
                  dot={{ fill: '#1f2937', strokeWidth: 1, r: 4 }}
                  activeDot={{ r: 6, stroke: '#1f2937', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
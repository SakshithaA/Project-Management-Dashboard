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
import { Card } from 'antd';
import StatsCards from "../components/StatsCards";
import { projects, getStageColorHex, getTypeColorHex } from "../components/projectcard";

export default function Analytics() {
  const totalProjects = projects.length;
  const totalHours = projects.reduce((sum, project) => sum + project.hoursAllocated, 0);
  const totalIssues = projects.reduce((sum, project) => sum + project.issues, 0);
  const avgProgress = Math.round(projects.reduce((sum, project) => sum + project.progress, 0) / projects.length);
  
  const typeCount: Record<string, number> = {};
  projects.forEach(project => {
    typeCount[project.type] = (typeCount[project.type] || 0) + 1;
  });
  
  const projectTypeData = Object.entries(typeCount).map(([name, value]) => ({
    name,
    value,
    color: getTypeColorHex(name)
  }));

  const statusCount: Record<string, number> = {};
  projects.forEach(project => {
    statusCount[project.stage] = (statusCount[project.stage] || 0) + 1;
  });
  
  const projectStatusData = Object.entries(statusCount).map(([name, value]) => ({
    name,
    value,
    color: getStageColorHex(name)
  }));

  const totalResolvedIssues = 12;
  const issueStatusData = [
    { name: 'Open', value: totalIssues, color: '#ef4444' },
    { name: 'Resolved', value: totalResolvedIssues, color: '#10b981' },
  ];

  const teamWorkloadData = [
    { name: 'James Wilson', hours: 580 },
    { name: 'Tom Anderson', hours: 520 },
    { name: 'Sofia Martinez', hours: 490 },
    { name: 'Sarah Johnson', hours: 450 },
    { name: 'Emily Davis', hours: 420 },
    { name: 'Mike Chen', hours: 380 },
    { name: 'David Kumar', hours: 350 },
    { name: 'Lisa Wong', hours: 320 },
    { name: 'Nina Patel', hours: 290 },
    { name: 'Alex Thompson', hours: 260 },
  ];

  const projectTimelineData = [
    { month: 'Nov 2023', projects: 0 },
    { month: 'Jan 2024', projects: 2 },
    { month: 'Feb 2024', projects: 2 },
    { month: 'Mar 2024', projects: 1 },
  ];

  const analyticsStats = [
    {
      title: "Total Team Members",
      value: 10,
      icon: <TeamOutlined />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Hours",
      value: `${totalHours}h`,
      icon: <ClockCircleOutlined />,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Avg Progress",
      value: `${avgProgress}%`,
      icon: <DashboardOutlined />,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Open Issues",
      value: totalIssues,
      icon: <AlertOutlined />,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 rounded-md shadow-sm border border-gray-200 text-xs">
          <p className="font-medium text-gray-900">{payload[0].name}</p>
          <p className="text-gray-700">{payload[0].value} projects</p>
        </div>
      );
    }
    return null;
  };

  const BarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 rounded-md shadow-sm border border-gray-200 text-xs">
          <p className="font-medium text-gray-900">{payload[0].payload.name}</p>
          <p className="text-gray-700">Hours: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  const LineTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 rounded-md shadow-sm border border-gray-200 text-xs">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-gray-700">Projects: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, value, name } = props;
    const RADIAN = Math.PI / 180;
    
    const radius = outerRadius + 15;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <g>
        <text 
          x={x} 
          y={y} 
          fill="#111827"
          textAnchor={x > cx ? 'start' : 'end'} 
          dominantBaseline="central"
          className="text-[10px] font-medium"
        >
          {name} ({value})
        </text>
        <line 
          x1={cx + (outerRadius + 3) * Math.cos(-midAngle * RADIAN)} 
          y1={cy + (outerRadius + 3) * Math.sin(-midAngle * RADIAN)} 
          x2={cx + (outerRadius + 12) * Math.cos(-midAngle * RADIAN)} 
          y2={cy + (outerRadius + 12) * Math.sin(-midAngle * RADIAN)} 
          stroke="#9ca3af"
          strokeWidth="1"
        />
      </g>
    );
  };

  const renderFirstRowPieChart = (title: string, description: string, data: any[]) => (
    <Card className="rounded-lg border border-gray-200 h-full p-4">
      <div className="mb-3">
        <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
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
              innerRadius={15}
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
    <Card className="rounded-lg border border-gray-200 h-full p-4">
      <div className="mb-3">
        <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
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
                  className="w-3 h-3 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: item.color }}
                />
                <div>
                  <p className="text-xs font-medium text-gray-900">{item.name}</p>
                  <p className="text-[10px] text-gray-500">{item.value} issues</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Analytics Overview</h1>
        <p className="text-gray-500 mt-1 text-xs">
          Comprehensive insights into project performance and team workload
        </p>
      </div>

      <StatsCards stats={analyticsStats} />

      <div className="mt-8">
        <h2 className="text-sm font-semibold text-gray-800 mb-4">Project Distribution</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {renderSecondRowPieChart(
          "Issue Status",
          "Open vs resolved issues across all projects",
          issueStatusData
        )}

        <Card className="rounded-lg border border-gray-200 p-4">
          <div className="mb-3">
            <h3 className="font-semibold text-gray-900 text-sm">Team Workload Analysis</h3>
            <p className="text-xs text-gray-500 mt-0.5">Top 10 team members by allocated hours</p>
          </div>
          
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={teamWorkloadData}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="2 2" stroke="#f3f4f6" horizontal={true} vertical={false} />
                <XAxis 
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 10 }}
                  domain={[0, 600]}
                  ticks={[0, 150, 300, 450, 600]}
                />
                <YAxis 
                  type="category" 
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#374151', fontSize: 9 }}
                  width={90}
                />
                <Tooltip content={<BarTooltip />} />
                <Bar 
                  dataKey="hours" 
                  name="Hours"
                  fill="#111827"
                  radius={[0, 3, 3, 0]}
                  barSize={12}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
        </Card>
      </div>

      <div className="mt-8">
        <Card className="rounded-lg border border-gray-200 p-4">
          <div className="mb-3">
            <h3 className="font-semibold text-gray-900 text-sm">Project Timeline</h3>
            <p className="text-xs text-gray-500 mt-0.5">Project starts over time</p>
          </div>
          
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={projectTimelineData}
                margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="2 2" stroke="#f3f4f6" />
                <XAxis 
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 10 }}
                  domain={[0, 2.5]}
                  ticks={[0, 0.5, 1, 1.5, 2]}
                />
                <Tooltip content={<LineTooltip />} />
                <Line 
                  type="monotone"
                  dataKey="projects"
                  name="Projects"
                  stroke="#111827"
                  strokeWidth={2}
                  dot={{ fill: '#111827', strokeWidth: 1, r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
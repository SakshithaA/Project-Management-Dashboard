import { 
  TeamOutlined,
  ClockCircleOutlined,
  DashboardOutlined,
  AlertOutlined,
} from "@ant-design/icons";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer,
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
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-medium text-gray-900">{payload[0].name}</p>
          <p className="text-sm text-gray-700">{payload[0].value} projects</p>
        </div>
      );
    }
    return null;
  };

  const BarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-medium text-gray-900">{payload[0].payload.name}</p>
          <p className="text-sm text-gray-700">Hours: {payload[0].value}</p>
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
          fill="#111827"
          textAnchor={x > cx ? 'start' : 'end'} 
          dominantBaseline="central"
          className="text-xs font-medium"
        >
          {name} ({value})
        </text>
        <line 
          x1={cx + (outerRadius + 5) * Math.cos(-midAngle * RADIAN)} 
          y1={cy + (outerRadius + 5) * Math.sin(-midAngle * RADIAN)} 
          x2={cx + (outerRadius + 15) * Math.cos(-midAngle * RADIAN)} 
          y2={cy + (outerRadius + 15) * Math.sin(-midAngle * RADIAN)} 
          stroke="#9ca3af"
          strokeWidth="1"
        />
      </g>
    );
  };

  const renderFirstRowPieChart = (title: string, description: string, data: any[]) => (
    <Card className="rounded-lg border border-gray-200 h-full">
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
      
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={renderCustomLabel}
              outerRadius={80}
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
    <Card className="rounded-lg border border-gray-200 h-full">
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
      
      <div className="flex">
        <div className="h-[220px] w-1/2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={70}
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
        
        <div className="w-1/2 pl-4 flex flex-col justify-center">
          <div className="space-y-3">
            {data.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: item.color }}
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.value} issues</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Overview</h1>
        <p className="text-gray-500 mt-2">
          Comprehensive insights into project performance and team workload
        </p>
      </div>

      <StatsCards stats={analyticsStats} />

      <div className="mt-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Project Distribution</h2>
        
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

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderSecondRowPieChart(
          "Issue Status",
          "Open vs resolved issues across all projects",
          issueStatusData
        )}

        <Card className="rounded-lg border border-gray-200">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900">Team Workload Analysis</h3>
            <p className="text-sm text-gray-500 mt-1">Top 10 team members by allocated hours</p>
          </div>
          
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={teamWorkloadData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={true} vertical={false} />
                <XAxis 
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  domain={[0, 600]}
                  ticks={[0, 150, 300, 450, 600]}
                />
                <YAxis 
                  type="category" 
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#374151', fontSize: 12 }}
                  width={100}
                />
                <Tooltip content={<BarTooltip />} />
                <Bar 
                  dataKey="hours" 
                  name="Hours"
                  fill="#111827"
                  radius={[0, 4, 4, 0]}
                  barSize={14}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex justify-between mt-2 px-2">
            <span className="text-xs text-gray-500">0h</span>
            <span className="text-xs text-gray-500">150h</span>
            <span className="text-xs text-gray-500">300h</span>
            <span className="text-xs text-gray-500">450h</span>
            <span className="text-xs text-gray-500">600h</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
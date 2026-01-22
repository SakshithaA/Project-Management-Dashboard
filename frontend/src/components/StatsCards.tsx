import { Card } from "antd";
import {
  ProjectOutlined,
  RiseOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

export default function StatsCards() {
  const stats = [
    {
      title: "Total Projects",
      value: 5,
      icon: <ProjectOutlined />,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
    },
    {
      title: "In Progress",
      value: 4,
      icon: <RiseOutlined />,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Completed",
      value: 1,
      icon: <CheckCircleOutlined />,
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      title: "Open Issues",
      value: 3,
      icon: <ExclamationCircleOutlined />,
      color: "text-red-500",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="flex justify-between mt-6 mx-50">
      {stats.map((stat, index) => (
        <Card
          key={stat.title}
          className="rounded-lg border border-gray-200 p-0 w-60"
          bodyStyle={{ 
            padding: '14px 16px',
            width: '100%'
          }}
          style={{ 
            marginRight: index < stats.length - 1 ? '16px' : '0'
          }}
        >
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
              <p className="text-3xl font-semibold text-gray-900 text-center">{stat.value}</p>
            </div>
            <div className={`w-10 h-10 rounded-full ${stat.bgColor} flex items-center justify-center flex-shrink-0 ml-2`}>
              <div className={`text-lg ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
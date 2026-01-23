import { Card } from "antd";
import type { ReactNode } from "react";

interface StatItem {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: string;
  bgColor: string;
  description?: string;
}

interface StatsCardsProps {
  stats: StatItem[];
  className?: string;
  cardWidth?: string;
}

export default function StatsCards({ 
  stats, 
  className = "", 
  cardWidth = "w-55" 
}: StatsCardsProps) {
  return (
    <div className={`flex justify-between mt-1 mx-35 ${className}`}>
      {stats.map((stat, index) => (
        <Card
          key={stat.title}
          className={`rounded-lg border border-gray-200 p-0 ${cardWidth}`}
          bodyStyle={{ 
            padding: '12px 14px',
            width: '100%'
          }}
          style={{ 
            marginRight: index < stats.length - 1 ? '16px' : '0'
          }}
        >
          <div className="flex justify-between items-center h-full">
            <div className="flex-1">
              <p className="text-sm text-gray-500 ml-5">{stat.title}</p>

              <p className="text-3xl font-semibold text-gray-900 text-center my-2">
                {stat.value}
              </p>

              {stat.description && (
                <p className="text-xs text-gray-500 text-center">
                  {stat.description}
                </p>
              )}
            </div>

            <div
              className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center flex-shrink-0 ml-3`}
            >
              <span className={`text-2xl ${stat.color}`}>
                {stat.icon}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
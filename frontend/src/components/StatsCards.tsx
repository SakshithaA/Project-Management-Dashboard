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
  cardWidth = "w-100" 
}: StatsCardsProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {stats.map((stat, index) => (
        <Card
          key={stat.title}
          className={`rounded-lg border border-gray-200 p-0 ${cardWidth}`}
          bodyStyle={{ 
            padding: '16px',
            width: '100%'
          }}
        >
          <div className="flex justify-between items-center h-full">
            <div className="flex-1">
              <p className="text-sm text-gray-500 text-center mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 text-center mb-1">
                {stat.value}
              </p>
              {stat.description && (
                <p className="text-xs text-gray-500 text-center">
                  {stat.description}
                </p>
              )}
            </div>
            <div
              className={`w-10 h-10 rounded-full ${stat.bgColor} flex items-center justify-center flex-shrink-0 ml-3`}
            >
              <span className={`text-lg ${stat.color}`}>
                {stat.icon}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
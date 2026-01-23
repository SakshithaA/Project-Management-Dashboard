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
    <div className={`flex justify-between gap-2 ${className}`}>
      {stats.map((stat, index) => (
        <Card
          key={stat.title}
          className={`rounded-lg border border-gray-200 p-0 ${cardWidth}`}
          bodyStyle={{ 
            padding: '10px 12px',
            width: '100%'
          }}
        >
          <div className="flex justify-between items-center h-full">
            <div className="flex-1">
              <p className="text-xs text-gray-500 text-center">{stat.title}</p>
              <p className="text-xl font-semibold text-gray-900 text-center my-1">
                {stat.value}
              </p>
              {stat.description && (
                <p className="text-[10px] text-gray-500 text-center">
                  {stat.description}
                </p>
              )}
            </div>
            <div
              className={`w-8 h-8 rounded-full ${stat.bgColor} flex items-center justify-center flex-shrink-0 ml-2`}
            >
              <span className={`text-base ${stat.color}`}>
                {stat.icon}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
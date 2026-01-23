import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from 'antd';

interface PieChartCardProps {
  title: string;
  description?: string;
  data: { name: string; value: number; color: string }[];
  height?: number;
}

export default function PieChartCard({ title, description, data }: PieChartCardProps) {
  return (
    <Card className="rounded-lg border border-gray-200 h-full">
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>
      
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${entry.name}: ${entry.value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${value}`, 'Count']}
              contentStyle={{ 
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}
            />
            <Legend 
              layout="vertical" 
              verticalAlign="middle" 
              align="right"
              wrapperStyle={{ paddingLeft: '20px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
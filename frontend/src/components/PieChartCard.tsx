import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, Typography } from 'antd';

const { Text } = Typography;

interface PieChartCardProps {
  title: string;
  description?: string;
  data: { name: string; value: number; color: string }[];
  height?: number;
  compact?: boolean;
}

export default function PieChartCard({ 
  title, 
  description, 
  data, 
  height = 250,
  compact = false 
}: PieChartCardProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-300">
          <p className="font-semibold text-gray-900 text-sm">{payload[0].name}</p>
          <p className="text-gray-700 text-sm font-medium">{payload[0].value}</p>
          <div className="flex items-center mt-1">
            <div 
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: payload[0].color }}
            />
            <Text className="text-gray-600 text-xs">
              {((payload[0].value / data.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%
            </Text>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="rounded-lg border border-gray-300 h-full shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 mt-1 font-medium">{description}</p>
        )}
      </div>
      
      <div style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={!compact}
              label={!compact ? (entry) => `${entry.name}: ${entry.value}` : false}
              outerRadius={compact ? 70 : 80}
              innerRadius={compact ? 20 : 30}
              fill="#8884d8"
              dataKey="value"
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  stroke="#fff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            {!compact && (
              <Legend 
                layout="vertical" 
                verticalAlign="middle" 
                align="right"
                wrapperStyle={{ 
                  paddingLeft: '20px',
                  fontSize: '12px',
                  fontWeight: 500
                }}
                iconSize={10}
                iconType="circle"
              />
            )}
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Summary stats */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <Text className="text-sm text-gray-600 font-medium">Total:</Text>
          <Text className="text-lg font-bold text-gray-900">
            {data.reduce((sum, item) => sum + item.value, 0)}
          </Text>
        </div>
      </div>
    </Card>
  );
}

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export interface ChartCardProps {
  title: string;
  data: Array<Record<string, any>>;
  dataKey?: string;
  type?: 'bar' | 'line';
  height?: number;
  categories?: string[];
  colors?: string[];
}

const ChartCard = ({ 
  title, 
  data, 
  dataKey = 'amount', 
  type = 'bar', 
  height = 300,
  categories = [],
  colors = ['#4CD3C8', '#6366F1', '#EC4899', '#F59E0B']
}: ChartCardProps) => {
  const renderChart = () => {
    if (type === 'line') {
      return (
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="name" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(17, 24, 39, 0.9)',
              border: '1px solid #374151',
              borderRadius: '4px',
              color: '#f9fafb' 
            }} 
          />
          <Legend />
          {categories.length > 0 ? (
            categories.map((category, index) => (
              <Line 
                key={category}
                type="monotone" 
                dataKey={category} 
                stroke={colors[index % colors.length]} 
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
            ))
          ) : (
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke="#4CD3C8" 
              strokeWidth={2}
              activeDot={{ r: 8 }}
            />
          )}
        </LineChart>
      );
    }

    return (
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
        <XAxis dataKey="name" stroke="#888" />
        <YAxis stroke="#888" />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'rgba(17, 24, 39, 0.9)',
            border: '1px solid #374151',
            borderRadius: '4px',
            color: '#f9fafb' 
          }} 
        />
        <Legend />
        {categories.length > 0 ? (
          categories.map((category, index) => (
            <Bar 
              key={category}
              dataKey={category} 
              fill={colors[index % colors.length]} 
              radius={[4, 4, 0, 0]}
            />
          ))
        ) : (
          <Bar 
            dataKey={dataKey} 
            fill="#4CD3C8" 
            radius={[4, 4, 0, 0]} 
          />
        )}
      </BarChart>
    );
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full" style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartCard;

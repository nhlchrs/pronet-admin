
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface ChartCardProps {
  title: string;
  description?: string; // Add the missing description prop
  data: any[];
  categories: string[]; // Changed from dataKeys to categories to match usage in AdminAnalytics
  colors?: string[];
  valueFormatter?: (value: any) => string; // Add the missing valueFormatter prop
  chartType?: 'area' | 'bar';
  showLegend?: boolean; // Add the missing showLegend prop
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const EnhancedChartCard = ({ 
  title,
  description,
  data, 
  categories,
  colors = ['#8b5cf6', '#10b981', '#f59e0b', '#ef4444'], 
  chartType = 'area',
  valueFormatter = formatCurrency,
  showLegend = false
}: ChartCardProps) => {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  {categories.map((key, index) => (
                    <linearGradient key={key} id={`color-${key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors[index % colors.length]} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={colors[index % colors.length]} stopOpacity={0.1} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis 
                  dataKey="name" 
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => valueFormatter ? valueFormatter(value).toString() : value.toString()}
                />
                <Tooltip 
                  formatter={(value: any) => valueFormatter ? valueFormatter(value) : value}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                {showLegend && <Legend />}
                {categories.map((key, index) => (
                  <Area
                    key={key}
                    type="monotone"
                    dataKey={key}
                    name={key.charAt(0).toUpperCase() + key.slice(1)}
                    stroke={colors[index % colors.length]}
                    fillOpacity={1}
                    fill={`url(#color-${key})`}
                  />
                ))}
              </AreaChart>
            ) : (
              <BarChart
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis 
                  dataKey="name" 
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => valueFormatter ? valueFormatter(value).toString() : value.toString()}
                />
                <Tooltip 
                  formatter={(value: any) => valueFormatter ? valueFormatter(value) : value}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                {showLegend && <Legend />}
                {categories.map((key, index) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    name={key.charAt(0).toUpperCase() + key.slice(1)}
                    fill={colors[index % colors.length]}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedChartCard;

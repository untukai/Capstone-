

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../hooks/useTheme';

interface ChartData {
  label: string;
  value: number;
}

interface SalesChartProps {
  data: ChartData[];
}

// Custom Tooltip for styling
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const value = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(payload[0].value);

    return (
      <div className="bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-800 p-2 rounded-md shadow-lg border border-neutral-200 dark:border-neutral-700">
        <p className="text-sm font-bold">{`${label} : ${value}`}</p>
      </div>
    );
  }
  return null;
};

const SalesChart: React.FC<SalesChartProps> = ({ data }) => {
  const { theme } = useTheme();
  
  const tickColor = theme === 'dark' ? '#9CA3AF' : '#6B7280'; // neutral-400 or neutral-500
  const gridColor = theme === 'dark' ? '#374151' : '#E5E7EB'; // neutral-700 or neutral-200
  
  const yAxisTickFormatter = (value: number) => {
    if (value >= 1000000) {
      return `${value / 1000000}jt`;
    }
    if (value >= 1000) {
      return `${value / 1000}rb`;
    }
    return String(value);
  };
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 10,
          left: -10,
          bottom: 5,
        }}
        barGap={8}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
        <XAxis 
          dataKey="label" 
          tickLine={false} 
          axisLine={false}
          tick={{ fontSize: 12, fill: tickColor }} 
        />
        <YAxis 
          tickFormatter={yAxisTickFormatter}
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12, fill: tickColor }}
          width={40}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: theme === 'dark' ? 'rgba(3, 172, 14, 0.2)' : 'rgba(3, 172, 14, 0.1)' }} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="#03AC0E" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SalesChart;
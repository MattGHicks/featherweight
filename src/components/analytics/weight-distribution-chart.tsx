'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface WeightDistributionChartProps {
  data: Array<{
    range: string;
    count: number;
  }>;
}

export function WeightDistributionChart({
  data,
}: WeightDistributionChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weight Distribution</CardTitle>
        <CardDescription>
          Distribution of gear items by weight ranges
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

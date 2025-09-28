'use client';

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
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
import { formatWeight } from '@/lib/utils';

interface WeightTrendsChartProps {
  data: Array<{
    name: string;
    baseWeight: number;
    totalWeight: number;
    itemCount: number;
    createdAt: string;
  }>;
}

export function WeightTrendsChart({ data }: WeightTrendsChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weight Trends</CardTitle>
          <CardDescription>
            Track your pack list weight progression over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            Create more pack lists to see weight trends
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort by creation date and format for chart
  const chartData = data
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
    .map((item, index) => ({
      ...item,
      date: new Date(item.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      baseWeightKg: item.baseWeight / 1000,
      totalWeightKg: item.totalWeight / 1000,
      order: index + 1,
    }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">Created: {data.date}</p>
          <p className="text-sm">
            Base Weight:{' '}
            <span className="font-semibold">
              {formatWeight(data.baseWeight)}
            </span>
          </p>
          <p className="text-sm">
            Total Weight:{' '}
            <span className="font-semibold">
              {formatWeight(data.totalWeight)}
            </span>
          </p>
          <p className="text-sm">Items: {data.itemCount}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weight Trends</CardTitle>
        <CardDescription>
          Track your pack list weight progression over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="order"
              label={{
                value: 'Pack List Order',
                position: 'insideBottom',
                offset: -10,
              }}
            />
            <YAxis
              label={{
                value: 'Weight (kg)',
                angle: -90,
                position: 'insideLeft',
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="baseWeightKg"
              stroke="#10b981"
              strokeWidth={2}
              name="Base Weight"
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="totalWeightKg"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Total Weight"
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatWeight(Math.min(...data.map(d => d.baseWeight)))}
            </div>
            <div className="text-sm text-muted-foreground">
              Lightest Base Weight
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {formatWeight(
                data.reduce((sum, d) => sum + d.baseWeight, 0) / data.length
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              Average Base Weight
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {data.length > 1
                ? `${((data[data.length - 1].baseWeight - data[0].baseWeight) / 1000).toFixed(2)} kg`
                : '0 kg'}
            </div>
            <div className="text-sm text-muted-foreground">
              {data.length > 1 &&
              data[data.length - 1].baseWeight < data[0].baseWeight
                ? 'Weight Saved'
                : 'Weight Change'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

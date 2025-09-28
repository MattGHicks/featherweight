'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatWeight } from '@/lib/utils';

interface CategoryBreakdownChartProps {
  data: Array<{
    category: string;
    weight: number;
    count: number;
    color: string;
  }>;
  detailed?: boolean;
}

export function CategoryBreakdownChart({ data, detailed = false }: CategoryBreakdownChartProps) {
  const totalWeight = data.reduce((sum, item) => sum + item.weight, 0);

  const chartData = data.map(item => ({
    ...item,
    percentage: totalWeight > 0 ? (item.weight / totalWeight * 100) : 0,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.category}</p>
          <p className="text-sm text-muted-foreground">
            Weight: {formatWeight(data.weight)} ({data.percentage.toFixed(1)}%)
          </p>
          <p className="text-sm text-muted-foreground">
            Items: {data.count}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weight by Category</CardTitle>
        <CardDescription>
          {detailed
            ? 'Detailed breakdown showing weight distribution across gear categories'
            : 'How your gear weight is distributed across different categories'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No category data available
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="weight"
                  label={(entry: any) =>
                    entry.percentage > 5 ? `${entry.category} (${entry.percentage.toFixed(1)}%)` : ''
                  }
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {detailed && (
              <div className="mt-6 space-y-3">
                <h4 className="font-medium">Category Details</h4>
                {chartData
                  .sort((a, b) => b.weight - a.weight)
                  .map((item) => (
                    <div key={item.category} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="font-medium">{item.category}</span>
                        <span className="text-sm text-muted-foreground">
                          ({item.count} items)
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {formatWeight(item.weight)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {item.percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
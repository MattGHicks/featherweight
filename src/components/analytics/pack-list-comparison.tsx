'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatWeight } from '@/lib/utils';

interface PackListComparisonProps {
  data: Array<{
    name: string;
    baseWeight: number;
    totalWeight: number;
    itemCount: number;
    createdAt: string;
  }>;
}

export function PackListComparison({ data }: PackListComparisonProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pack List Comparison</CardTitle>
          <CardDescription>
            Compare weights and item counts across your pack lists
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            Create more pack lists to compare them
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort by base weight for comparison
  const sortedData = [...data]
    .sort((a, b) => a.baseWeight - b.baseWeight)
    .map((item, index) => ({
      ...item,
      baseWeightKg: item.baseWeight / 1000,
      totalWeightKg: item.totalWeight / 1000,
      rank: index + 1,
      shortName: item.name.length > 15 ? `${item.name.substring(0, 15)}...` : item.name,
    }));

  const lightest = sortedData[0];
  const heaviest = sortedData[sortedData.length - 1];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">
            Base Weight: <span className="font-semibold">{formatWeight(data.baseWeight)}</span>
          </p>
          <p className="text-sm">
            Total Weight: <span className="font-semibold">{formatWeight(data.totalWeight)}</span>
          </p>
          <p className="text-sm">Items: {data.itemCount}</p>
          <p className="text-sm text-muted-foreground">
            Rank: #{data.rank} lightest
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pack List Comparison</CardTitle>
          <CardDescription>
            Compare base weights across your pack lists (sorted by weight)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={sortedData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" label={{ value: 'Weight (kg)', position: 'insideBottom', offset: -10 }} />
              <YAxis type="category" dataKey="shortName" width={120} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="baseWeightKg" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Badge variant="default" className="mr-2">🥇</Badge>
              Lightest Pack List
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-lg">{lightest.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Created {new Date(lightest.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-green-600">
                    {formatWeight(lightest.baseWeight)}
                  </div>
                  <div className="text-xs text-muted-foreground">Base Weight</div>
                </div>
                <div>
                  <div className="text-xl font-bold">
                    {formatWeight(lightest.totalWeight)}
                  </div>
                  <div className="text-xs text-muted-foreground">Total Weight</div>
                </div>
                <div>
                  <div className="text-xl font-bold">
                    {lightest.itemCount}
                  </div>
                  <div className="text-xs text-muted-foreground">Items</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Badge variant="secondary" className="mr-2">📊</Badge>
              Weight Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Weight Range:</span>
                <span className="font-semibold">
                  {formatWeight(lightest.baseWeight)} - {formatWeight(heaviest.baseWeight)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Weight Difference:</span>
                <span className="font-semibold">
                  {formatWeight(heaviest.baseWeight - lightest.baseWeight)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Average Items:</span>
                <span className="font-semibold">
                  {Math.round(data.reduce((sum, d) => sum + d.itemCount, 0) / data.length)} items
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Total Pack Lists:</span>
                <span className="font-semibold">{data.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
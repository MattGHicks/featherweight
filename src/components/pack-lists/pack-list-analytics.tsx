'use client';

import { useMemo } from 'react';

import { Package, Scale, Target, TrendingUp, Weight, Zap } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { WeightDisplay } from '@/components/ui/weight-display';
import { WeightUnit } from '@/lib/weight-utils';

interface GearItem {
  id: string;
  name: string;
  weight: number;
  isWorn: boolean;
  isConsumable: boolean;
  category: {
    id: string;
    name: string;
    color: string;
  };
}

interface PackListItem {
  id: string;
  quantity: number;
  isIncluded: boolean;
  gearItem: GearItem;
}

interface PackListAnalyticsProps {
  items: PackListItem[];
  userGoals?: {
    baseWeightGoal?: number;
    totalWeightGoal?: number;
  };
  preferredUnit?: WeightUnit;
}

export function PackListAnalytics({
  items,
  userGoals,
  preferredUnit,
}: PackListAnalyticsProps) {
  const analytics = useMemo(() => {
    const includedItems = items.filter(item => item.isIncluded);

    // Calculate weights
    const totalWeight = includedItems.reduce(
      (sum, item) => sum + item.gearItem.weight * item.quantity,
      0
    );

    const baseWeight = includedItems
      .filter(item => !item.gearItem.isWorn && !item.gearItem.isConsumable)
      .reduce((sum, item) => sum + item.gearItem.weight * item.quantity, 0);

    const wornWeight = includedItems
      .filter(item => item.gearItem.isWorn)
      .reduce((sum, item) => sum + item.gearItem.weight * item.quantity, 0);

    const consumableWeight = includedItems
      .filter(item => item.gearItem.isConsumable)
      .reduce((sum, item) => sum + item.gearItem.weight * item.quantity, 0);

    // Category breakdown
    const categoryBreakdown = includedItems.reduce(
      (acc, item) => {
        const categoryName = item.gearItem.category.name;
        const weight = item.gearItem.weight * item.quantity;

        if (!acc[categoryName]) {
          acc[categoryName] = {
            name: categoryName,
            weight: 0,
            itemCount: 0,
            color: item.gearItem.category.color,
          };
        }

        acc[categoryName].weight += weight;
        acc[categoryName].itemCount += 1;

        return acc;
      },
      {} as Record<
        string,
        { name: string; weight: number; itemCount: number; color: string }
      >
    );

    const categoryData = Object.values(categoryBreakdown)
      .sort((a, b) => b.weight - a.weight)
      .map(cat => ({
        ...cat,
        percentage: ((cat.weight / totalWeight) * 100).toFixed(1),
      }));

    // Weight distribution for pie chart
    const weightDistribution = [
      { name: 'Base Weight', value: baseWeight, color: '#3b82f6' },
      { name: 'Worn Weight', value: wornWeight, color: '#10b981' },
      { name: 'Consumables', value: consumableWeight, color: '#f59e0b' },
    ].filter(item => item.value > 0);

    // Heaviest items
    const heaviestItems = includedItems
      .map(item => ({
        name: item.gearItem.name,
        weight: item.gearItem.weight * item.quantity,
        category: item.gearItem.category.name,
        isWorn: item.gearItem.isWorn,
        isConsumable: item.gearItem.isConsumable,
      }))
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 5);

    return {
      totalWeight,
      baseWeight,
      wornWeight,
      consumableWeight,
      itemCount: includedItems.length,
      categoryData,
      weightDistribution,
      heaviestItems,
    };
  }, [items]);

  const getGoalProgress = (currentWeight: number, goalWeight?: number) => {
    if (!goalWeight) return null;
    const percentage = Math.min((currentWeight / goalWeight) * 100, 100);
    return {
      percentage,
      isOverGoal: currentWeight > goalWeight,
      difference: Math.abs(currentWeight - goalWeight),
    };
  };

  const baseGoalProgress = getGoalProgress(
    analytics.baseWeight,
    userGoals?.baseWeightGoal
  );
  const totalGoalProgress = getGoalProgress(
    analytics.totalWeight,
    userGoals?.totalWeightGoal
  );

  return (
    <div className="space-y-6">
      {/* Weight Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Weight</CardTitle>
            <Weight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <WeightDisplay
                grams={analytics.totalWeight}
                preferredUnit={preferredUnit}
              />
            </div>
            {totalGoalProgress && (
              <div className="mt-2">
                <Progress
                  value={totalGoalProgress.percentage}
                  className={`h-2 ${totalGoalProgress.isOverGoal ? 'bg-red-100' : 'bg-green-100'}`}
                />
                <p
                  className={`text-xs mt-1 ${totalGoalProgress.isOverGoal ? 'text-red-600' : 'text-green-600'}`}
                >
                  {totalGoalProgress.isOverGoal ? 'Over' : 'Under'} goal by{' '}
                  <WeightDisplay
                    grams={totalGoalProgress.difference}
                    preferredUnit={preferredUnit}
                  />
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Base Weight</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <WeightDisplay
                grams={analytics.baseWeight}
                preferredUnit={preferredUnit}
              />
            </div>
            {baseGoalProgress && (
              <div className="mt-2">
                <Progress
                  value={baseGoalProgress.percentage}
                  className={`h-2 ${baseGoalProgress.isOverGoal ? 'bg-red-100' : 'bg-green-100'}`}
                />
                <p
                  className={`text-xs mt-1 ${baseGoalProgress.isOverGoal ? 'text-red-600' : 'text-green-600'}`}
                >
                  {baseGoalProgress.isOverGoal ? 'Over' : 'Under'} goal by{' '}
                  <WeightDisplay
                    grams={baseGoalProgress.difference}
                    preferredUnit={preferredUnit}
                  />
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Worn Weight</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <WeightDisplay
                grams={analytics.wornWeight}
                preferredUnit={preferredUnit}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {((analytics.wornWeight / analytics.totalWeight) * 100).toFixed(
                1
              )}
              % of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.itemCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Avg:{' '}
              <WeightDisplay
                grams={analytics.totalWeight / analytics.itemCount}
                preferredUnit={preferredUnit}
              />{' '}
              per item
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weight Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weight Distribution</CardTitle>
            <CardDescription>
              Breakdown by base weight, worn items, and consumables
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.weightDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {analytics.weightDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [
                      `${(value / 1000).toFixed(2)}kg`,
                      'Weight',
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>
              Weight distribution by gear category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.categoryData.slice(0, 6).map(category => (
                <div
                  key={category.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm font-medium">{category.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {category.itemCount} items
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      <WeightDisplay
                        grams={category.weight}
                        preferredUnit={preferredUnit}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {category.percentage}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Weight Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weight by Category</CardTitle>
          <CardDescription>
            Visual breakdown of weight distribution across categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analytics.categoryData.slice(0, 8)}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                />
                <YAxis
                  tickFormatter={value => `${(value / 1000).toFixed(1)}kg`}
                />
                <Tooltip
                  formatter={(value: number) => [
                    `${(value / 1000).toFixed(2)}kg`,
                    'Weight',
                  ]}
                  labelFormatter={label => `Category: ${label}`}
                />
                <Bar dataKey="weight" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Heaviest Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Heaviest Items
          </CardTitle>
          <CardDescription>
            Top 5 items contributing most to pack weight
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.heaviestItems.map((item, index) => (
              <div
                key={item.name}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.category}
                      {item.isWorn && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          Worn
                        </Badge>
                      )}
                      {item.isConsumable && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          Consumable
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    <WeightDisplay
                      grams={item.weight}
                      preferredUnit={preferredUnit}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {((item.weight / analytics.totalWeight) * 100).toFixed(1)}%
                    of total
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weight Optimization Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Weight Optimization Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.heaviestItems.slice(0, 3).map((item, index) => (
              <div key={item.name} className="p-3 rounded-lg bg-muted/30">
                <div className="font-medium text-sm mb-1">
                  Consider lighter alternatives for: {item.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  Currently <WeightDisplay
                    grams={item.weight}
                    preferredUnit={preferredUnit}
                  /> • Could
                  potentially save 20-40% weight
                </div>
              </div>
            ))}
            {analytics.baseWeight > (userGoals?.baseWeightGoal || 0) &&
              userGoals?.baseWeightGoal && (
                <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                  <div className="font-medium text-sm text-yellow-800 mb-1">
                    Base Weight Goal Exceeded
                  </div>
                  <div className="text-xs text-yellow-700">
                    Consider removing non-essential items or finding lighter
                    alternatives to reach your{' '}
                    <WeightDisplay
                      grams={userGoals.baseWeightGoal}
                      preferredUnit={preferredUnit}
                    /> goal.
                  </div>
                </div>
              )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

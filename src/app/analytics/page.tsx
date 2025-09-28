'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

import { BarChart3, TrendingUp, Target, Scale } from 'lucide-react';

import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WeightDistributionChart } from '@/components/analytics/weight-distribution-chart';
import { CategoryBreakdownChart } from '@/components/analytics/category-breakdown-chart';
import { WeightTrendsChart } from '@/components/analytics/weight-trends-chart';
import { PackListComparison } from '@/components/analytics/pack-list-comparison';
import { WeightGoals } from '@/components/analytics/weight-goals';
import { formatWeight } from '@/lib/utils';

interface AnalyticsData {
  totalGearItems: number;
  totalPackLists: number;
  averageBaseWeight: number;
  lightestBaseWeight: number;
  heaviestBaseWeight: number;
  categoryBreakdown: Array<{
    category: string;
    weight: number;
    count: number;
    color: string;
  }>;
  weightDistribution: Array<{
    range: string;
    count: number;
  }>;
  packListTrends: Array<{
    name: string;
    baseWeight: number;
    totalWeight: number;
    itemCount: number;
    createdAt: string;
  }>;
  topHeaviestItems: Array<{
    name: string;
    category: string;
    weight: number;
    usage: number;
  }>;
}

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      setIsLoading(false);
      return;
    }

    async function fetchAnalytics() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/analytics');

        if (!response.ok) {
          throw new Error('Failed to fetch analytics');
        }

        const data = await response.json();
        setAnalytics(data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to load analytics data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchAnalytics();
  }, [session]);

  if (status === 'loading' || isLoading) {
    return (
      <div
        className="w-full min-h-screen flex items-center justify-center"
        style={{ padding: '2rem clamp(2rem, 5vw, 8rem)' }}
      >
        Loading analytics...
      </div>
    );
  }

  if (!session) {
    redirect('/login');
  }

  if (error) {
    return (
      <div
        className="w-full min-h-screen flex items-center justify-center"
        style={{ padding: '2rem clamp(2rem, 5vw, 8rem)' }}
      >
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <BarChart3 className="h-16 w-16 text-muted-foreground mb-6" />
            <h3 className="text-lg font-semibold mb-2">Unable to load analytics</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              {error}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analytics || analytics.totalGearItems === 0) {
    return (
      <div
        className="w-full min-h-screen"
        style={{ padding: '2rem clamp(2rem, 5vw, 8rem)' }}
      >
        <PageHeader
          title="Weight Analytics"
          description="Analyze your gear weight distribution and track progress"
        />

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <BarChart3 className="h-16 w-16 text-muted-foreground mb-6" />
            <h3 className="text-lg font-semibold mb-2">No data to analyze yet</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              Add gear items and create pack lists to see detailed weight
              analytics and optimization insights.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="w-full min-h-screen"
      style={{ padding: '2rem clamp(2rem, 5vw, 8rem)' }}
    >
      <PageHeader
        title="Weight Analytics"
        description="Analyze your gear weight distribution and track progress towards ultralight goals"
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Scale className="mr-2 h-4 w-4" />
              Average Base Weight
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatWeight(analytics.averageBaseWeight)}
            </div>
            <CardDescription>
              Across {analytics.totalPackLists} pack lists
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Target className="mr-2 h-4 w-4" />
              Lightest Base Weight
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatWeight(analytics.lightestBaseWeight)}
            </div>
            <CardDescription>Your personal best</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="mr-2 h-4 w-4" />
              Total Gear Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalGearItems}</div>
            <CardDescription>In your gear library</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <BarChart3 className="mr-2 h-4 w-4" />
              Pack Lists
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalPackLists}</div>
            <CardDescription>Created and tracked</CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WeightDistributionChart data={analytics.weightDistribution} />
            <CategoryBreakdownChart data={analytics.categoryBreakdown} />
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <WeightGoals
            currentBaseWeight={analytics.averageBaseWeight}
            currentTotalWeight={analytics.averageBaseWeight * 1.3} // Rough estimate including worn/consumable
          />
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CategoryBreakdownChart data={analytics.categoryBreakdown} detailed />
            <Card>
              <CardHeader>
                <CardTitle>Heaviest Items by Category</CardTitle>
                <CardDescription>
                  Items with the highest weight-to-usage ratio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.topHeaviestItems.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.category} • Used in {item.usage} pack lists
                        </div>
                      </div>
                      <div className="text-lg font-bold">
                        {formatWeight(item.weight)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <WeightTrendsChart data={analytics.packListTrends} />
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <PackListComparison data={analytics.packListTrends} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

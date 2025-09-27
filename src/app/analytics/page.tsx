'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

import { BarChart3 } from 'lucide-react';

import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent } from '@/components/ui/card';

export default function AnalyticsPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="container py-6">Loading...</div>;
  }

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="container py-6">
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

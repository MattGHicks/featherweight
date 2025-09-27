'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { List, Package, Plus, Target, TrendingUp } from 'lucide-react';

import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div
        className="w-full min-h-screen flex items-center justify-center"
        style={{ padding: '2rem clamp(2rem, 5vw, 8rem)' }}
      >
        Loading...
      </div>
    );
  }

  if (!session) {
    redirect('/login');
  }

  return (
    <div
      className="w-full min-h-screen"
      style={{ padding: '2rem clamp(2rem, 5vw, 8rem)' }}
    >
      <PageHeader
        title={`Welcome back, ${session.user?.name || 'there'}!`}
        description="Here's an overview of your gear and pack lists"
      >
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/gear/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Gear
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/lists/new">
              <Plus className="mr-2 h-4 w-4" />
              New List
            </Link>
          </Button>
        </div>
      </PageHeader>

      <div
        className="grid gap-[2%] auto-fit-grid"
        style={{
          gridTemplateColumns:
            'repeat(auto-fit, minmax(clamp(200px, 20vw, 300px), 1fr))',
        }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Gear Items
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Start building your gear library
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pack Lists</CardTitle>
            <List className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Create your first pack list
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lightest Base Weight
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">No pack lists yet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Base Weight Goal
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">
              <Link href="/settings" className="text-primary hover:underline">
                Set your goal
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>

      <div
        className="grid gap-[2%]"
        style={{
          gridTemplateColumns:
            'repeat(auto-fit, minmax(clamp(300px, 40vw, 500px), 1fr))',
          marginTop: 'clamp(1.5rem, 3vw, 3rem)',
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Gear</CardTitle>
            <CardDescription>Your latest gear additions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                No gear items yet. Start building your gear library.
              </p>
              <Button asChild variant="outline">
                <Link href="/gear/new">Add Your First Gear Item</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Pack Lists</CardTitle>
            <CardDescription>Your latest pack list updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <List className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                No pack lists yet. Create your first list to start planning
                trips.
              </p>
              <Button asChild variant="outline">
                <Link href="/lists/new">Create Your First Pack List</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

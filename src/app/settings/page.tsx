'use client';

import { useState } from 'react';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

import { Settings, Target, User } from 'lucide-react';

import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserPreferences } from '@/contexts/user-preferences-context';
import {
  WEIGHT_UNITS,
  formatWeight,
  parseWeightInput,
} from '@/lib/weight-utils';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const { preferences, isLoading, updatePreferences } = useUserPreferences();
  const [baseWeightGoal, setBaseWeightGoal] = useState('');
  const [totalWeightGoal, setTotalWeightGoal] = useState('');

  if (status === 'loading') {
    return <div className="container px-4 md:px-6 py-6">Loading...</div>;
  }

  if (!session) {
    redirect('/login');
  }

  const handleUnitsChange = async (newUnits: string) => {
    if (preferences) {
      await updatePreferences({
        preferredUnits: newUnits as 'lbs' | 'oz' | 'kg' | 'g',
      });
    }
  };

  const handleGoalsUpdate = async () => {
    if (!preferences) return;

    const baseWeight = baseWeightGoal
      ? parseWeightInput(baseWeightGoal, preferences.preferredUnits)
      : null;
    const totalWeight = totalWeightGoal
      ? parseWeightInput(totalWeightGoal, preferences.preferredUnits)
      : null;

    await updatePreferences({
      baseWeightGoal: baseWeight,
      totalWeightGoal: totalWeight,
    });

    setBaseWeightGoal('');
    setTotalWeightGoal('');
  };

  return (
    <div className="container px-4 md:px-6 py-6">
      <PageHeader
        title="Settings"
        description="Manage your account preferences and application settings"
      />

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Information
              </CardTitle>
              <CardDescription>
                Manage your account details and authentication settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <p className="text-sm text-muted-foreground">
                    {session.user?.name || 'Not set'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-sm text-muted-foreground">
                    {session.user?.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Application Preferences
              </CardTitle>
              <CardDescription>
                Customize how the application displays information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="units">Weight Units</Label>
                <Select
                  disabled={isLoading}
                  value={preferences?.preferredUnits || 'lbs'}
                  onValueChange={handleUnitsChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select weight units" />
                  </SelectTrigger>
                  <SelectContent>
                    {WEIGHT_UNITS.map(unit => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  All weights will be displayed in your preferred units
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Weight Goals
              </CardTitle>
              <CardDescription>
                Set and track your base weight goals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {preferences && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="baseWeight">
                        Base Weight Goal ({preferences.preferredUnits})
                      </Label>
                      <Input
                        id="baseWeight"
                        type="number"
                        step="0.01"
                        placeholder={
                          preferences.baseWeightGoal
                            ? formatWeight(preferences.baseWeightGoal, {
                                unit: preferences.preferredUnits,
                                showUnit: false,
                              })
                            : 'Enter goal'
                        }
                        value={baseWeightGoal}
                        onChange={e => setBaseWeightGoal(e.target.value)}
                      />
                      {preferences.baseWeightGoal && (
                        <p className="text-sm text-muted-foreground">
                          Current goal:{' '}
                          {formatWeight(preferences.baseWeightGoal, {
                            unit: preferences.preferredUnits,
                          })}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="totalWeight">
                        Total Weight Goal ({preferences.preferredUnits})
                      </Label>
                      <Input
                        id="totalWeight"
                        type="number"
                        step="0.01"
                        placeholder={
                          preferences.totalWeightGoal
                            ? formatWeight(preferences.totalWeightGoal, {
                                unit: preferences.preferredUnits,
                                showUnit: false,
                              })
                            : 'Enter goal'
                        }
                        value={totalWeightGoal}
                        onChange={e => setTotalWeightGoal(e.target.value)}
                      />
                      {preferences.totalWeightGoal && (
                        <p className="text-sm text-muted-foreground">
                          Current goal:{' '}
                          {formatWeight(preferences.totalWeightGoal, {
                            unit: preferences.preferredUnits,
                          })}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={handleGoalsUpdate}
                    disabled={
                      isLoading || (!baseWeightGoal && !totalWeightGoal)
                    }
                  >
                    {isLoading ? 'Updating...' : 'Update Goals'}
                  </Button>

                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>
                      <strong>Base Weight:</strong> Weight of gear excluding
                      worn items and consumables
                    </p>
                    <p>
                      <strong>Total Weight:</strong> Weight of all gear
                      including worn items and consumables
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

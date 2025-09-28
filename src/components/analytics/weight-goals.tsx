'use client';

import { useEffect, useState } from 'react';

import { useSession } from 'next-auth/react';

import { Edit2, Save, Target, TrendingDown, TrendingUp, X } from 'lucide-react';

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
import { Progress } from '@/components/ui/progress';
import { formatWeight } from '@/lib/utils';

interface WeightGoalsProps {
  currentBaseWeight: number;
  currentTotalWeight: number;
}

interface UserGoals {
  baseWeightGoal?: number;
  totalWeightGoal?: number;
}

export function WeightGoals({
  currentBaseWeight,
  currentTotalWeight,
}: WeightGoalsProps) {
  const { data: session } = useSession();
  const [goals, setGoals] = useState<UserGoals>({});
  const [isEditing, setIsEditing] = useState(false);
  const [editGoals, setEditGoals] = useState<UserGoals>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchGoals();
  }, [session]);

  const fetchGoals = async () => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch('/api/user/goals');
      if (response.ok) {
        const data = await response.json();
        setGoals(data);
        setEditGoals(data);
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/user/goals', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editGoals),
      });

      if (response.ok) {
        const data = await response.json();
        setGoals(data);
        setIsEditing(false);
      } else {
        throw new Error('Failed to save goals');
      }
    } catch (error) {
      console.error('Error saving goals:', error);
      alert('Failed to save goals. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditGoals(goals);
    setIsEditing(false);
  };

  const calculateProgress = (current: number, goal?: number) => {
    if (!goal || goal === 0) return 0;
    return Math.min((current / goal) * 100, 100);
  };

  const getProgressColor = (current: number, goal?: number) => {
    if (!goal) return 'bg-muted';
    const progress = (current / goal) * 100;
    if (progress <= 80) return 'bg-green-500';
    if (progress <= 100) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatGoalInput = (value: string) => {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num * 453.592; // Convert lbs to grams
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Weight Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            Loading goals...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Weight Goals
            </CardTitle>
            <CardDescription>
              Set and track your ultralight weight targets
            </CardDescription>
          </div>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Goals
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="base-weight-goal">Base Weight Goal (lbs)</Label>
                <Input
                  id="base-weight-goal"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 10"
                  value={
                    editGoals.baseWeightGoal
                      ? (editGoals.baseWeightGoal / 453.592).toFixed(1)
                      : ''
                  }
                  onChange={e =>
                    setEditGoals({
                      ...editGoals,
                      baseWeightGoal: formatGoalInput(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="total-weight-goal">
                  Total Weight Goal (lbs)
                </Label>
                <Input
                  id="total-weight-goal"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 15"
                  value={
                    editGoals.totalWeightGoal
                      ? (editGoals.totalWeightGoal / 453.592).toFixed(1)
                      : ''
                  }
                  onChange={e =>
                    setEditGoals({
                      ...editGoals,
                      totalWeightGoal: formatGoalInput(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Goals'}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Base Weight Goal */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Base Weight Goal</h4>
                {goals.baseWeightGoal && (
                  <span className="text-sm text-muted-foreground">
                    Target: {formatWeight(goals.baseWeightGoal)}
                  </span>
                )}
              </div>

              {goals.baseWeightGoal ? (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Current: {formatWeight(currentBaseWeight)}</span>
                      <span className="flex items-center gap-1">
                        {currentBaseWeight <= goals.baseWeightGoal ? (
                          <>
                            <TrendingDown className="h-4 w-4 text-green-500" />
                            <span className="text-green-600">On target!</span>
                          </>
                        ) : (
                          <>
                            <TrendingUp className="h-4 w-4 text-orange-500" />
                            <span className="text-orange-600">
                              {formatWeight(
                                currentBaseWeight - goals.baseWeightGoal
                              )}{' '}
                              over
                            </span>
                          </>
                        )}
                      </span>
                    </div>
                    <Progress
                      value={calculateProgress(
                        currentBaseWeight,
                        goals.baseWeightGoal
                      )}
                      className="h-3"
                    />
                  </div>
                </>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No base weight goal set
                </div>
              )}
            </div>

            {/* Total Weight Goal */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Total Weight Goal</h4>
                {goals.totalWeightGoal && (
                  <span className="text-sm text-muted-foreground">
                    Target: {formatWeight(goals.totalWeightGoal)}
                  </span>
                )}
              </div>

              {goals.totalWeightGoal ? (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Current: {formatWeight(currentTotalWeight)}</span>
                      <span className="flex items-center gap-1">
                        {currentTotalWeight <= goals.totalWeightGoal ? (
                          <>
                            <TrendingDown className="h-4 w-4 text-green-500" />
                            <span className="text-green-600">On target!</span>
                          </>
                        ) : (
                          <>
                            <TrendingUp className="h-4 w-4 text-orange-500" />
                            <span className="text-orange-600">
                              {formatWeight(
                                currentTotalWeight - goals.totalWeightGoal
                              )}{' '}
                              over
                            </span>
                          </>
                        )}
                      </span>
                    </div>
                    <Progress
                      value={calculateProgress(
                        currentTotalWeight,
                        goals.totalWeightGoal
                      )}
                      className="h-3"
                    />
                  </div>
                </>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No total weight goal set
                </div>
              )}
            </div>

            {!goals.baseWeightGoal && !goals.totalWeightGoal && (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">Set Your Weight Goals</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Track your progress towards ultralight targets
                </p>
                <Button onClick={() => setIsEditing(true)}>
                  <Target className="h-4 w-4 mr-2" />
                  Set Goals
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

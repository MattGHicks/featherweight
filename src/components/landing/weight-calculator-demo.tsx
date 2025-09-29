'use client';

import { useState } from 'react';

import {
  Award,
  Calculator,
  CheckCircle,
  Circle,
  Scale,
  Target,
  TrendingDown,
  Zap,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface GearItem {
  id: string;
  name: string;
  category: string;
  weight: number; // in grams
  isWorn: boolean;
  isConsumable: boolean;
  isIncluded: boolean;
}

function WeightDisplay({ grams }: { grams: number }) {
  const pounds = (grams / 453.592).toFixed(1);
  const ounces = (grams / 28.3495).toFixed(1);

  return (
    <div className="text-right">
      <div className="font-mono text-lg font-semibold">{pounds} lbs</div>
      <div className="text-xs text-muted-foreground">{ounces} oz</div>
    </div>
  );
}

export function WeightCalculatorDemo() {
  const [sampleItems, setSampleItems] = useState<GearItem[]>([
    {
      id: '1',
      name: 'Big Agnes Copper Spur HV UL2',
      category: 'Shelter',
      weight: 1090,
      isWorn: false,
      isConsumable: false,
      isIncluded: true,
    },
    {
      id: '2',
      name: 'Western Mountaineering UltraLite',
      category: 'Sleep System',
      weight: 794,
      isWorn: false,
      isConsumable: false,
      isIncluded: true,
    },
    {
      id: '3',
      name: 'Thermarest NeoAir XLite',
      category: 'Sleep System',
      weight: 350,
      isWorn: false,
      isConsumable: false,
      isIncluded: true,
    },
    {
      id: '4',
      name: 'Osprey Exos 58',
      category: 'Backpack',
      weight: 1100,
      isWorn: false,
      isConsumable: false,
      isIncluded: true,
    },
    {
      id: '5',
      name: 'Patagonia Houdini Jacket',
      category: 'Clothing',
      weight: 95,
      isWorn: true,
      isConsumable: false,
      isIncluded: true,
    },
    {
      id: '6',
      name: 'Anker PowerCore 10000',
      category: 'Electronics',
      weight: 180,
      isWorn: false,
      isConsumable: false,
      isIncluded: true,
    },
    {
      id: '7',
      name: 'Jetboil Flash',
      category: 'Cooking',
      weight: 371,
      isWorn: false,
      isConsumable: false,
      isIncluded: false,
    },
    {
      id: '8',
      name: 'Mountain House Meal (2 days)',
      category: 'Food',
      weight: 800,
      isWorn: false,
      isConsumable: true,
      isIncluded: false,
    },
  ]);

  const [goalWeight] = useState(6800); // 15 lbs in grams
  const [isAnimating, setIsAnimating] = useState(false);

  const totalWeight = sampleItems
    .filter(item => item.isIncluded)
    .reduce((sum, item) => sum + item.weight, 0);

  const baseWeight = sampleItems
    .filter(item => item.isIncluded && !item.isWorn && !item.isConsumable)
    .reduce((sum, item) => sum + item.weight, 0);

  const toggleItem = (id: string) => {
    setIsAnimating(true);
    setSampleItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isIncluded: !item.isIncluded } : item
      )
    );
    setTimeout(() => setIsAnimating(false), 300);
  };

  const resetDemo = () => {
    setSampleItems(prev => prev.map(item => ({ ...item, isIncluded: true })));
  };

  const optimizeWeight = () => {
    setSampleItems(prev =>
      prev.map(item => {
        // Keep essential items, remove some optional ones
        if (item.category === 'Cooking' || item.category === 'Food') {
          return { ...item, isIncluded: false };
        }
        return item;
      })
    );
  };

  const progressPercentage = Math.min(100, (baseWeight / goalWeight) * 100);
  const isUnderGoal = baseWeight <= goalWeight;

  return (
    <section
      className="w-full bg-gradient-to-br from-green-50 to-blue-50"
      style={{ padding: 'clamp(4rem, 8vw, 8rem) clamp(2rem, 5vw, 8rem)' }}
    >
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-6">
            <Calculator className="h-4 w-4" />
            Interactive Demo
          </div>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
            Try Our Weight Calculator
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            See how easy it is to calculate and optimize your pack weight.
            Toggle items on and off to see real-time weight changes.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Items List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5" />
                  Sample Pack List
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Toggle items to see how they affect your total weight
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {sampleItems.map(item => (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between p-4 border-b transition-all duration-300 ${
                        item.isIncluded
                          ? 'bg-background'
                          : 'bg-muted/30 opacity-60'
                      } ${isAnimating ? 'scale-[0.99]' : 'scale-100'}`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleItem(item.id)}
                          className="flex items-center justify-center w-5 h-5 transition-colors"
                        >
                          {item.isIncluded ? (
                            <CheckCircle className="h-5 w-5 text-primary" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground" />
                          )}
                        </button>

                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <span>{item.category}</span>
                            {item.isWorn && (
                              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                                Worn
                              </span>
                            )}
                            {item.isConsumable && (
                              <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full">
                                Consumable
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <WeightDisplay grams={item.weight} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4">
              <Button onClick={optimizeWeight} variant="outline" size="sm">
                <Zap className="h-4 w-4 mr-2" />
                Quick Optimize
              </Button>
              <Button onClick={resetDemo} variant="outline" size="sm">
                Reset Demo
              </Button>
            </div>
          </div>

          {/* Right Column - Weight Summary */}
          <div className="space-y-6">
            {/* Total Weight Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Pack Weight Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Total Weight */}
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">
                    <WeightDisplay grams={totalWeight} />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Weight
                  </div>
                </div>

                {/* Base Weight Progress */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">
                      Base Weight Goal
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {(baseWeight / 453.592).toFixed(1)} /{' '}
                      {(goalWeight / 453.592).toFixed(1)} lbs
                    </span>
                  </div>
                  <Progress
                    value={progressPercentage}
                    className={`h-2 ${isUnderGoal ? '[&>div]:bg-green-500' : '[&>div]:bg-red-500'}`}
                  />
                  <div className="flex items-center gap-2 mt-2 text-sm">
                    {isUnderGoal ? (
                      <>
                        <Award className="h-4 w-4 text-green-600" />
                        <span className="text-green-600 font-medium">
                          Under goal!
                        </span>
                      </>
                    ) : (
                      <>
                        <Target className="h-4 w-4 text-red-600" />
                        <span className="text-red-600 font-medium">
                          {(baseWeight - goalWeight) / 28.35 > 0 ? '+' : ''}
                          {((baseWeight - goalWeight) / 28.35).toFixed(1)} oz
                          over
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Weight Breakdown */}
                <div className="space-y-3 pt-3 border-t">
                  <div className="flex justify-between text-sm">
                    <span>Base Weight</span>
                    <WeightDisplay grams={baseWeight} />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Worn Weight</span>
                    <WeightDisplay
                      grams={sampleItems
                        .filter(item => item.isIncluded && item.isWorn)
                        .reduce((sum, item) => sum + item.weight, 0)}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Consumables</span>
                    <WeightDisplay
                      grams={sampleItems
                        .filter(item => item.isIncluded && item.isConsumable)
                        .reduce((sum, item) => sum + item.weight, 0)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Optimization Tip */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-blue-800">
                  <TrendingDown className="h-5 w-5" />
                  Weight Tip
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-700 mb-3">
                  {isUnderGoal
                    ? "Great job! You're under your base weight goal. Consider what items you could leave behind for an even lighter pack."
                    : 'Try removing non-essential items or finding lighter alternatives to reach your goal weight.'}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  Get AI Suggestions
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-lg p-8 shadow-lg max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-4">
              Ready to Optimize Your Real Pack?
            </h3>
            <p className="text-muted-foreground mb-6">
              Create your account and start building your actual gear library
              with our AI-powered tools.
            </p>
            <Button size="lg" asChild>
              <a href="/signup">
                Start Your Free Account
                <Scale className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

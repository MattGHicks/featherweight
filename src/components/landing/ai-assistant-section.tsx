'use client';

import { useState } from 'react';

import {
  ArrowRight,
  Brain,
  ChevronRight,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface BeforeAfterProps {
  before: {
    name: string;
    weight: string;
    category: string;
    description?: string;
  };
  after: {
    name: string;
    weight: string;
    category: string;
    description: string;
    confidence: number;
    suggestions: string[];
  };
}

function BeforeAfterDemo({ before, after }: BeforeAfterProps) {
  const [isTransformed, setIsTransformed] = useState(false);

  return (
    <div className="relative">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Before */}
        <Card className="relative">
          <div className="absolute top-3 right-3">
            <div className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">
              Manual Entry
            </div>
          </div>
          <CardContent className="p-6">
            <h4 className="font-medium mb-4 text-muted-foreground">
              Before AI
            </h4>
            <div className="space-y-3">
              <div className="text-lg font-semibold">{before.name}</div>
              <div className="text-2xl font-bold text-red-600">
                {before.weight}
              </div>
              <div className="text-sm text-muted-foreground">
                Category: {before.category || 'Unknown'}
              </div>
              {before.description ? (
                <div className="text-sm">{before.description}</div>
              ) : (
                <div className="text-sm text-muted-foreground italic">
                  No description provided
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Arrow */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block">
          <Button
            onClick={() => setIsTransformed(!isTransformed)}
            size="sm"
            className="rounded-full w-12 h-12 p-0"
          >
            {isTransformed ? (
              <Sparkles className="h-5 w-5" />
            ) : (
              <ArrowRight className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* After */}
        <Card
          className={`relative transition-all duration-500 ${isTransformed ? 'ring-2 ring-primary shadow-lg scale-105' : ''}`}
        >
          <div className="absolute top-3 right-3">
            <div className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              AI Enriched
            </div>
          </div>
          <CardContent className="p-6">
            <h4 className="font-medium mb-4 text-green-700">
              After AI Enhancement
            </h4>
            <div className="space-y-3">
              <div className="text-lg font-semibold">{after.name}</div>
              <div className="text-2xl font-bold text-green-600">
                {after.weight}
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm">Category: {after.category}</div>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <div className="text-xs text-green-600 font-medium">
                  {Math.round(after.confidence * 100)}% confident
                </div>
              </div>
              <div className="text-sm">{after.description}</div>

              {isTransformed && after.suggestions.length > 0 && (
                <div className="pt-2 border-t">
                  <div className="text-xs font-medium mb-2 text-primary">
                    AI Suggestions:
                  </div>
                  <div className="space-y-1">
                    {after.suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="text-xs text-muted-foreground flex items-center gap-1"
                      >
                        <ChevronRight className="h-3 w-3" />
                        {suggestion}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Transform Button */}
      <div className="md:hidden mt-4 text-center">
        <Button
          onClick={() => setIsTransformed(!isTransformed)}
          variant="outline"
          size="sm"
        >
          {isTransformed ? 'Show Original' : 'See AI Enhancement'}
          <Sparkles className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function AIAssistantSection() {
  const examples = [
    {
      before: {
        name: 'Tent',
        weight: '? grams',
        category: 'Unknown',
      },
      after: {
        name: 'Big Agnes Copper Spur HV UL2',
        weight: '1,090g (2.4 lbs)',
        category: 'Shelter',
        description:
          'Big Agnes Copper Spur HV UL2 ultralight 2-person tent with vestibules. Features DAC Featherlite NSL pole configuration and proprietary tent fabrics for durability.',
        confidence: 0.95,
        suggestions: [
          'Consider Zpacks Duplex for 680g (-410g savings)',
          'Check for current year model updates',
          'Compare with similar 2P ultralight options',
        ],
      },
    },
    {
      before: {
        name: 'Power bank',
        weight: '200g',
        category: 'Electronics',
        description: 'Portable charger',
      },
      after: {
        name: 'Anker PowerCore 10000',
        weight: '180g (6.4 oz)',
        category: 'Electronics',
        description:
          'Anker PowerCore 10000 portable charger with 10,000mAh capacity. Ultra-compact design with PowerIQ and VoltageBoost technology for optimized charging.',
        confidence: 0.88,
        suggestions: [
          'Nitecore NB10000 available at 150g (-30g)',
          'Consider power needs vs weight trade-off',
          'Solar panel integration options available',
        ],
      },
    },
  ];

  return (
    <section
      className="w-full bg-gradient-to-br from-primary/5 to-transparent"
      style={{ padding: 'clamp(4rem, 8vw, 8rem) clamp(2rem, 5vw, 8rem)' }}
    >
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Brain className="h-4 w-4" />
            Powered by AI
          </div>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
            Your AI-Powered Gear Assistant
          </h2>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Stop guessing about your gear specs. Our AI assistant automatically
            enriches your gear data with accurate weights, detailed
            descriptions, and intelligent optimization suggestions – all in
            seconds.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <Zap className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold mb-3">Instant Recognition</h3>
            <p className="text-sm text-muted-foreground">
              Just type a gear name and watch AI identify exact models, weights,
              and specifications automatically.
            </p>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <Target className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold mb-3">Smart Suggestions</h3>
            <p className="text-sm text-muted-foreground">
              Get personalized recommendations for lighter alternatives based on
              your gear and weight goals.
            </p>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <Brain className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold mb-3">Continuous Learning</h3>
            <p className="text-sm text-muted-foreground">
              Our AI learns from thousands of gear items to provide increasingly
              accurate recommendations.
            </p>
          </Card>
        </div>

        {/* Interactive Demo */}
        <div className="space-y-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">
              See AI Enhancement in Action
            </h3>
            <p className="text-muted-foreground mb-8">
              Click the arrows below to see how AI transforms basic gear entries
              into detailed, actionable data
            </p>
          </div>

          {examples.map((example, index) => (
            <div key={index} className="max-w-4xl mx-auto">
              <BeforeAfterDemo {...example} />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Button size="lg" asChild>
            <a href="/signup">
              Try AI Assistant Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
          <p className="text-sm text-muted-foreground mt-3">
            No credit card required • AI-powered from day one
          </p>
        </div>
      </div>
    </section>
  );
}

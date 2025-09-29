'use client';

import { useState } from 'react';

import {
  ArrowRight,
  BarChart3,
  Camera,
  CheckCircle,
  Play,
  Plus,
  Sparkles,
  Target,
  UserPlus,
  Zap,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Step {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  details: string[];
  image: string;
  color: string;
}

interface StepCardProps {
  step: Step;
  isActive: boolean;
  onClick: () => void;
}

function StepCard({ step, isActive, onClick }: StepCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all duration-300 ${
        isActive
          ? 'ring-2 ring-primary shadow-lg scale-105'
          : 'hover:shadow-md hover:scale-102'
      }`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          {/* Step Number */}
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${step.color}`}
          >
            {step.number}
          </div>

          {/* Icon */}
          <div className="text-primary">{step.icon}</div>
        </div>

        <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
        <p className="text-muted-foreground text-sm mb-4">{step.description}</p>

        {/* Details (show when active) */}
        {isActive && (
          <div className="space-y-2 animate-in slide-in-from-top-1 duration-300">
            {step.details.map((detail, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span>{detail}</span>
              </div>
            ))}
          </div>
        )}

        {/* Arrow indicator */}
        <div className="flex justify-end mt-4">
          <ArrowRight
            className={`h-4 w-4 transition-colors ${
              isActive ? 'text-primary' : 'text-muted-foreground'
            }`}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function MockInterface({ step }: { step: Step }) {
  const interfaces = {
    // Sign Up
    1: (
      <div className="bg-white rounded-lg border-2 shadow-lg overflow-hidden">
        <div className="bg-primary text-primary-foreground p-4 text-center">
          <h3 className="font-semibold">Welcome to Featherweight!</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="h-8 w-8 text-primary" />
            </div>
            <h4 className="font-medium mb-2">Create Your Account</h4>
            <p className="text-sm text-muted-foreground">
              Start optimizing your gear in seconds
            </p>
          </div>
          <div className="space-y-3">
            <Button className="w-full">Sign Up with Google</Button>
            <Button variant="outline" className="w-full">
              Sign Up with Email
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            ✓ Free forever plan • ✓ No credit card required
          </p>
        </div>
      </div>
    ),
    // Add Gear
    2: (
      <div className="bg-white rounded-lg border-2 shadow-lg overflow-hidden">
        <div className="bg-blue-50 border-b p-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Gear Item
          </h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center bg-blue-50">
            <Camera className="h-12 w-12 text-blue-600 mx-auto mb-3" />
            <p className="font-medium text-blue-800">
              Take a photo or drag image here
            </p>
            <p className="text-sm text-blue-600 mt-1">
              AI will identify your gear automatically
            </p>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            — OR —
          </div>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Type gear name (e.g., 'Big Agnes Copper Spur')"
              className="w-full p-3 border rounded-lg"
            />
            <Button className="w-full">
              <Sparkles className="h-4 w-4 mr-2" />
              Let AI Fill Details
            </Button>
          </div>
        </div>
      </div>
    ),
    // AI Enhancement
    3: (
      <div className="bg-white rounded-lg border-2 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-b p-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            AI Enhancement Complete
          </h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">
                Gear Identified
              </span>
            </div>
            <div className="text-sm space-y-1">
              <div>
                <strong>Name:</strong> Big Agnes Copper Spur HV UL2
              </div>
              <div>
                <strong>Weight:</strong> 1,090g (2.4 lbs)
              </div>
              <div>
                <strong>Category:</strong> Shelter
              </div>
              <div>
                <strong>Confidence:</strong> 95%
              </div>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="text-sm text-blue-800">
              <strong>💡 AI Suggestion:</strong> Consider Zpacks Duplex for 410g
              weight savings
            </div>
          </div>
        </div>
      </div>
    ),
    // Pack Lists
    4: (
      <div className="bg-white rounded-lg border-2 shadow-lg overflow-hidden">
        <div className="bg-orange-50 border-b p-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Plus className="h-5 w-5 text-orange-600" />
            Create Pack List
          </h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded">
              <div>
                <div className="font-medium">Summer Backpacking</div>
                <div className="text-sm text-muted-foreground">3-day trip</div>
              </div>
              <div className="text-right">
                <div className="font-bold">12.4 lbs</div>
                <div className="text-sm text-green-600">✓ Under goal</div>
              </div>
            </div>
            <div className="text-center p-4 border-2 border-dashed rounded-lg">
              <p className="text-sm text-muted-foreground">
                Drag gear items here to add to pack
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
    // Analytics
    5: (
      <div className="bg-white rounded-lg border-2 shadow-lg overflow-hidden">
        <div className="bg-purple-50 border-b p-4">
          <h3 className="font-semibold flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            Pack Analytics
          </h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">12.4 lbs</div>
              <div className="text-xs text-muted-foreground">Base Weight</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">28%</div>
              <div className="text-xs text-muted-foreground">Under Goal</div>
            </div>
          </div>
          <div className="h-3 bg-muted rounded-full">
            <div className="h-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full w-3/4"></div>
          </div>
          <div className="text-sm text-green-600 text-center">
            ✨ Great job! You&apos;re ahead of your 15lb goal
          </div>
        </div>
      </div>
    ),
  };

  return interfaces[step.number as keyof typeof interfaces] || null;
}

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const steps: Step[] = [
    {
      number: 1,
      icon: <UserPlus className="h-6 w-6" />,
      title: 'Create Your Account',
      description:
        'Sign up in seconds with Google, GitHub, or email. No credit card required.',
      details: [
        'Multiple sign-in options available',
        'Free account with full features',
        'Secure authentication with NextAuth',
        'Start using immediately',
      ],
      image: 'signup',
      color: 'bg-blue-500',
    },
    {
      number: 2,
      icon: <Camera className="h-6 w-6" />,
      title: 'Add Your Gear',
      description:
        'Take photos, upload images, or simply type gear names. Multiple ways to build your library.',
      details: [
        'Camera integration for mobile',
        'Drag & drop file uploads',
        'Type gear names manually',
        'Bulk import from CSV',
      ],
      image: 'camera',
      color: 'bg-green-500',
    },
    {
      number: 3,
      icon: <Sparkles className="h-6 w-6" />,
      title: 'AI Enriches Data',
      description:
        'Watch as AI automatically fills in weights, specs, and suggests optimizations.',
      details: [
        'Automatic weight detection',
        'Brand and model identification',
        'Category auto-assignment',
        'Smart recommendations',
      ],
      image: 'ai',
      color: 'bg-purple-500',
    },
    {
      number: 4,
      icon: <Plus className="h-6 w-6" />,
      title: 'Create Pack Lists',
      description:
        'Build multiple pack configurations for different trips and seasons.',
      details: [
        'Unlimited pack lists',
        'Drag & drop interface',
        'Real-time weight calculations',
        'Trip-specific configurations',
      ],
      image: 'pack-list',
      color: 'bg-orange-500',
    },
    {
      number: 5,
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'Analyze & Optimize',
      description:
        'Use advanced analytics to track progress and discover weight-saving opportunities.',
      details: [
        'Interactive weight charts',
        'Goal progress tracking',
        'Category breakdowns',
        'Optimization suggestions',
      ],
      image: 'analytics',
      color: 'bg-indigo-500',
    },
  ];

  const startAutoPlay = () => {
    setIsAutoPlaying(true);
    let currentStep = 1;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep > 5) {
        currentStep = 1;
      }
      setActiveStep(currentStep);
    }, 3000);

    // Stop after one complete cycle
    setTimeout(() => {
      clearInterval(interval);
      setIsAutoPlaying(false);
    }, 15000);
  };

  return (
    <section
      className="w-full"
      style={{ padding: 'clamp(4rem, 8vw, 8rem) clamp(2rem, 5vw, 8rem)' }}
    >
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            Simple Process
          </div>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
            How Featherweight Works
          </h2>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            From gear entry to weight optimization, see how easy it is to
            achieve your ultralight backpacking goals.
          </p>

          <Button
            onClick={startAutoPlay}
            variant="outline"
            className="mb-12"
            disabled={isAutoPlaying}
          >
            <Play className="h-4 w-4 mr-2" />
            {isAutoPlaying ? 'Auto-playing...' : 'See It In Action'}
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Steps */}
          <div className="space-y-4">
            {steps.map(step => (
              <StepCard
                key={step.number}
                step={step}
                isActive={activeStep === step.number}
                onClick={() => setActiveStep(step.number)}
              />
            ))}
          </div>

          {/* Right Column - Mock Interface */}
          <div className="sticky top-8">
            <div className="aspect-[4/3] flex items-center justify-center bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl p-8">
              <MockInterface step={steps.find(s => s.number === activeStep)!} />
            </div>

            {/* Step Indicator */}
            <div className="flex justify-center mt-6">
              <div className="flex gap-2">
                {steps.map(step => (
                  <button
                    key={step.number}
                    onClick={() => setActiveStep(step.number)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      activeStep === step.number
                        ? 'bg-primary'
                        : 'bg-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Start Your Ultralight Journey?
            </h3>
            <p className="text-muted-foreground mb-8">
              Join thousands of backpackers who have already optimized their
              gear and achieved their weight goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="/login">Sign In</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

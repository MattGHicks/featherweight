'use client';

import { useState } from 'react';

import {
  BarChart3,
  Camera,
  ChevronRight,
  Download,
  Scale,
  Share,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
  color: string;
  gradientFrom: string;
  gradientTo: string;
}

interface FeatureCardProps {
  feature: Feature;
  index: number;
  isHovered: boolean;
  onHover: (index: number | null) => void;
}

function FeatureCard({ feature, index, isHovered, onHover }: FeatureCardProps) {
  return (
    <Card
      className={`group cursor-pointer transition-all duration-300 hover:shadow-xl border-2 ${
        isHovered
          ? 'border-primary/30 shadow-lg scale-105'
          : 'border-muted hover:border-primary/20'
      }`}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
    >
      <CardHeader className="p-6">
        {/* Icon with gradient background */}
        <div
          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradientFrom} ${feature.gradientTo} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
        >
          <div className="text-white">{feature.icon}</div>
        </div>

        <CardTitle className="text-xl mb-3 group-hover:text-primary transition-colors">
          {feature.title}
        </CardTitle>

        <CardDescription className="text-base leading-relaxed mb-4">
          {feature.description}
        </CardDescription>

        {/* Benefits List */}
        {isHovered && (
          <div className="space-y-2 animate-in slide-in-from-top-1 duration-300">
            {feature.benefits.map((benefit, benefitIndex) => (
              <div
                key={benefitIndex}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <ChevronRight className="h-3 w-3 text-primary" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        )}

        {/* Learn More Button */}
        <div
          className={`transition-all duration-300 ${
            isHovered
              ? 'opacity-100 transform translate-y-0'
              : 'opacity-0 transform translate-y-2'
          }`}
        >
          <Button
            variant="ghost"
            size="sm"
            className="mt-3 p-0 h-auto text-primary hover:text-primary/80"
          >
            Learn more <ChevronRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}

export function FeaturesGrid() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const features: Feature[] = [
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: 'AI-Powered Assistant',
      description:
        'Instantly enrich your gear data with accurate weights, specs, and intelligent suggestions.',
      benefits: [
        'Automatic gear identification',
        'Precise weight detection',
        'Smart categorization',
        'Alternative recommendations',
      ],
      color: 'text-primary',
      gradientFrom: 'from-blue-500',
      gradientTo: 'to-purple-600',
    },
    {
      icon: <Camera className="h-8 w-8" />,
      title: 'Visual Gear Library',
      description:
        'Capture photos of your gear with your phone or upload from your computer for easy identification.',
      benefits: [
        'Mobile camera integration',
        'Drag & drop uploads',
        'Multiple file support',
        'Offline photo storage',
      ],
      color: 'text-green-600',
      gradientFrom: 'from-green-500',
      gradientTo: 'to-teal-600',
    },
    {
      icon: <Scale className="h-8 w-8" />,
      title: 'Smart Pack Lists',
      description:
        'Create multiple pack configurations with real-time weight calculations and goal tracking.',
      benefits: [
        'Multiple pack configurations',
        'Real-time weight totals',
        'Base weight calculations',
        'Goal progress tracking',
      ],
      color: 'text-orange-600',
      gradientFrom: 'from-orange-500',
      gradientTo: 'to-red-600',
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: 'Advanced Analytics',
      description:
        'Visualize weight distribution, track progress, and discover optimization opportunities.',
      benefits: [
        'Weight distribution charts',
        'Category breakdowns',
        'Progress tracking',
        'Optimization insights',
      ],
      color: 'text-purple-600',
      gradientFrom: 'from-purple-500',
      gradientTo: 'to-pink-600',
    },
    {
      icon: <Share className="h-8 w-8" />,
      title: 'Community Sharing',
      description:
        'Share your pack lists publicly, get feedback, and discover gear setups from other backpackers.',
      benefits: [
        'Public pack list sharing',
        'Community feedback',
        'Discover new setups',
        'Social engagement',
      ],
      color: 'text-teal-600',
      gradientFrom: 'from-teal-500',
      gradientTo: 'to-cyan-600',
    },
    {
      icon: <Download className="h-8 w-8" />,
      title: 'Export & Backup',
      description:
        'Export your data to CSV, PDF, or other formats. Never lose your carefully curated gear data.',
      benefits: [
        'CSV/PDF export',
        'Printable pack lists',
        'Data backup',
        'Multiple formats',
      ],
      color: 'text-indigo-600',
      gradientFrom: 'from-indigo-500',
      gradientTo: 'to-blue-600',
    },
  ];

  return (
    <section
      className="w-full bg-muted/30"
      style={{ padding: 'clamp(4rem, 8vw, 8rem) clamp(2rem, 5vw, 8rem)' }}
    >
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            Complete Feature Set
          </div>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
            Everything You Need for Ultralight Success
          </h2>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From AI-powered gear recognition to advanced analytics,
            Featherweight provides comprehensive tools to optimize every ounce
            of your pack weight.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              feature={feature}
              index={index}
              isHovered={hoveredIndex === index}
              onHover={setHoveredIndex}
            />
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-20 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">1,250+</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-green-600">28%</div>
              <div className="text-sm text-muted-foreground">
                Avg Weight Savings
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-orange-600">15,000+</div>
              <div className="text-sm text-muted-foreground">
                Gear Items Tracked
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-purple-600">500+</div>
              <div className="text-sm text-muted-foreground">
                Pack Lists Created
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button size="lg" asChild>
            <a href="/signup">
              Explore All Features
              <Target className="ml-2 h-5 w-5" />
            </a>
          </Button>
          <p className="text-sm text-muted-foreground mt-3">
            Start with our free plan • No credit card required
          </p>
        </div>
      </div>
    </section>
  );
}

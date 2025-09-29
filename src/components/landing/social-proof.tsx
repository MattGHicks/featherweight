'use client';

import { Award, Quote, Star, TrendingDown, Users } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

interface Testimonial {
  name: string;
  location: string;
  avatar: string;
  rating: number;
  weightSaved: string;
  quote: string;
  trip: string;
}

interface StatProps {
  number: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ number, label, icon, color }: StatProps) {
  return (
    <div className="text-center space-y-2">
      <div
        className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mx-auto mb-3`}
      >
        {icon}
      </div>
      <div className="text-3xl font-bold">{number}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        {/* Quote */}
        <div className="relative mb-6">
          <Quote className="absolute -top-2 -left-1 h-8 w-8 text-primary/20" />
          <p className="text-muted-foreground italic pl-6 leading-relaxed">
            &ldquo;{testimonial.quote}&rdquo;
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < testimonial.rating
                  ? 'text-yellow-500 fill-yellow-500'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Weight Saved Badge */}
        <div className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
          <TrendingDown className="h-3 w-3" />
          Saved {testimonial.weightSaved}
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
            {testimonial.name
              .split(' ')
              .map(n => n[0])
              .join('')}
          </div>
          <div>
            <div className="font-semibold text-sm">{testimonial.name}</div>
            <div className="text-xs text-muted-foreground">
              {testimonial.location}
            </div>
            <div className="text-xs text-primary">{testimonial.trip}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SocialProof() {
  const stats = [
    {
      number: '1,250+',
      label: 'Active Users',
      icon: <Users className="h-6 w-6 text-white" />,
      color: 'bg-blue-500',
    },
    {
      number: '28%',
      label: 'Avg Weight Savings',
      icon: <TrendingDown className="h-6 w-6 text-white" />,
      color: 'bg-green-500',
    },
    {
      number: '15,000+',
      label: 'Gear Items Tracked',
      icon: <Award className="h-6 w-6 text-white" />,
      color: 'bg-orange-500',
    },
    {
      number: '500+',
      label: 'Pack Lists Created',
      icon: <Star className="h-6 w-6 text-white" />,
      color: 'bg-purple-500',
    },
  ];

  const testimonials: Testimonial[] = [
    {
      name: 'Sarah Chen',
      location: 'Portland, OR',
      avatar: 'SC',
      rating: 5,
      weightSaved: '3.2 lbs',
      quote:
        'The AI gear recognition saved me hours of manual data entry. I just uploaded photos of my gear closet and everything was cataloged automatically with accurate weights and specs.',
      trip: 'Pacific Crest Trail Section',
    },
    {
      name: 'Mike Rodriguez',
      location: 'Denver, CO',
      avatar: 'MR',
      rating: 5,
      weightSaved: '4.7 lbs',
      quote:
        'Finally hit my sub-15lb base weight goal! The analytics showed me exactly which items were holding me back. The AI suggestions for lighter alternatives were spot-on.',
      trip: 'Colorado Trail Thru-hike',
    },
    {
      name: 'Emma Thompson',
      location: 'Asheville, NC',
      avatar: 'ET',
      rating: 5,
      weightSaved: '2.1 lbs',
      quote:
        'Love how I can create different pack lists for summer vs winter trips. The weight calculator helps me stay within airline limits too. Game changer for international hiking!',
      trip: 'Appalachian Trail Section',
    },
    {
      name: 'David Park',
      location: 'Seattle, WA',
      avatar: 'DP',
      rating: 5,
      weightSaved: '5.3 lbs',
      quote:
        'The visual gear library with photos is perfect for remembering what I own. No more buying duplicate gear! The AI even suggested I already owned a lighter alternative.',
      trip: 'Wonderland Trail',
    },
    {
      name: 'Lisa Martinez',
      location: 'Boulder, CO',
      avatar: 'LM',
      rating: 5,
      weightSaved: '1.8 lbs',
      quote:
        'Sharing my pack lists with hiking partners made trip planning so much easier. Everyone could see the weight distribution and suggest improvements before we hit the trail.',
      trip: 'John Muir Trail',
    },
    {
      name: 'Tom Wilson',
      location: 'Salt Lake City, UT',
      avatar: 'TW',
      rating: 5,
      weightSaved: '6.2 lbs',
      quote:
        'Been using spreadsheets for years but this is so much better. The mobile app lets me weigh gear on the go, and the AI fills in all the details I used to research manually.',
      trip: 'High Sierra Camps Loop',
    },
  ];

  return (
    <section
      className="w-full bg-gradient-to-br from-muted/30 to-muted/10"
      style={{ padding: 'clamp(4rem, 8vw, 8rem) clamp(2rem, 5vw, 8rem)' }}
    >
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-6">
            <Users className="h-4 w-4" />
            Trusted by Backpackers
          </div>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
            Join the Ultralight Community
          </h2>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Thousands of backpackers have already optimized their gear and
            achieved their weight goals with Featherweight. Here&apos;s what
            they&apos;re saying about their experience.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Testimonials Header */}
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold mb-4">What Our Users Say</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real stories from backpackers who have transformed their gear
            management and achieved their ultralight goals.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>

        {/* Success Stories Summary */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border border-green-200">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Award className="h-6 w-6 text-green-600" />
              <h3 className="text-xl font-bold text-green-800">
                Community Success
              </h3>
            </div>

            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-green-700 mb-1">
                  23.5 lbs
                </div>
                <div className="text-sm text-green-600">
                  Total weight saved by community
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-700 mb-1">
                  4.8/5
                </div>
                <div className="text-sm text-blue-600">Average user rating</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-700 mb-1">
                  92%
                </div>
                <div className="text-sm text-purple-600">
                  Users reach weight goals
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mt-6 max-w-2xl mx-auto">
              Join a community of weight-conscious backpackers who are serious
              about their gear optimization. From weekend warriors to
              thru-hikers, Featherweight helps everyone achieve their ultralight
              goals.
            </p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="text-center mt-12">
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Free to start</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <span>Export your data anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

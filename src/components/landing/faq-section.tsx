'use client';

import { useState } from 'react';

import { ChevronDown, HelpCircle } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface FAQ {
  question: string;
  answer: string;
  category: 'general' | 'pricing' | 'features' | 'technical';
}

interface FAQItemProps {
  faq: FAQ;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ faq, isOpen, onToggle }: FAQItemProps) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CollapsibleTrigger className="w-full">
          <CardContent className="p-6 text-left">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg pr-4">{faq.question}</h3>
              <ChevronDown
                className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </div>
          </CardContent>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="px-6 pb-6 pt-0">
            <div className="text-muted-foreground leading-relaxed">
              {faq.answer}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

export function FAQSection() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0])); // First item open by default

  const toggleItem = (index: number) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const faqs: FAQ[] = [
    {
      question: 'Is Featherweight really free?',
      answer:
        'Yes! Our core features including gear management, pack lists, basic analytics, and AI assistance are completely free forever. We may offer premium features in the future for advanced users, but the essential tools for weight optimization will always be available at no cost.',
      category: 'pricing',
    },
    {
      question: 'How accurate is the AI gear recognition?',
      answer:
        'Our AI achieves 90%+ accuracy on common outdoor gear items. It has been trained on thousands of gear specifications from major brands. For specific products with clear brand/model names, accuracy is typically 95%+. The system also provides confidence scores so you know how reliable the data is.',
      category: 'features',
    },
    {
      question: 'Can I use this without taking photos of my gear?',
      answer:
        'Absolutely! While photos help with organization and AI recognition, you can manually enter gear names and let AI fill in the details, or input all information manually. The photo feature is optional but recommended for the best experience.',
      category: 'general',
    },
    {
      question: 'Does the mobile app work offline?',
      answer:
        "Basic functionality like viewing your gear library and pack lists works offline. However, AI features, image uploads, and data sync require an internet connection. We cache your data locally so you can always access what you've already loaded.",
      category: 'technical',
    },
    {
      question: 'How do you determine gear weights so accurately?',
      answer:
        'Our AI cross-references multiple data sources including manufacturer specifications, retailer listings, and community databases. We prioritize official manufacturer weights when available and use statistical modeling for items where exact weights vary by size or year.',
      category: 'features',
    },
    {
      question: 'Can I share my pack lists with others?',
      answer:
        'Yes! You can make pack lists public to share with the community, or share direct links with specific people. Others can view your lists, see your gear choices, and even clone lists as starting points for their own packs. All sharing is optional and under your control.',
      category: 'features',
    },
    {
      question: 'What happens to my data if I want to leave?',
      answer:
        "Your data is always yours. You can export everything to CSV format at any time, including all gear items, pack lists, and weight data. There's no vendor lock-in – you can take your carefully curated gear database with you anywhere.",
      category: 'general',
    },
    {
      question: 'How does this compare to Lighterpack?',
      answer:
        'While Lighterpack is great for basic pack lists, Featherweight adds AI-powered gear recognition, visual gear library management, advanced analytics, and automatic weight detection. We also offer mobile-first design, photo integration, and more sophisticated optimization suggestions.',
      category: 'general',
    },
    {
      question: 'Do you support different weight units?',
      answer:
        'Yes! You can choose between grams, ounces, and pounds. The system converts between units automatically and displays weights in your preferred format throughout the app. This preference syncs across all your devices.',
      category: 'technical',
    },
    {
      question: 'What kind of analytics do you provide?',
      answer:
        'We offer weight distribution charts, category breakdowns, progress tracking toward goals, identification of heaviest items, and AI-powered optimization suggestions. You can see trends over time, compare different pack configurations, and get insights into where you can save weight.',
      category: 'features',
    },
    {
      question: 'Is my gear data kept private?',
      answer:
        "Your gear library is private by default. Only pack lists you explicitly mark as public are visible to others. We use industry-standard security practices and never share your personal data. You control what's public and what stays private.",
      category: 'technical',
    },
    {
      question: 'Can I bulk import my existing gear spreadsheet?',
      answer:
        'Yes! We support CSV import for bulk adding gear items. You can map your spreadsheet columns to our fields and import hundreds of items at once. The AI can then enhance the imported data with missing information like weights and categories.',
      category: 'features',
    },
  ];

  const categories = [
    { key: 'general', label: 'General', color: 'bg-blue-100 text-blue-700' },
    {
      key: 'features',
      label: 'Features',
      color: 'bg-green-100 text-green-700',
    },
    {
      key: 'technical',
      label: 'Technical',
      color: 'bg-purple-100 text-purple-700',
    },
    {
      key: 'pricing',
      label: 'Pricing',
      color: 'bg-orange-100 text-orange-700',
    },
  ];

  return (
    <section
      className="w-full"
      style={{ padding: 'clamp(4rem, 8vw, 8rem) clamp(2rem, 5vw, 8rem)' }}
    >
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
            <HelpCircle className="h-4 w-4" />
            Common Questions
          </div>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
            Frequently Asked Questions
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about Featherweight, from getting
            started to advanced features. Can&apos;t find your answer? Feel free
            to reach out!
          </p>
        </div>

        {/* Categories Legend */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(category => (
            <div
              key={category.key}
              className={`px-3 py-1 rounded-full text-sm font-medium ${category.color}`}
            >
              {category.label}
            </div>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const category = categories.find(cat => cat.key === faq.category);
            return (
              <div key={index} className="relative">
                {/* Category Badge */}
                <div className="absolute -left-2 top-6 z-10">
                  <div
                    className={`w-3 h-3 rounded-full ${category?.color.split(' ')[0]} border-2 border-white`}
                  ></div>
                </div>

                <FAQItem
                  faq={faq}
                  isOpen={openItems.has(index)}
                  onToggle={() => toggleItem(index)}
                />
              </div>
            );
          })}
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-16 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
          <h3 className="text-xl font-bold mb-4">Still Have Questions?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            We&apos;re here to help! Whether you need technical support, have
            feature requests, or just want to chat about ultralight backpacking,
            we&apos;d love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@featherweight.app"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Contact Support
            </a>
            <a
              href="https://github.com/anthropics/featherweight/discussions"
              className="inline-flex items-center justify-center px-6 py-3 bg-background border border-muted rounded-lg hover:bg-muted/50 transition-colors font-medium"
            >
              Community Discussions
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

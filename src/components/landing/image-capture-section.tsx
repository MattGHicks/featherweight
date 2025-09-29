'use client';

import { useState } from 'react';

import {
  Camera,
  CheckCircle,
  Image as ImageIcon,
  Smartphone,
  Upload,
  Zap,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface UploadStepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isActive: boolean;
  isCompleted: boolean;
}

function UploadStep({
  icon,
  title,
  description,
  isActive,
  isCompleted,
}: UploadStepProps) {
  return (
    <div
      className={`flex items-start gap-4 p-4 rounded-lg transition-all duration-300 ${
        isActive
          ? 'bg-primary/5 border border-primary/20'
          : isCompleted
            ? 'bg-green-50 border border-green-200'
            : 'bg-muted/30'
      }`}
    >
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isCompleted
            ? 'bg-green-500 text-white'
            : isActive
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted-foreground text-muted'
        }`}
      >
        {isCompleted ? <CheckCircle className="h-5 w-5" /> : icon}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export function ImageCaptureSection() {
  const [activeDemo, setActiveDemo] = useState<'mobile' | 'desktop'>('mobile');
  const [uploadStep, setUploadStep] = useState(0);

  const steps = [
    {
      icon: <Camera className="h-5 w-5" />,
      title: 'Capture or Upload',
      description:
        'Take a photo with your phone camera or drag & drop from your computer',
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: 'AI Recognition',
      description:
        'Our AI instantly identifies your gear and suggests categories',
    },
    {
      icon: <CheckCircle className="h-5 w-5" />,
      title: 'Auto-Complete',
      description:
        'Details like weight, brand, and specs are filled automatically',
    },
  ];

  const startDemo = () => {
    setUploadStep(0);
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      setUploadStep(currentStep);
      if (currentStep >= 3) {
        clearInterval(interval);
        setTimeout(() => setUploadStep(0), 2000);
      }
    }, 1500);
  };

  return (
    <section
      className="w-full"
      style={{ padding: 'clamp(4rem, 8vw, 8rem) clamp(2rem, 5vw, 8rem)' }}
    >
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
            <Camera className="h-4 w-4" />
            Visual Gear Management
          </div>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
            Capture Your Gear Library Visually
          </h2>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Building your gear library has never been easier. Take photos
            directly from your phone, upload from your computer, or drag and
            drop multiple images. Our system handles the rest.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Interactive Demo */}
          <div className="space-y-8">
            {/* Device Toggle */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <Button
                variant={activeDemo === 'mobile' ? 'default' : 'outline'}
                onClick={() => setActiveDemo('mobile')}
                size="sm"
              >
                <Smartphone className="h-4 w-4 mr-2" />
                Mobile Camera
              </Button>
              <Button
                variant={activeDemo === 'desktop' ? 'default' : 'outline'}
                onClick={() => setActiveDemo('desktop')}
                size="sm"
              >
                <Upload className="h-4 w-4 mr-2" />
                Desktop Upload
              </Button>
            </div>

            {/* Mobile Demo */}
            {activeDemo === 'mobile' && (
              <Card className="mx-auto max-w-sm">
                <CardContent className="p-6">
                  <div className="aspect-[9/16] bg-gradient-to-b from-sky-100 to-sky-200 rounded-lg relative overflow-hidden">
                    {/* Mock Phone Interface */}
                    <div className="absolute top-4 left-4 right-4">
                      <div className="bg-black/20 rounded-full px-3 py-1 text-white text-sm text-center">
                        Add New Gear Item
                      </div>
                    </div>

                    {/* Camera Viewfinder */}
                    <div className="absolute inset-4 top-12 border-2 border-white/50 rounded-lg flex items-center justify-center">
                      <div className="text-center text-white/80">
                        <Camera className="h-16 w-16 mx-auto mb-4" />
                        <p className="text-sm">Point camera at your gear</p>
                        <p className="text-xs mt-1">Tap to capture</p>
                      </div>
                    </div>

                    {/* Mock Captured Gear */}
                    <div className="absolute bottom-4 left-4 right-4 bg-white/90 rounded-lg p-3 text-center">
                      <div className="w-12 h-12 bg-primary rounded mx-auto mb-2 flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-xs font-medium">
                        Detected: Outdoor Gear
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Tap to add details
                      </div>
                    </div>

                    {/* Mock Camera Button */}
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                      <div className="w-16 h-16 border-4 border-white rounded-full flex items-center justify-center bg-white/20">
                        <div className="w-12 h-12 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Desktop Demo */}
            {activeDemo === 'desktop' && (
              <Card>
                <CardContent className="p-8">
                  <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer">
                    <Upload className="h-16 w-16 mx-auto mb-4 text-primary" />
                    <h4 className="font-semibold mb-2">
                      Drop your gear photos here
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Or click to browse your files
                    </p>
                    <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
                      <span>📸 JPG, PNG, WebP</span>
                      <span>⚡ Up to 5MB</span>
                      <span>🔄 Multiple files OK</span>
                    </div>
                  </div>

                  {/* Example Files */}
                  <div className="mt-6 space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <ImageIcon className="h-8 w-8 text-primary" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          tent-photo.jpg
                        </div>
                        <div className="text-xs text-muted-foreground">
                          2.3 MB • Processing...
                        </div>
                      </div>
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          sleeping-bag.png
                        </div>
                        <div className="text-xs text-green-600">
                          ✓ Big Agnes Torchlight UL 20 detected
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Demo Button */}
            <div className="text-center">
              <Button onClick={startDemo} variant="outline">
                See Upload Process
                <Zap className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Right Column - Process Steps */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold mb-8">How It Works</h3>

            {steps.map((step, index) => (
              <UploadStep
                key={index}
                step={index + 1}
                icon={step.icon}
                title={step.title}
                description={step.description}
                isActive={uploadStep === index + 1}
                isCompleted={uploadStep > index + 1}
              />
            ))}

            {/* Benefits */}
            <div className="mt-12 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border">
              <h4 className="font-semibold mb-4 text-green-800">
                Why Visual Gear Management?
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Never forget what gear you own</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Instant gear identification and specs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Perfect for gear reviews and sharing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Works offline after initial capture</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-4">
              Start Building Your Visual Gear Library
            </h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of backpackers who have digitized their gear
              collections with photos and AI-powered data enrichment.
            </p>
            <Button size="lg" asChild>
              <a href="/signup">
                Start Capturing Gear
                <Camera className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

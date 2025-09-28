'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import { useState } from 'react';

import { ArrowLeft, FileText, Plus } from 'lucide-react';

import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PackListForm } from '@/components/pack-lists/pack-list-form';
import { TemplateSelector } from '@/components/pack-lists/template-selector';

export default function NewPackListPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);

  if (status === 'loading') {
    return <div className="container px-4 md:px-6 py-6">Loading...</div>;
  }

  if (!session) {
    redirect('/login');
  }

  const handleTemplateSelect = async (template: { id: string; name: string; description?: string }) => {
    try {
      const response = await fetch('/api/pack-lists/from-template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: template.id,
          name: `${template.name} - ${new Date().toLocaleDateString()}`,
          description: template.description,
        }),
      });

      if (response.ok) {
        const packList = await response.json();
        router.push(`/lists/${packList.id}`);
      } else {
        throw new Error('Failed to create pack list from template');
      }
    } catch (error) {
      console.error('Error creating pack list from template:', error);
      alert('Failed to create pack list from template. Please try again.');
    }
  };

  if (showTemplateSelector) {
    return (
      <div
        className="w-full min-h-screen"
        style={{ padding: '2rem clamp(2rem, 5vw, 8rem)' }}
      >
        <PageHeader
          title="Choose Template"
          description="Start with a pre-configured pack list"
        >
          <Button variant="outline" onClick={() => setShowTemplateSelector(false)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </PageHeader>

        <div className="flex justify-center">
          <TemplateSelector
            onTemplateSelect={handleTemplateSelect}
            onClose={() => setShowTemplateSelector(false)}
          />
        </div>
      </div>
    );
  }

  if (showManualForm) {
    return (
      <div
        className="w-full min-h-screen"
        style={{ padding: '2rem clamp(2rem, 5vw, 8rem)' }}
      >
        <PageHeader
          title="Create New Pack List"
          description="Create a new pack list from scratch"
        >
          <Button variant="outline" onClick={() => setShowManualForm(false)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </PageHeader>

        <div className="max-w-2xl">
          <div className="rounded-lg border p-6">
            <PackListForm />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full min-h-screen"
      style={{ padding: '2rem clamp(2rem, 5vw, 8rem)' }}
    >
      <PageHeader
        title="Create New Pack List"
        description="Choose how you'd like to start your pack list"
      >
        <Button variant="outline" asChild>
          <Link href="/lists">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Pack Lists
          </Link>
        </Button>
      </PageHeader>

      <div className="max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Template Option */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowTemplateSelector(true)}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6" />
                Start from Template
              </CardTitle>
              <CardDescription>
                Choose from pre-configured pack lists for different trip types and conditions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Templates include:
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-muted px-2 py-1 rounded">Day Hiking</span>
                  <span className="text-xs bg-muted px-2 py-1 rounded">Overnight</span>
                  <span className="text-xs bg-muted px-2 py-1 rounded">Multi-day</span>
                  <span className="text-xs bg-muted px-2 py-1 rounded">Winter</span>
                </div>
                <p className="text-sm font-medium text-primary">
                  Fastest way to get started →
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Manual Option */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowManualForm(true)}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-6 w-6" />
                Start from Scratch
              </CardTitle>
              <CardDescription>
                Create a completely custom pack list with your own gear and organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Perfect for:
                </p>
                <div className="space-y-1">
                  <p className="text-sm">• Custom trip requirements</p>
                  <p className="text-sm">• Unique gear configurations</p>
                  <p className="text-sm">• Specific weight targets</p>
                </div>
                <p className="text-sm font-medium text-primary">
                  Full customization →
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

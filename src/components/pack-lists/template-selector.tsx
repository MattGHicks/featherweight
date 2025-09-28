'use client';

import { useEffect, useState } from 'react';

import { ChevronRight, FileText, Mountain, Snowflake, Sun } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatWeight } from '@/lib/utils';

interface TemplateItem {
  id: string;
  categoryId: string;
  itemName: string;
  description?: string;
  estimatedWeight: number;
  quantity: number;
  isEssential: boolean;
  priority: number;
  category: {
    name: string;
    color: string;
  };
}

interface PackListTemplate {
  id: string;
  name: string;
  description?: string;
  category: string;
  season: string;
  difficulty: string;
  isPublic: boolean;
  templateItems: TemplateItem[];
  createdAt: string;
}

interface TemplateSelectorProps {
  onTemplateSelect: (template: PackListTemplate) => void;
  onClose: () => void;
}

const seasonIcons = {
  '3-season': Mountain,
  Winter: Snowflake,
  Summer: Sun,
  All: Mountain,
};

const difficultyColors = {
  Beginner: 'bg-green-500',
  Intermediate: 'bg-yellow-500',
  Advanced: 'bg-red-500',
};

export function TemplateSelector({
  onTemplateSelect,
  onClose,
}: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<PackListTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeason, setSelectedSeason] = useState<string>('all');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/pack-lists/templates');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTemplates = templates.filter(template => {
    const categoryMatch =
      selectedCategory === 'all' || template.category === selectedCategory;
    const seasonMatch =
      selectedSeason === 'all' || template.season === selectedSeason;
    return categoryMatch && seasonMatch;
  });

  const categories = [...new Set(templates.map(t => t.category))];
  const seasons = [...new Set(templates.map(t => t.season))];

  const calculateTemplateWeight = (template: PackListTemplate) => {
    return template.templateItems.reduce(
      (sum, item) => sum + item.estimatedWeight * item.quantity,
      0
    );
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Pack List Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Loading templates...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Pack List Templates
            </CardTitle>
            <CardDescription>
              Start with a pre-configured pack list for your trip type
            </CardDescription>
          </div>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filters */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Types</TabsTrigger>
            {categories.slice(0, 3).map(category => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedSeason === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedSeason('all')}
          >
            All Seasons
          </Button>
          {seasons.map(season => (
            <Button
              key={season}
              variant={selectedSeason === season ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedSeason(season)}
            >
              {season}
            </Button>
          ))}
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">No templates found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters or check back later for more templates.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTemplates.map(template => {
              const SeasonIcon =
                seasonIcons[template.season as keyof typeof seasonIcons] ||
                Mountain;
              const totalWeight = calculateTemplateWeight(template);
              const essentialItems = template.templateItems.filter(
                item => item.isEssential
              ).length;

              return (
                <Card
                  key={template.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onTemplateSelect(template)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <SeasonIcon className="h-4 w-4" />
                          <CardTitle className="text-lg">
                            {template.name}
                          </CardTitle>
                        </div>
                        {template.description && (
                          <CardDescription className="line-clamp-2">
                            {template.description}
                          </CardDescription>
                        )}
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{template.category}</Badge>
                      <Badge variant="outline">{template.season}</Badge>
                      <Badge
                        variant="outline"
                        className={`text-white ${difficultyColors[template.difficulty as keyof typeof difficultyColors]}`}
                      >
                        {template.difficulty}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-semibold">
                          {template.templateItems.length}
                        </div>
                        <div className="text-muted-foreground">Items</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">{essentialItems}</div>
                        <div className="text-muted-foreground">Essential</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">
                          {formatWeight(totalWeight)}
                        </div>
                        <div className="text-muted-foreground">Est. Weight</div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="text-xs text-muted-foreground mb-2">
                        Categories:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {[
                          ...new Set(
                            template.templateItems.map(
                              item => item.category.name
                            )
                          ),
                        ]
                          .slice(0, 4)
                          .map(categoryName => (
                            <Badge
                              key={categoryName}
                              variant="secondary"
                              className="text-xs"
                            >
                              {categoryName}
                            </Badge>
                          ))}
                        {[
                          ...new Set(
                            template.templateItems.map(
                              item => item.category.name
                            )
                          ),
                        ].length > 4 && (
                          <Badge variant="secondary" className="text-xs">
                            +
                            {[
                              ...new Set(
                                template.templateItems.map(
                                  item => item.category.name
                                )
                              ),
                            ].length - 4}{' '}
                            more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <div className="text-center text-sm text-muted-foreground">
          Templates help you get started quickly with proven gear lists for
          different trip types. You can customize any template after selection.
        </div>
      </CardContent>
    </Card>
  );
}

import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface GearItemEnrichmentData {
  name: string;
  description?: string;
  weight?: number; // in grams
  category?: string;
  imageSearchTerms?: string[];
  retailerUrls?: string[];
  confidence: number; // 0-1 score
  priceRange?: {
    min: number;
    max: number;
    currency: string;
  };
}

export interface AIEnrichmentRequest {
  name: string;
  category?: string; // Optional hint from user
  description?: string; // Optional existing description
}

/**
 * Enriches gear item data using AI
 */
export async function enrichGearItem(
  request: AIEnrichmentRequest
): Promise<GearItemEnrichmentData> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  try {
    const prompt = createEnrichmentPrompt(request);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an expert in ultralight backpacking gear with extensive knowledge of brands, models, and specifications. Provide accurate, detailed information about outdoor gear items based on their names.

CRITICAL: Always respond with valid JSON that matches this exact structure:
{
  "name": "cleaned/formatted item name",
  "description": "detailed description including brand, model, key features, materials",
  "weight": number_in_grams,
  "category": "category_name",
  "imageSearchTerms": ["term1", "term2", "term3"],
  "retailerUrls": ["url1", "url2"],
  "confidence": 0.0_to_1.0,
  "priceRange": {
    "min": number,
    "max": number,
    "currency": "USD"
  }
}

CATEGORIES (choose exactly one): Shelter, Sleep System, Backpack, Clothing, Cooking, Water, Electronics, Safety, Personal Care, Tools, Food

WEIGHT: Provide the actual weight in grams for the specific item if known, or the most typical weight for that model/brand. Be as accurate as possible.

DESCRIPTION: Include brand, model number/name, key features, materials, and any weight-saving characteristics important for ultralight backpacking.

RETAILER URLs: Provide direct product page URLs from major retailers like REI, Amazon, manufacturer websites, etc.

CONFIDENCE: 0.9+ for specific known products, 0.7+ for recognized brands/models, 0.5+ for generic items.

Examples:
- "Anker PowerCore 10000" → weight: 180, category: "Electronics", description: "Anker PowerCore 10000 portable charger with 10,000mAh capacity..."
- "Big Agnes Copper Spur HV UL2" → weight: 1090, category: "Shelter", description: "Big Agnes Copper Spur HV UL2 ultralight 2-person tent..."
- "Osprey Exos 58" → weight: 1100, category: "Backpack", description: "Osprey Exos 58 ultralight hiking backpack with 58L capacity..."`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3, // Lower temperature for more consistent results
      max_tokens: 800,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from AI service');
    }

    // Parse the JSON response
    let enrichmentData: GearItemEnrichmentData;
    try {
      enrichmentData = JSON.parse(response);
    } catch {
      console.error('Failed to parse AI response:', response);
      throw new Error('Invalid AI response format');
    }

    // Validate required fields
    if (!enrichmentData.name || typeof enrichmentData.confidence !== 'number') {
      throw new Error('AI response missing required fields');
    }

    // Ensure confidence is within valid range
    enrichmentData.confidence = Math.max(
      0,
      Math.min(1, enrichmentData.confidence)
    );

    return enrichmentData;
  } catch (error) {
    console.error('AI enrichment error:', error);

    // Handle specific OpenAI errors
    if (error instanceof Error) {
      if (error.message.includes('429') || error.message.includes('quota')) {
        // Quota exceeded - return partial enrichment with fallback data
        return {
          name: request.name,
          description:
            request.description ||
            `High-quality ${request.name} - check specifications for exact details`,
          weight: estimateWeightFromName(request.name),
          confidence: 0.3,
          imageSearchTerms: [request.name],
          category: inferCategoryFromName(request.name),
        };
      }

      if (error.message.includes('401') || error.message.includes('API key')) {
        // API key issue
        throw new Error(
          'AI service authentication failed. Please check API key configuration.'
        );
      }

      if (error.message.includes('404') || error.message.includes('model')) {
        // Model not found
        throw new Error(
          'AI model not available. Please check your OpenAI plan and model access.'
        );
      }
    }

    // Return basic fallback data for other errors
    return {
      name: request.name,
      description: request.description || '',
      weight: estimateWeightFromName(request.name),
      confidence: 0.1,
      imageSearchTerms: [request.name],
      category: inferCategoryFromName(request.name),
    };
  }
}

/**
 * Simple category inference based on item name when AI is unavailable
 */
function inferCategoryFromName(name: string): string | undefined {
  const nameLower = name.toLowerCase();

  if (
    nameLower.includes('tent') ||
    nameLower.includes('shelter') ||
    nameLower.includes('tarp')
  ) {
    return 'Shelter';
  }
  if (
    nameLower.includes('bag') ||
    nameLower.includes('sleep') ||
    nameLower.includes('pad') ||
    nameLower.includes('quilt')
  ) {
    return 'Sleep System';
  }
  if (nameLower.includes('pack') || nameLower.includes('backpack')) {
    return 'Backpack';
  }
  if (
    nameLower.includes('jacket') ||
    nameLower.includes('shirt') ||
    nameLower.includes('pants') ||
    nameLower.includes('clothing')
  ) {
    return 'Clothing';
  }
  if (
    nameLower.includes('stove') ||
    nameLower.includes('pot') ||
    nameLower.includes('cook') ||
    nameLower.includes('cup')
  ) {
    return 'Cooking';
  }
  if (
    nameLower.includes('water') ||
    nameLower.includes('bottle') ||
    nameLower.includes('filter') ||
    nameLower.includes('purif')
  ) {
    return 'Water';
  }
  if (
    nameLower.includes('power') ||
    nameLower.includes('battery') ||
    nameLower.includes('charger') ||
    nameLower.includes('anker') ||
    nameLower.includes('electronics') ||
    nameLower.includes('gps') ||
    nameLower.includes('phone')
  ) {
    return 'Electronics';
  }
  if (
    nameLower.includes('first aid') ||
    nameLower.includes('medical') ||
    nameLower.includes('safety') ||
    nameLower.includes('emergency')
  ) {
    return 'Safety';
  }
  if (
    nameLower.includes('toothbrush') ||
    nameLower.includes('soap') ||
    nameLower.includes('towel') ||
    nameLower.includes('personal')
  ) {
    return 'Personal Care';
  }
  if (
    nameLower.includes('knife') ||
    nameLower.includes('tool') ||
    nameLower.includes('rope') ||
    nameLower.includes('cord')
  ) {
    return 'Tools';
  }
  if (
    nameLower.includes('food') ||
    nameLower.includes('meal') ||
    nameLower.includes('snack') ||
    nameLower.includes('bar')
  ) {
    return 'Food';
  }

  return undefined; // Let user select category
}

/**
 * Simple weight estimation based on item name when AI is unavailable (in grams)
 */
function estimateWeightFromName(name: string): number | undefined {
  const nameLower = name.toLowerCase();

  // Shelter items
  if (nameLower.includes('tent') || nameLower.includes('shelter')) {
    if (
      nameLower.includes('ultralight') ||
      nameLower.includes('duplex') ||
      nameLower.includes('zpacks')
    ) {
      return 680; // ~24oz for ultralight 2-person tent
    }
    return 1200; // ~42oz for regular tent
  }
  if (nameLower.includes('tarp')) {
    return 300; // ~11oz
  }

  // Sleep system
  if (nameLower.includes('sleeping bag') || nameLower.includes('quilt')) {
    return 800; // ~28oz
  }
  if (nameLower.includes('sleeping pad') || nameLower.includes('pad')) {
    return 400; // ~14oz
  }

  // Backpacks
  if (nameLower.includes('pack') || nameLower.includes('backpack')) {
    if (nameLower.includes('ultralight')) {
      return 900; // ~32oz
    }
    return 1400; // ~49oz
  }

  // Clothing
  if (nameLower.includes('jacket') || nameLower.includes('puffy')) {
    return 300; // ~11oz
  }
  if (nameLower.includes('shirt') || nameLower.includes('base layer')) {
    return 150; // ~5oz
  }
  if (nameLower.includes('pants') || nameLower.includes('shorts')) {
    return 250; // ~9oz
  }
  if (
    nameLower.includes('underwear') ||
    nameLower.includes('boxer') ||
    nameLower.includes('briefs')
  ) {
    return 50; // ~2oz
  }
  if (nameLower.includes('socks')) {
    return 60; // ~2oz
  }

  // Cooking
  if (nameLower.includes('stove')) {
    return 100; // ~4oz
  }
  if (nameLower.includes('pot') || nameLower.includes('cookware')) {
    return 200; // ~7oz
  }

  // Water
  if (nameLower.includes('water bottle') || nameLower.includes('bottle')) {
    return 150; // ~5oz empty
  }
  if (nameLower.includes('filter') || nameLower.includes('purif')) {
    return 80; // ~3oz
  }

  // Electronics
  if (
    nameLower.includes('powercore') ||
    nameLower.includes('power bank') ||
    nameLower.includes('anker')
  ) {
    if (nameLower.includes('10000')) {
      return 180; // Anker PowerCore 10000
    }
    return 250; // ~9oz typical power bank
  }
  if (nameLower.includes('headlamp') || nameLower.includes('flashlight')) {
    return 100; // ~4oz
  }
  if (nameLower.includes('gps') || nameLower.includes('inreach')) {
    return 100; // ~4oz
  }

  // Personal care & small items
  if (nameLower.includes('soap') || nameLower.includes('bronner')) {
    return 30; // ~1oz small bottle
  }
  if (nameLower.includes('toothbrush')) {
    return 10; // ~0.4oz
  }
  if (nameLower.includes('duct tape') || nameLower.includes('tape')) {
    return 15; // ~0.5oz small roll
  }
  if (nameLower.includes('first aid') || nameLower.includes('medical kit')) {
    return 120; // ~4oz
  }
  if (nameLower.includes('ibuprofen') || nameLower.includes('medication')) {
    return 5; // ~0.2oz for 10 tablets
  }

  // Food & consumables
  if (nameLower.includes('electrolyte') || nameLower.includes('powder')) {
    return 25; // ~1oz per serving
  }

  // Default weight for unknown items
  return 100; // ~4oz default estimate
}

/**
 * Creates a prompt for gear item enrichment
 */
function createEnrichmentPrompt(request: AIEnrichmentRequest): string {
  let prompt = `Please provide detailed information about this piece of outdoor gear: "${request.name}"`;

  if (request.category) {
    prompt += `\nUser suggested category: ${request.category}`;
  }

  if (request.description) {
    prompt += `\nExisting description: ${request.description}`;
  }

  prompt += `\n\nPlease include:
- Accurate weight in grams (crucial for ultralight backpacking)
- Detailed description with brand/model if identifiable
- Appropriate category from the provided list
- Good image search terms
- Typical price range in USD
- Your confidence level in this information

Focus on providing data that would help an ultralight backpacker make informed decisions about gear weight and functionality.`;

  return prompt;
}

/**
 * Searches for gear images using Google Custom Search API
 */
export async function searchGearImage(
  searchTerm: string
): Promise<string | null> {
  if (!process.env.GOOGLE_API_KEY || !process.env.GOOGLE_SEARCH_ENGINE_ID) {
    console.warn('Google Custom Search API not configured');
    return null;
  }

  try {
    // Use the exact product name for better accuracy
    // Only add context if it's clearly a gear-related search
    let query = searchTerm;

    // For electronics like power banks, don't add outdoor gear context
    const isElectronics =
      searchTerm.toLowerCase().includes('anker') ||
      searchTerm.toLowerCase().includes('battery') ||
      searchTerm.toLowerCase().includes('charger') ||
      searchTerm.toLowerCase().includes('power');

    // For generic terms, add outdoor context
    if (!isElectronics && !searchTerm.toLowerCase().includes('brand')) {
      query = `${searchTerm} outdoor`;
    }

    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}&searchType=image&num=5&imgSize=medium&safe=active&fileType=jpg,png,webp`
    );

    if (!response.ok) {
      console.error('Google Images API error:', response.status);
      return null;
    }

    const data = await response.json();

    // Return the first valid image URL
    if (data.items && data.items.length > 0) {
      // Extract key terms from the search term for better matching
      const searchWords = searchTerm.toLowerCase().split(' ');
      const mainBrand = searchWords[0]; // e.g., "anker", "big", "osprey"
      const modelWords = searchWords.slice(1); // remaining words

      // Filter for images that are likely to be actual gear photos
      const validImages = data.items.filter(
        (item: { link?: string; title?: string; snippet?: string }) => {
          const url = item.link;
          const title = item.title?.toLowerCase() || '';
          const snippet = item.snippet?.toLowerCase() || '';

          // Skip obviously unrelated images
          if (
            title.includes('logo') ||
            title.includes('icon') ||
            title.includes('banner') ||
            url.includes('logo') ||
            title.includes('gear log') ||
            title.includes('review') ||
            title.includes('blog')
          ) {
            return false;
          }

          // Check for valid image URL
          if (!url || !url.match(/\.(jpg|jpeg|png|webp)(\?.*)?$/i)) {
            return false;
          }

          // Prefer images that contain the brand or main product terms
          const hasRelevantContent =
            title.includes(mainBrand) ||
            snippet.includes(mainBrand) ||
            modelWords.some(word => word.length > 2 && title.includes(word)) ||
            title.includes(searchTerm.toLowerCase());

          return hasRelevantContent;
        }
      );

      if (validImages.length > 0) {
        return validImages[0].link;
      }

      // More restrictive fallback - only return first image if it seems relevant
      const firstItem = data.items[0];
      const firstTitle = firstItem.title?.toLowerCase() || '';
      if (firstTitle.includes(mainBrand) || !firstTitle.includes('gear log')) {
        return firstItem.link;
      }
    }

    return null;
  } catch (error) {
    console.error('Error searching for gear image:', error);
    return null;
  }
}

/**
 * Searches for gear images using AI-suggested terms (legacy function)
 */
export async function suggestGearImages(
  searchTerms: string[]
): Promise<string[]> {
  const imagePromises = searchTerms
    .slice(0, 3)
    .map(term => searchGearImage(term));
  const results = await Promise.all(imagePromises);
  return results.filter(Boolean) as string[];
}

/**
 * Validates if an AI enrichment response is high quality
 */
export function validateEnrichmentQuality(
  data: GearItemEnrichmentData
): boolean {
  // Check if we have meaningful data
  const hasWeight = Boolean(data.weight && data.weight > 0);
  const hasDescription = Boolean(
    data.description && data.description.length > 10
  );
  const hasCategory = Boolean(data.category && data.category.length > 0);
  const goodConfidence = data.confidence >= 0.5;

  return hasWeight && hasDescription && hasCategory && goodConfidence;
}

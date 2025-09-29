import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { z } from 'zod';

import { type AIEnrichmentRequest, enrichGearItem } from '@/lib/ai-service';
import { authOptions } from '@/lib/auth';

const enrichmentRequestSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  category: z.string().optional(),
  description: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate request body
    const body = await request.json();
    const validatedData = enrichmentRequestSchema.parse(body);

    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 503 }
      );
    }

    // Rate limiting will be implemented in production
    // const rateLimitKey = `ai_enrich_${session.user.id}`;
    // const now = Date.now();
    // const rateLimitWindow = 60 * 1000; // 1 minute
    // const rateLimitMax = 10; // 10 requests per minute

    // Call AI service
    const enrichmentRequest: AIEnrichmentRequest = {
      name: validatedData.name,
      category: validatedData.category,
      description: validatedData.description,
    };

    const enrichmentData = await enrichGearItem(enrichmentRequest);

    // Log successful enrichment for monitoring
    console.log(
      `AI enrichment successful for user ${session.user.id}: ${validatedData.name}`
    );

    return NextResponse.json({
      success: true,
      data: enrichmentData,
    });
  } catch (error) {
    console.error('AI enrichment API error:', error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    // Handle AI service errors
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'AI service configuration error' },
          { status: 503 }
        );
      }

      if (
        error.message.includes('quota') ||
        error.message.includes('rate limit')
      ) {
        return NextResponse.json(
          {
            error:
              'AI service temporarily unavailable. Please try again later.',
          },
          { status: 429 }
        );
      }
    }

    // Generic error response
    return NextResponse.json(
      { error: 'Failed to enrich gear item data' },
      { status: 500 }
    );
  }
}

// OPTIONS handler for CORS if needed
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

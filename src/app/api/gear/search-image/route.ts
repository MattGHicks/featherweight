import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { z } from 'zod';

import { searchGearImage } from '@/lib/ai-service';
import { authOptions } from '@/lib/auth';

const imageSearchSchema = z.object({
  searchTerm: z.string().min(1, 'Search term is required'),
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
    const validatedData = imageSearchSchema.parse(body);

    // Check for API configuration
    if (!process.env.GOOGLE_API_KEY || !process.env.GOOGLE_SEARCH_ENGINE_ID) {
      return NextResponse.json(
        { error: 'Image search service not configured' },
        { status: 503 }
      );
    }

    // Search for gear image
    const imageUrl = await searchGearImage(validatedData.searchTerm);

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'No suitable image found' },
        { status: 404 }
      );
    }

    // Log successful search for monitoring
    console.log(
      `Image search successful for user ${session.user.id}: ${validatedData.searchTerm} -> ${imageUrl}`
    );

    return NextResponse.json({
      success: true,
      imageUrl,
      searchTerm: validatedData.searchTerm,
    });
  } catch (error) {
    console.error('Image search API error:', error);

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

    // Handle API quota/rate limit errors
    if (error instanceof Error) {
      if (error.message.includes('quota') || error.message.includes('limit')) {
        return NextResponse.json(
          {
            error:
              'Image search temporarily unavailable. Please try again later.',
          },
          { status: 429 }
        );
      }
    }

    // Generic error response
    return NextResponse.json(
      { error: 'Failed to search for gear image' },
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

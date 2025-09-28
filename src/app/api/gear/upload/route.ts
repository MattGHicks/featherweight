import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { put } from '@vercel/blob';

import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Check if Vercel Blob is configured
    if (!process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN === 'vercel_blob_rw_your_token_here') {
      return NextResponse.json(
        {
          error: 'File upload not configured. Please set up Vercel Blob or use image URLs instead.'
        },
        { status: 400 }
      );
    }

    // Generate unique filename with user ID prefix
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const filename = `gear-images/${session.user.id}/${timestamp}.${fileExtension}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
    });

    return NextResponse.json({
      imageUrl: blob.url,
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading image:', error);

    // Check if it's a Vercel Blob configuration error
    if (error instanceof Error && error.message.includes('store does not exist')) {
      return NextResponse.json(
        {
          error: 'File upload not configured. Please set up Vercel Blob or use image URLs instead.'
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
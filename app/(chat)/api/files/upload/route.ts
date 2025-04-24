import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { auth } from '@/app/(auth)/auth';

// Use Blob instead of File since File is not available in Node.js environment
const FileSchema = z.object({
  file: z
    .instanceof(Blob)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: 'File size should be less than 5MB',
    })
    // Update the file type to include more image formats
    .refine((file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type), {
      message: 'File type should be JPEG, PNG, or WebP',
    }),
});

export async function POST(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (request.body === null) {
    return new Response('Request body is empty', { status: 400 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as Blob;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const validatedFile = FileSchema.safeParse({ file });

    if (!validatedFile.success) {
      const errorMessage = validatedFile.error.errors
        .map((error) => error.message)
        .join(', ');

      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    // Get filename from formData since Blob doesn't have name property
    const filename = (formData.get('file') as File).name;
    const fileBuffer = await file.arrayBuffer();

    try {
      const data = await put(`${filename}`, fileBuffer, {
        access: 'public',
      });

      return NextResponse.json(data);
    } catch (error) {
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 },
    );
  }
}

// Add a new endpoint to handle base64 image uploads
export async function PUT(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { base64Image, filename } = await request.json();
    
    if (!base64Image || !filename) {
      return NextResponse.json({ error: 'Missing base64 image or filename' }, { status: 400 });
    }
    
    // Extract the base64 data (remove data:image/png;base64, prefix if present)
    const base64Data = base64Image.includes(',') 
      ? base64Image.split(',')[1] 
      : base64Image;
    
    // Convert base64 to binary
    const binaryData = Buffer.from(base64Data, 'base64');
    
    // Create a unique filename if not provided
    const uniqueFilename = filename || `generated-image-${Date.now()}.png`;
    
    // Upload to blob storage
    const data = await put(uniqueFilename, binaryData, {
      access: 'public',
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error uploading base64 image:', error);
    return NextResponse.json(
      { error: 'Failed to process base64 image' },
      { status: 500 },
    );
  }
}

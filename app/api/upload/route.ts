import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'This endpoint is only available in development mode' },
      { status: 403 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('pdf') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Create a unique directory name using timestamp
    const timestamp = Date.now();
    const dirPath = join(process.cwd(), 'persistence', 'data', 'files', `upload_${timestamp}`);
    
    // Create the directory
    await mkdir(dirPath, { recursive: true });
    
    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Write the file
    const filePath = join(dirPath, file.name);
    await writeFile(filePath, buffer);
    
    return NextResponse.json({ 
      success: true,
      path: filePath
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
} 
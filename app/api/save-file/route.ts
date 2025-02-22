import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'


// Save a file to the local filesystem - Outside of FastAPI
export async function POST(req: Request) {
  try {
    const { filename, content } = await req.json()

    const safeName = filename.replace(/[^a-zA-Z0-9-_\.]/g, '_')
    
    // Save to persistence directory instead of uploads
    const filesDir = join(process.cwd(), 'persistence', 'data', 'files')
    await writeFile(join(filesDir, safeName), content, 'base64')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving file:', error)
    return NextResponse.json(
      { error: 'Failed to save file' },
      { status: 500 }
    )
  }
} 
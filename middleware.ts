import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { mkdir } from 'fs/promises'
import { join } from 'path'

export async function middleware(request: NextRequest) {
  // Ensure uploads directory exists
  try {
    await mkdir(join(process.cwd(), 'uploads'), { recursive: true })
  } catch (error) {
    console.error('Error creating uploads directory:', error)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/api/save-file',
} 
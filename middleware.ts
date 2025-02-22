import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { mkdir } from 'fs/promises'
import { join } from 'path'

export async function middleware(request: NextRequest) {  
  return NextResponse.next()
}

export const config = {
  matcher: '/api/save-file',
} 
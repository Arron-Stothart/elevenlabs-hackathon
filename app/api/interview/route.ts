import { NextResponse } from 'next/server'
import { VOICE_SETTINGS } from '@/lib/constants'

// Keep track of consecutive errors
let consecutiveErrors = 0
const MAX_CONSECUTIVE_ERRORS = 3
let lastErrorTime = 0
const ERROR_RESET_TIME = 5000 // 5 seconds

export async function POST(req: Request) {
  try {
    // Check if we've had too many consecutive errors
    if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
      const timeSinceLastError = Date.now() - lastErrorTime
      if (timeSinceLastError < ERROR_RESET_TIME) {
        return NextResponse.json(
          { 
            error: 'Service temporarily unavailable',
            details: 'Too many errors occurred. Please wait a few seconds and try again.'
          },
          { status: 503 }
        )
      } else {
        // Reset error count after timeout
        consecutiveErrors = 0
      }
    }

    const { text } = await req.json()

    if (!text?.trim()) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    try {
      // For now, just return the text as is - we'll add speech synthesis in the browser
      return NextResponse.json({ text: text.trim() })
    } catch (apiError) {
      console.error('API call failed:', apiError)
      
      // Increment error count
      consecutiveErrors++
      lastErrorTime = Date.now()

      return NextResponse.json(
        { 
          error: 'Failed to process request',
          details: apiError instanceof Error ? apiError.message : 'Unknown error occurred'
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Request processing error:', error)
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  }
} 
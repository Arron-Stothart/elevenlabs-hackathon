import { NextResponse } from 'next/server'

const AGENT_ID = '98sS06Srtc9Op5TStbNK'

export async function GET() {
  try {
    if (!process.env.NEXT_PUBLIC_ELEVEN_LABS_API_KEY) {
      throw new Error('Missing API key')
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${AGENT_ID}`,
      {
        headers: {
          'xi-api-key': process.env.NEXT_PUBLIC_ELEVEN_LABS_API_KEY,
        },
      }
    )

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }))
      throw new Error(error.error || 'Failed to get signed URL')
    }

    const data = await response.json()
    if (!data.signed_url) {
      throw new Error('No signed URL received')
    }

    return NextResponse.json({ signedUrl: data.signed_url })
  } catch (error) {
    console.error('Failed to get signed URL:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to generate signed URL',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
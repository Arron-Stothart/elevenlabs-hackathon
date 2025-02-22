'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useVoiceInteraction } from '@/lib/hooks/useVoiceInteraction'

export default function InterviewPage() {
  const [error, setError] = useState<string | null>(null)

  const { status, isSpeaking, startInterview, stopInterview } = useVoiceInteraction({
    onError: (error) => {
      setError(error)
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000)
    }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center">AI Interview</h1>
        
        {/* Status display */}
        <div className="text-center text-lg">
          Status: {status}
          {isSpeaking && ' (AI is speaking)'}
        </div>

        {/* Error display */}
        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}
        
        {/* Controls */}
        <div className="flex justify-center gap-4">
          {status === 'disconnected' ? (
            <Button 
              onClick={startInterview}
              className="px-6 py-3 text-lg"
            >
              Start Interview
            </Button>
          ) : (
            <Button 
              onClick={stopInterview}
              variant="destructive"
              className="px-6 py-3 text-lg"
            >
              End Interview
            </Button>
          )}
        </div>
      </div>
    </div>
  )
} 
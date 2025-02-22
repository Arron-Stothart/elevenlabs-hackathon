'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

interface Conversation {
  id: string
  date: string
  messages: Message[]
}

export default function ConversationPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [conversation, setConversation] = useState<Conversation | null>(null)

  useEffect(() => {
    const conversations = JSON.parse(localStorage.getItem('conversations') || '[]')
    const found = conversations.find((c: Conversation) => c.id === params.id)
    if (!found) {
      router.push('/dashboard')
      return
    }
    setConversation(found)
  }, [params.id, router])

  if (!conversation) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          Loading...
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Interview Transcript</h1>
            <p className="text-gray-500">
              {format(new Date(conversation.date), 'PPpp')}
            </p>
          </div>
          <Button 
            onClick={() => router.push('/dashboard')}
            variant="outline"
          >
            ← Back to Dashboard
          </Button>
        </div>

        <div className="space-y-4">
          {conversation.messages.map((message, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                message.role === 'assistant' 
                  ? 'bg-blue-50 ml-4' 
                  : 'bg-gray-50 mr-4'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium">
                  {message.role === 'assistant' ? 'AI Interviewer' : 'You'}
                </span>
                <span className="text-xs text-gray-500">
                  {format(message.timestamp, 'pp')}
                </span>
              </div>
              <p className="text-gray-700">{message.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 
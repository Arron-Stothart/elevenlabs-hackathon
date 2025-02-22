'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { formatDistanceToNow } from 'date-fns'

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

export default function DashboardPage() {
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])

  useEffect(() => {
    const savedConversations = JSON.parse(localStorage.getItem('conversations') || '[]')
    setConversations(savedConversations)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Interview History</h1>
          <Button 
            onClick={() => router.push('/interview')}
            className="px-6 py-3"
          >
            New Interview
          </Button>
        </div>

        <div className="space-y-4">
          {conversations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No interviews yet. Start your first interview!
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => router.push(`/conversation/${conversation.id}`)}
                className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">
                      Interview {formatDistanceToNow(new Date(conversation.date))} ago
                    </h3>
                    <p className="text-sm text-gray-500">
                      {conversation.messages.length} messages
                    </p>
                  </div>
                  <Button variant="ghost" className="text-sm">
                    View Details →
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
} 
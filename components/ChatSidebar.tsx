'use client'

import { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Copy, Mail } from 'lucide-react'
import Image from 'next/image'
import { useParams } from 'next/navigation'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatSidebarProps {
  getContext: () => string;
}

export default function ChatSidebar({ getContext }: ChatSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const params = useParams()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          context: getContext()
        }),
      })

      if (!response.ok) throw new Error('Failed to get response')
      
      const data = await response.json()
      const assistantMessage: Message = { role: 'assistant', content: data.response }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error processing your request.' 
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="border-l border-border w-1/4 h-screen flex flex-col bg-gray-50">
      {/* Action Buttons */}
      <div className="p-3 border-b border-border">
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            className="shadow-none rounded-lg bg-white"
            onClick={() => navigator.clipboard.writeText(messages.map(m => m.content).join('\n'))}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Text
          </Button>
          <Button variant="outline" className="shadow-none rounded-lg bg-white">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
          <Button variant="outline" className="shadow-none rounded-lg bg-white">
            <Image src="/slack.svg" alt="Slack" width={16} height={16} className="mr-2" />
            <span>Share on Slack</span>
          </Button>
          <Button variant="outline" className="shadow-none rounded-lg bg-white">
            <Image src="/attio.svg" alt="Attio" width={16} height={16} className="mr-2" />
            <span>Add to Attio</span>
          </Button>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`${
              message.role === 'user' ? 'ml-4' : 'mr-4'
            }`}
          >
            <div className={`text-sm ${
              message.role === 'user' ? 'bg-primary/10' : 'bg-white'
            } rounded-lg p-3`}>
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="mr-4">
            <div className="text-sm bg-white rounded-lg p-3 animate-pulse">
              Thinking...
            </div>
          </div>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about the meeting..."
          className="focus-visible:ring-0 focus-visible:ring-offset-0 rounded-lg bg-white"
          disabled={isLoading}
        />
      </form>
    </div>
  )
} 
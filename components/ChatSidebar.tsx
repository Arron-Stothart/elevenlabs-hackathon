'use client'

import { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Copy, Mail } from 'lucide-react'
import Image from 'next/image'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatSidebar() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setMessages([...messages, { role: 'user', content: input }])
    setInput('')
    // Here you would typically make an API call to your AI service
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
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about the meeting..."
          className="focus-visible:ring-0 focus-visible:ring-offset-0 rounded-lg bg-white"
        />
      </form>
    </div>
  )
} 
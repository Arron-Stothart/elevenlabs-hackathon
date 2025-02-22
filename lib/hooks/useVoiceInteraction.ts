import { useConversation } from '@11labs/react'
import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'

type Role = 'user' | 'ai'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

interface UseVoiceInteractionProps {
  onError?: (error: string) => void
}

export function useVoiceInteraction({ onError }: UseVoiceInteractionProps = {}) {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])

  const conversation = useConversation({
    onConnect: () => console.log('Connected'),
    onDisconnect: () => console.log('Disconnected'),
    onMessage: (message: { message: string; source: Role }) => {
      console.log('Message:', message)
      setMessages(prev => [...prev, {
        role: message.source === 'ai' ? 'assistant' : 'user',
        content: message.message,
        timestamp: Date.now()
      }])
    },
    onError: (error: Error | string) => {
      console.error('Error:', error)
      onError?.(typeof error === 'string' ? error : error.message)
    },
  })

  const startInterview = useCallback(async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true })

      // Get signed URL
      const response = await fetch('/api/get-signed-url')
      if (!response.ok) {
        throw new Error(`Failed to get signed url: ${response.statusText}`)
      }
      const { signedUrl } = await response.json()

      // Start the conversation with your agent
      await conversation.startSession({
        signedUrl,
        agentId: process.env.NEXT_PUBLIC_ELEVEN_LABS_AGENT_ID
      })

      // Clear previous messages
      setMessages([])
    } catch (error) {
      console.error('Failed to start interview:', error)
      onError?.(error instanceof Error ? error.message : 'Failed to start interview')
    }
  }, [conversation, onError])

  const stopInterview = useCallback(async () => {
    try {
      await conversation.endSession()
      
      // Save conversation to local storage
      const conversations = JSON.parse(localStorage.getItem('conversations') || '[]')
      const newConversation = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        messages: messages,
      }
      localStorage.setItem('conversations', JSON.stringify([newConversation, ...conversations]))
      
      // Redirect to dashboard
      router.push('/dashboard')
    } catch (error) {
      console.error('Failed to stop interview:', error)
      onError?.(error instanceof Error ? error.message : 'Failed to stop interview')
    }
  }, [conversation, onError, messages, router])

  return {
    status: conversation.status,
    isSpeaking: conversation.isSpeaking,
    messages,
    startInterview,
    stopInterview
  }
}
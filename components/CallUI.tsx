"use client"

import React, { useEffect, useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import { PhoneOff, Mic, Video } from "lucide-react"

export default function CallUI() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const websocketRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    // Create WebSocket connection
    websocketRef.current = new WebSocket('ws://localhost:8000/ws/chat')
    
    websocketRef.current.onmessage = (event) => {
      const response = JSON.parse(event.data)
      if (response.type === 'response') {
        console.log('Agent response:', response.text)
      }
    }

    // Request access to webcam only
    async function setupWebcam() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true,
          audio: false  // Don't request audio access
        })
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (err) {
        console.error("Error accessing webcam:", err)
      }
    }

    setupWebcam()

    // Cleanup function
    return () => {
      websocketRef.current?.close()
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach(track => track.stop())
      }
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-[url('/oliver-call.jpg')] bg-cover bg-center bg-no-repeat before:content-[''] before:absolute before:inset-0 before:backdrop-blur-sm before:bg-black/40">
      {/* Name overlay */}
      <div className="absolute top-8 left-8">
        <h1 className="text-white text-3xl font-semibold tracking-tight">
          Oliver Kicks
        </h1>
      </div>

      {/* Self video feed */}
      <div className="absolute bottom-8 right-8 w-80 h-64 bg-black outline outline-4 outline-black/20 rounded-lg overflow-hidden shadow-lg" >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          controls={false}
          className="w-full h-full object-cover mirror"
        />
      </div>

      {/* Call controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4 p-4 bg-background/90 backdrop-blur-sm rounded-full">
        <Button 
          variant="destructive" 
          size="icon"
          className="rounded-full h-12 w-12"
        >
          <PhoneOff className="h-5 w-5" />
        </Button>
        <Button 
          variant="secondary" 
          size="icon"
          className="rounded-full h-12 w-12"
        >
          <Mic className="h-5 w-5" />
        </Button>
        <Button 
          variant="secondary" 
          size="icon"
          className="rounded-full h-12 w-12"
        >
          <Video className="h-5 w-5" />
        </Button>
        <Button 
          variant="secondary"
          className="rounded-full h-12 "
        >
          Complete Call
        </Button>
      </div>
    </div>
  )
}

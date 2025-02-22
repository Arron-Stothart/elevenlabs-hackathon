"use client"

import * as React from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface CallerInfoProps {
  companyName: string;
  onStartCall: () => void;
}

export default function CallerInfo({ companyName, onStartCall }: CallerInfoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-row items-center justify-center gap-6 text-center"
    >
      <div className="relative w-64 h-64 aspect-square mb-4">
        <Image
          src="/oliver-profile.jpeg"
          alt="Oliver Profile"
          fill
          className="rounded-2xl object-cover"
          priority
        />
      </div>
      
      <div className="flex flex-col items-start justify-start gap-2 h-64 max-w-2xl"> 
        <h2 className="text-2xl font-semibold">
          You will be speaking with Oliver Kicks...
        </h2>
      
        <p className="text-muted-foreground text-left">
          Partner at Concept Ventures, focusing on pre-seed investments in Games, Entertainment, and AI. Previously the firm's first employee in 2019, he serves as a Board Observer for companies like Waypoint and Eleven Labs. Oliver brings experience as an angel and crypto investor, combining his professional expertise with his passion for gaming and technology.
        </p>

        <Button 
          className="mt-4"
          onClick={onStartCall}
        >
          Start Video Call
        </Button>
      </div>
    </motion.div>
  )
} 
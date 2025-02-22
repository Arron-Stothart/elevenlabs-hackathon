"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import FileUpload from "@/components/FileUpload"
import CallerInfo from "@/components/CallerInfo"
import CallUI from "@/components/CallUI"

export default function StartPage() {
  const [stage, setStage] = React.useState<"upload" | "pre-call" | "call">("upload")
  const [companyName, setCompanyName] = React.useState("")

  const handleUploadComplete = (name: string) => {
    setCompanyName(name)
    setStage("pre-call")
  }

  const handleStartCall = () => {
    setStage("call")
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8">
      <AnimatePresence mode="wait">
        {stage === "upload" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <FileUpload onComplete={handleUploadComplete} />
          </motion.div>
        )}
        
        {stage === "pre-call" && (
          <motion.div
            key="pre-call"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <CallerInfo companyName={companyName} onStartCall={handleStartCall} />
          </motion.div>
        )}

        {stage === "call" && (
          <motion.div
            key="call"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CallUI />
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="absolute bottom-4 text-sm text-muted-foreground text-center">
        Powered by Ventro
      </div>
    </div>
  )
}


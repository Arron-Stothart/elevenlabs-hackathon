"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import FileUpload from "@/components/FileUpload"
import CallerInfo from "@/components/CallerInfo"
import CallUI from "@/components/CallUI"
import { Button } from "@/components/ui/button"

export default function StartPage() {
  const [stage, setStage] = React.useState<"upload" | "pre-call" | "call" | "complete">("upload")
  const [companyName, setCompanyName] = React.useState("")

  const handleUploadComplete = (name: string) => {
    setCompanyName(name)
    setStage("pre-call")
  }

  const handleStartCall = () => {
    setStage("call")
  }

  const handleCompleteCall = () => {
    setStage("complete")
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
            className="w-full items-center justify-center"
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
            className="w-full h-full"
            key="call"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CallUI onComplete={handleCompleteCall} />
          </motion.div>
        )}

        {stage === "complete" && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md"
          >
            <div className="bg-card p-8 rounded-lg border">
              <h2 className="text-2xl font-semibold mb-4">Thanks for your time!</h2>
              <p className="text-muted-foreground mb-2">
                The meeting has been completed successfully. We'll be in touch soon if there's a match.
              </p>
              <p className="text-muted-foreground mb-6">
              </p>
              <form onSubmit={(e) => {
                e.preventDefault()
                // Handle email submission here
                const email = (e.target as HTMLFormElement).email.value
                console.log("Email submitted:", email)
              }}>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full p-3 rounded-md border mb-4"
                  required
                />
                <Button type="submit" className="w-full">
                  Confirm
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {stage !== "call" && (
        <div className="absolute bottom-4 text-sm text-muted-foreground text-center">
          Powered by Ventro
        </div>
      )}
    </div>
  )
}


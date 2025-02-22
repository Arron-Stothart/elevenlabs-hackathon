"use client"

import * as React from "react"
import { Box, Upload, Presentation, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export default function FileUpload() {
  const [isDragging, setIsDragging] = React.useState(false)
  const [files, setFiles] = React.useState<File[]>([])
  const [isUploaded, setIsUploaded] = React.useState(false)

  const onDragOver = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const onDragLeave = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const onDrop = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    const pdfFiles = droppedFiles.filter((file) => file.type === "application/pdf")
    
    if (pdfFiles.length > 0) {
      setFiles((prevFiles) => [...prevFiles, ...pdfFiles])
      setIsUploaded(true)
    }
  }, [])

  const onFileSelect = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const selectedFiles = Array.from(e.target.files)
      const pdfFiles = selectedFiles.filter((file) => file.type === "application/pdf")

      if (pdfFiles.length > 0) {
        setFiles((prevFiles) => [...prevFiles, ...pdfFiles])
        setIsUploaded(true)
      }
    }
  }, [])

  return (
    <div className="w-full max-w-6xl mx-auto p-4 h-[80vh]">
      <div
        className={cn(
          "relative rounded-lg border-2 border-gray-200 p-12 h-full",
          "hover:border-muted-foreground/50 transition-colors",
          "flex flex-col items-center justify-center gap-6",
          isDragging && "border-primary bg-primary/5"
        )}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="text-xs font-medium">
            BETA
          </Badge>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={isUploaded ? "uploaded" : "upload"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              {isUploaded ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.5 }}
                >
                  <Check className="h-6 w-6 text-green-500" />
                </motion.div>
              ) : (
                <Presentation className="h-6 w-6 text-muted-foreground" />
              )}
            </div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {isUploaded ? (
                <>
                  <h2 className="text-xl font-semibold mb-2">PDF Uploaded Successfully!</h2>
                  <p className="text-sm text-muted-foreground mb-2">Your pitch deck is ready for review</p>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold mb-2">Upload your Pitch Deck</h2>
                  <p className="text-sm text-muted-foreground mb-2">Oliver Kicks will review the deck before your personalised interview</p>
                </>
              )}
            </motion.div>

            {!isUploaded && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  Upload PDF files or drag & drop
                </label>

                <input 
                  id="file-upload" 
                  type="file" 
                  className="sr-only" 
                  accept=".pdf" 
                  multiple 
                  onChange={onFileSelect} 
                />
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
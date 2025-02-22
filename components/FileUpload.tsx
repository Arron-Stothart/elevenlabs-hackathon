"use client"

import * as React from "react"
import { Box, Upload, Presentation, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface StructuredData {
  company_name: string;
  company_description: string;
  location: string;
  industry: string;
  has_revenue: boolean;
  has_users: boolean;
}

export default function FileUpload() {
  const [isDragging, setIsDragging] = React.useState(false)
  const [files, setFiles] = React.useState<File[]>([])
  const [isUploading, setIsUploading] = React.useState(false)
  const [isUploaded, setIsUploaded] = React.useState(false)
  const [structuredData, setStructuredData] = React.useState<StructuredData | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const saveFile = async (file: File): Promise<string> => {
    // Generate a unique filename with timestamp
    const timestamp = new Date().getTime()
    const filename = `${timestamp}-${file.name}`
    const filepath = `/uploads/${filename}`

    try {
      // Save file to local filesystem
      const response = await fetch('/api/save-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename,
          content: await file.arrayBuffer().then(buffer => 
            Buffer.from(buffer).toString('base64')
          )
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save file');
      }

      return filename;
    } catch (error) {
      throw new Error('Failed to save file to server');
    }
  }

  const uploadFile = async (file: File) => {
    setIsUploading(true)
    setError(null)
    setStructuredData(null)
    
    try {
      // First save the file
      const filename = await saveFile(file)

      // Then send the filename to the parse endpoint
      const response = await fetch('http://localhost:8000/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || `Processing failed: ${response.statusText}`)
      }

      const data = await response.json()
      setStructuredData(data.structured_data)
      setIsUploaded(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file')
      setIsUploaded(false)
    } finally {
      setIsUploading(false)
    }
  }

  const onDragOver = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const onDragLeave = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const onDrop = React.useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    const pdfFiles = droppedFiles.filter((file) => file.type === "application/pdf")
    
    if (pdfFiles.length > 0) {
      setFiles((prevFiles) => [...prevFiles, ...pdfFiles])
      await uploadFile(pdfFiles[0]) // Upload the first PDF file
    }
  }, [])

  const onFileSelect = React.useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const selectedFiles = Array.from(e.target.files)
      const pdfFiles = selectedFiles.filter((file) => file.type === "application/pdf")

      if (pdfFiles.length > 0) {
        setFiles((prevFiles) => [...prevFiles, ...pdfFiles])
        await uploadFile(pdfFiles[0]) // Upload the first PDF file
      }
    }
  }, [])

  return (
    <div className="w-full max-w-6xl mx-auto p-4 h-[80vh]">
      <div
        className={cn(
          "relative rounded-lg p-12 h-full",
          "flex flex-col items-center justify-center gap-6",
          isDragging && "border-primary bg-primary/5"
        )}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >

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
              {isUploading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="text-primary"
                >
                  <Upload className="h-6 w-6" />
                </motion.div>
              ) : isUploaded && structuredData ? (
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
              {isUploading ? (
                <>
                  <h2 className="text-xl font-semibold mb-2">Processing PDF...</h2>
                  <p className="text-sm text-muted-foreground">This may take a few moments</p>
                </>
              ) : isUploaded && structuredData ? (
                <>
                  <h2 className="text-xl font-semibold mb-2">Analysis Complete!</h2>
                  <p className="text-sm text-muted-foreground mb-4">Here's what we found:</p>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 text-left bg-muted p-6 rounded-lg space-y-2 w-full max-w-md"
                  >
                    <p><span className="font-medium">Company:</span> {structuredData.company_name}</p>
                    <p><span className="font-medium">Description:</span> {structuredData.company_description}</p>
                    <p><span className="font-medium">Industry:</span> {structuredData.industry}</p>
                    <p><span className="font-medium">Location:</span> {structuredData.location}</p>
                    <p><span className="font-medium">Revenue:</span> {structuredData.has_revenue ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Active Users:</span> {structuredData.has_users ? "Yes" : "No"}</p>
                  </motion.div>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold mb-2">Upload your Pitch Deck</h2>
                  <p className="text-sm text-muted-foreground mb-2">
                    Oliver Kicks will review the deck before your personalised interview
                  </p>
                </>
              )}
              
              {error && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-sm mt-4 p-3 bg-red-50 rounded-md"
                >
                  {error}
                </motion.p>
              )}
            </motion.div>

            {!isUploaded && !isUploading && (
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
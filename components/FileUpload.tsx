"use client"

import * as React from "react"
import { Box, Upload, Presentation, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import CallerInfo from "@/components/CallerInfo"
import { useRouter } from "next/navigation"

interface StructuredData {
  company_name: string;
  company_description: string;
  location: string;
  industry: string;
  has_revenue: boolean;
  has_users: boolean;
}

interface FileUploadProps {
  onComplete: (companyName: string) => void;
}

export default function FileUpload({ onComplete }: FileUploadProps) {
  const router = useRouter()
  const [isDragging, setIsDragging] = React.useState(false)
  const [files, setFiles] = React.useState<File[]>([])
  const [isUploading, setIsUploading] = React.useState(false)
  const [isUploaded, setIsUploaded] = React.useState(false)
  const [structuredData, setStructuredData] = React.useState<StructuredData | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [editedData, setEditedData] = React.useState<StructuredData | null>(null)
  const [isConfirmed, setIsConfirmed] = React.useState(false)

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

  // Add this effect to initialize editedData when structuredData is received
  React.useEffect(() => {
    if (structuredData) {
      setEditedData(structuredData)
    }
  }, [structuredData])

  const handleConfirm = async () => {
    if (editedData?.company_name) {
      onComplete(editedData.company_name)
    }
  }

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
            key={isConfirmed ? "caller" : isUploaded ? "uploaded" : "upload"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-6"
          >
            {isConfirmed ? (
              <CallerInfo companyName={editedData?.company_name || 'your company'} />
            ) : isUploading ? (
              <>
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="text-primary"
                  >
                    <Upload className="h-6 w-6" />
                  </motion.div>
                </div>

                <motion.div
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-xl font-semibold mb-2">Processing PDF...</h2>
                  <p className="text-sm text-muted-foreground">This may take a few moments</p>
                </motion.div>
              </>
            ) : isUploaded && structuredData ? (
              <>
                <h2 className="text-xl font-semibold mb-2">We need to confirm some details</h2>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-left w-full max-w-5xl"
                >
                  <div className="bg-card border rounded-lg shadow-sm p-6">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="company_name">
                          Company Name
                        </Label>
                        <Input
                          id="company_name"
                          value={editedData?.company_name || ''}
                          onChange={(e) => setEditedData(prev => prev ? {...prev, company_name: e.target.value} : null)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="company_description">
                          Company Description
                        </Label>
                        <Textarea
                          id="company_description"
                          value={editedData?.company_description || ''}
                          onChange={(e) => setEditedData(prev => prev ? {...prev, company_description: e.target.value} : null)}
                          className="resize-none"
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="industry">
                          Industry
                        </Label>
                        <Input
                          id="industry"
                          value={editedData?.industry || ''}
                          onChange={(e) => setEditedData(prev => prev ? {...prev, industry: e.target.value} : null)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">
                          Location
                        </Label>
                        <Input
                          id="location"
                          value={editedData?.location || ''}
                          onChange={(e) => setEditedData(prev => prev ? {...prev, location: e.target.value} : null)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id="has_revenue"
                            checked={editedData?.has_revenue || false}
                            onCheckedChange={(checked) => setEditedData(prev => prev ? {...prev, has_revenue: checked as boolean} : null)}
                            className="rounded-full"
                          />
                          <Label htmlFor="has_revenue">
                            Has Revenue
                          </Label>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id="has_users"
                            checked={editedData?.has_users || false}
                            onCheckedChange={(checked) => setEditedData(prev => prev ? {...prev, has_users: checked as boolean} : null)}
                            className="rounded-full"
                          />
                          <Label htmlFor="has_users">
                            Has Active Users
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button 
                    className="w-full mt-6" 
                    onClick={handleConfirm}
                    variant="default"
                  >
                    Submit
                  </Button>
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
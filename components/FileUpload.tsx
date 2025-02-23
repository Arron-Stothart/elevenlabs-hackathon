"use client";

import * as React from "react";
import { Box, Upload, Presentation, Check, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import CallerInfo from "@/components/CallerInfo";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid'
import { saveStartup, addFile } from '@/persistence/storage'

interface StructuredData {
  company_name: string;
  company_description: string;
  location: string;
  industry: string;
  has_revenue: boolean;
  has_users: boolean;
  funding_round?: string;
}

interface FileUploadProps {
  onComplete: (companyName: string) => void;
}

export default function FileUpload({ onComplete }: FileUploadProps) {
  const router = useRouter();
  const [isDragging, setIsDragging] = React.useState(false);
  const [files, setFiles] = React.useState<File[]>([]);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isUploaded, setIsUploaded] = React.useState(false);
  const [structuredData, setStructuredData] =
    React.useState<StructuredData | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [editedData, setEditedData] = React.useState<StructuredData | null>(
    null
  );
  const [isConfirmed, setIsConfirmed] = React.useState(false);

  const saveFile = async (file: File): Promise<string> => {
    const timestamp = new Date().getTime();
    const filename = `${timestamp}-${file.name}`;
    const filepath = `/persistence/data/files/${filename}`;

    try {
      // Convert file to base64
      const fileBuffer = await file.arrayBuffer();
      const base64Content = Buffer.from(fileBuffer).toString('base64');

      const response = await fetch("/api/save-file", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename,
          content: base64Content,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save file");
      }

      return filepath;
    } catch (error) {
      throw new Error("Failed to save file to server");
    }
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setError(null);
    setStructuredData(null);

    try {
      // First save the file
      const filepath = await saveFile(file);

      // Then send the filepath to the parse endpoint
      const response = await fetch("http://localhost:8000/parse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filepath }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || `Processing failed: ${response.statusText}`
        );
      }

      const data = await response.json();
      setStructuredData(data.structured_data);
      setIsUploaded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process file");
      setIsUploaded(false);
    } finally {
      setIsUploading(false);
    }
  };

  const onDragOver = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = React.useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const pdfFiles = droppedFiles.filter(
      (file) => file.type === "application/pdf"
    );

    if (pdfFiles.length > 0) {
      setFiles((prevFiles) => [...prevFiles, ...pdfFiles]);
      await uploadFile(pdfFiles[0]); // Upload the first PDF file
    }
  }, []);

  const onFileSelect = React.useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) {
        const selectedFiles = Array.from(e.target.files);
        const pdfFiles = selectedFiles.filter(
          (file) => file.type === "application/pdf"
        );

        if (pdfFiles.length > 0) {
          setFiles((prevFiles) => [...prevFiles, ...pdfFiles]);
          await uploadFile(pdfFiles[0]); // Upload the first PDF file
        }
      }
    },
    []
  );

  // Add this effect to initialize editedData when structuredData is received
  React.useEffect(() => {
    if (structuredData) {
      setEditedData(structuredData);
    }
  }, [structuredData]);

  const handleConfirm = async () => {
    if (editedData?.company_name) {
      const startupId = uuidv4()
      const startup = {
        id: startupId,
        name: editedData.company_name,
        industry: editedData.industry || '',
        location: editedData.location || '',
        fundingRound: editedData.funding_round || '',
        summary: editedData.company_description || '',
        tags: [],
        pitchDate: new Date().toISOString(),
        structuredData: {
          company_description: editedData.company_description || '',
          has_revenue: editedData.has_revenue || false,
          has_users: editedData.has_users || false
        }
      }

      try {
        // Save the startup data
        await saveStartup(startup)

        // If there are files, save them with paths relative to persistence directory
        if (files.length > 0) {
          for (const file of files) {
            await addFile(startupId, {
              name: file.name,
              path: `/persistence/data/files/${file.name}`,
              type: file.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'other'
            })
          }
        }

        onComplete(editedData.company_name)
      } catch (error) {
        console.error('Error saving startup:', error)
        // Optionally show error to user
      }
    }
  };

  return (
    <div className="w-full max-w-full mx-auto p-4">
      <AnimatePresence mode="wait">
          <motion.div
            key={isConfirmed ? "caller" : isUploaded ? "uploaded" : "upload"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-6 w-full"
          >
            {isConfirmed ? (
              <CallerInfo
                companyName={editedData?.company_name || "your company"}
                onStartCall={() => {}}
              />
            ) : isUploading ? (
              <>
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
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
                  <h2 className="text-xl font-semibold mb-2">
                    Processing PDF...
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    This may take a few moments
                  </p>
                </motion.div>
              </>
            ) : isUploaded && structuredData ? (
              <>
                <h2 className="text-2xl font-semibold">
                  We need to confirm some details
                </h2>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-left max-w-xl w-full"
                >
                  <div className="bg-card border rounded-lg shadow-sm p-6 w-full">
                    <div className="space-y-6">
                      <div className="space-y-1.5">
                        <Label htmlFor="company_name">Company Name</Label>
                        <Input
                          id="company_name"
                          value={editedData?.company_name || ""}
                          onChange={(e) =>
                            setEditedData((prev) =>
                              prev
                                ? { ...prev, company_name: e.target.value }
                                : null
                            )
                          }
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="company_description">
                          Company Description
                        </Label>
                        <Textarea
                          id="company_description"
                          value={editedData?.company_description || ""}
                          onChange={(e) =>
                            setEditedData((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    company_description: e.target.value,
                                  }
                                : null
                            )
                          }
                          className="resize-none"
                          rows={3}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="industry">Industry</Label>
                        <Input
                          id="industry"
                          value={editedData?.industry || ""}
                          onChange={(e) =>
                            setEditedData((prev) =>
                              prev
                                ? { ...prev, industry: e.target.value }
                                : null
                            )
                          }
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={editedData?.location || ""}
                          onChange={(e) =>
                            setEditedData((prev) =>
                              prev
                                ? { ...prev, location: e.target.value }
                                : null
                            )
                          }
                        />
                      </div>

                      <div className="space-y-1.5 w-[400px]">
                        <Label>Funding Round</Label>
                        <div className="flex rounded-lg border p-1 space-x-1">
                          {["Pre-seed", "Seed", "Series A", "Series B+"].map(
                            (round) => (
                              <button
                                key={round}
                                onClick={() =>
                                  setEditedData((prev) =>
                                    prev
                                      ? { ...prev, funding_round: round }
                                      : null
                                  )
                                }
                                className={cn(
                                  "flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                                  editedData?.funding_round === round
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-muted"
                                )}
                              >
                                {round}
                              </button>
                            )
                          )}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label>Do you have revenue?</Label>
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-2">
                            <div
                              onClick={() =>
                                setEditedData((prev) =>
                                  prev ? { ...prev, has_revenue: true } : null
                                )
                              }
                              className={cn(
                                "h-4 w-4 rounded-full border transition-colors cursor-pointer",
                                editedData?.has_revenue
                                  ? "bg-primary border-primary"
                                  : "border-input"
                              )}
                            />
                            <Label className="cursor-pointer">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div
                              onClick={() =>
                                setEditedData((prev) =>
                                  prev ? { ...prev, has_revenue: false } : null
                                )
                              }
                              className={cn(
                                "h-4 w-4 rounded-full border transition-colors cursor-pointer",
                                editedData?.has_revenue === false
                                  ? "bg-primary border-primary"
                                  : "border-input"
                              )}
                            />
                            <Label className="cursor-pointer">No</Label>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label>Are People Using your Product?</Label>
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-2">
                            <div
                              onClick={() =>
                                setEditedData((prev) =>
                                  prev ? { ...prev, has_users: true } : null
                                )
                              }
                              className={cn(
                                "h-4 w-4 rounded-full border transition-colors cursor-pointer",
                                editedData?.has_users
                                  ? "bg-primary border-primary"
                                  : "border-input"
                              )}
                            />
                            <Label className="cursor-pointer">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div
                              onClick={() =>
                                setEditedData((prev) =>
                                  prev ? { ...prev, has_users: false } : null
                                )
                              }
                              className={cn(
                                "h-4 w-4 rounded-full border transition-colors cursor-pointer",
                                editedData?.has_users === false
                                  ? "bg-primary border-primary"
                                  : "border-input"
                              )}
                            />
                            <Label className="cursor-pointer">No</Label>
                          </div>
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
                <div className="flex flex-col items-start w-full px-56">
                  <h1 className="text-7xl mb-6 text-start font-[var(--font-whyte-inktrap)]">
                    Pitch to <span className="text-primary">Concept Ventures</span><br /> with Ventro.
                  </h1>
                  <p className="text-muted-foreground mb-8 text-xl">A chance to speak with our partners any time</p>
                  <div className="w-full mx-auto p-8 py-24 text-center space-y-6 bg-card border rounded-lg shadow-lg">
                    <div className="mx-auto w-12 h-12 flex items-center justify-center">
                      <FileText className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h2 className="text-2xl font-semibold">Upload your pitch deck</h2>
                    <p className="text-muted-foreground">
                      
                    </p>
                    <div>
                      <Button
                        size="lg"
                        variant="default"
                        className="cursor-pointer"
                        onClick={() => document.getElementById('file-upload')?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload pitch deck
                      </Button>
                      <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept=".pdf"
                        onChange={onFileSelect}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="w-full mt-8 px-56">
                  <div className="flex justify-between items-center gap-4">
                    <div className="h-4 flex-1 bg-muted rounded-full" />
                    <div className="h-4 flex-1 bg-muted rounded-full" />
                    <div className="h-4 flex-1 bg-muted rounded-full" />
                  </div>
                  <div className="flex justify-between mt-3 text-md text-black">
                    <div className="flex-1 text-center">
                      Upload Slide Deck <span className="text-muted-foreground">2m</span>
                    </div>
                    <div className="flex-1 text-center">
                      Speak with Partner <span className="text-muted-foreground">10m</span>
                    </div>
                    <div className="flex-1 text-center">
                      We'll get back to you <span className="text-muted-foreground">ASAP</span>
                    </div>
                  </div>
                </div>
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
        </AnimatePresence>
    </div>
  );
}

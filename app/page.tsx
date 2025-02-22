"use client"

import FileUpload from "@/components/FileUpload"

export default function StartPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8">
      <FileUpload />
      <div className="absolute bottom-4 text-sm text-muted-foreground text-center">
        Powered by Ventro
      </div>
    </div>
  )
}


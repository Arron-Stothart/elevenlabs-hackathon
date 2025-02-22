"use client"

import { useState } from "react"

export default function StartPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-4">
          <label 
            htmlFor="pdf-upload" 
            className="block p-8 border-2 border-dashed rounded-lg text-center cursor-pointer hover:bg-gray-50"
          >
            <span className="text-sm text-muted-foreground">Drop your pitch deck PDF here or click to upload</span>
            <input
              id="pdf-upload"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const formData = new FormData();
                formData.append('pdf', file);

                try {
                  const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                  });
                  
                  if (!response.ok) throw new Error('Upload failed');
                  
                  const data = await response.json();
                  console.log('Upload successful:', data);
                } catch (error) {
                  console.error('Upload error:', error);
                }
              }}
            />
          </label>
        </div>
        <p className="text-sm text-muted-foreground text-center">Powered by Ventro</p>
      </div>
    </div>
  )
}


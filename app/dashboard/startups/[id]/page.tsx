'use client'

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import ChatSidebar from "@/components/ChatSidebar";
import { StartupDetails } from "@/types/startup";
import { Button } from "@/components/ui/button";
import { Captions, Presentation } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const startup: StartupDetails = {
  id: "1",
  name: "Quantum Compute Labs",
  industry: "Quantum Computing",
  location: "Cambridge, MA",
  fundingRound: "Series A",
  summary: "Building next-gen quantum processors for AI acceleration. Novel approach reduces decoherence by 100x. Team from MIT and Google Quantum AI. $2M in LOIs from major cloud providers.",
  tags: ["Deep Tech", "Hardware", "AI Infrastructure"],
  pitchDate: "2024-03-15",
};

export default function StartupPage({ params }: { params: { id: string } }) {
  const editor = useCreateBlockNote({
    initialContent: [
      {
        type: "heading",
        props: { level: 3 },
        content: "Company Overview"
      },
      {
        type: "paragraph",
        content: startup.summary
      },
      {
        type: "heading",
        props: { level: 3 },
        content: "Key Information"
      },
      {
        type: "bulletListItem",
        content: `Industry: ${startup.industry}`
      },
      {
        type: "bulletListItem",
        content: `Location: ${startup.location}`
      },
      {
        type: "bulletListItem",
        content: `Funding Round: ${startup.fundingRound}`
      },
      {
        type: "heading",
        props: { level: 3 },
        content: "Notes"
      },
      {
        type: "paragraph",
        content: `Add your personal notes about ${startup.name} here...`
      }
    ]
  });

  return (
    <div className="flex">
      <main className="flex-1 container p-4 md:p-6 relative">
        <div className="flex flex-col px-32">
          <div className="flex flex-col mt-4 ml-[48px]">
            <h1 className="text-3xl font-bold mb-4">{startup.name}</h1>
            <div className="flex gap-2 mb-8 px-2">
              <span className="px-3 py-1 border border-gray-300 text-gray-600 text-sm rounded-sm">
                {new Date().toLocaleDateString()}
              </span>
              <span className="px-3 py-1 border border-gray-300 text-gray-600 text-sm rounded-sm">
                Oliver Kicks
              </span>
            </div>
          </div>
          <BlockNoteView editor={editor} theme="light" />
        </div>
        
        {/* Control panel */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4 p-4 bg-secondary/50 backdrop-blur-sm shaddow-md rounded-full">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="secondary" 
                  size="icon"
                  className="rounded-full h-12 w-12"
                >
                  <Captions className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View Transcript</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="secondary" 
                  size="icon"
                  className="rounded-full h-12 w-12"
                >
                  <Presentation className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Slide Deck</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </main>
      <ChatSidebar />
    </div>
  );
}

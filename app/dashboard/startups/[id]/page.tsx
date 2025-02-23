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
  name: "Cleo",
  industry: "Fintech",
  location: "London, UK",
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
        props: { level: 2 },
        content: "Quick Facts"
      },
      {
        type: "bulletListItem",
        content: `Company: ${startup.name}`
      },
      {
        type: "bulletListItem",
        content: "One-line description: An AI assistant for your money"
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
        type: "bulletListItem",
        content: "User status: Has users, growing quickly (27% week-on-week growth)"
      },
      {
        type: "heading",
        props: { level: 2 },
        content: "Team"
      },
      {
        type: "bulletListItem",
        content: "Key personality traits and impressions: Founder is enthusiastic"
      },
      {
        type: "bulletListItem",
        content: "Company background: An Entrepreneur First company"
      },
      {
        type: "heading",
        props: { level: 2 },
        content: "Problem"
      },
      {
        type: "bulletListItem",
        content: "Target audience and pain points: Millennials who don't trust or like their bank (73% would rather bank with Facebook, Google or Apple), experience:"
      },
      {
        type: "bulletListItem",
        content: "- Lack of control (spending tracking requires hours in Excel)"
      },
      {
        type: "bulletListItem",
        content: "- Extortionate fees and hidden charges"
      },
      {
        type: "bulletListItem",
        content: "- Inconvenience (multiple passwords, call centers)"
      },
      {
        type: "bulletListItem",
        content: "Current solutions and limitations: Traditional banks are not user-friendly or trustworthy for millennials"
      },
      {
        type: "heading",
        props: { level: 2 },
        content: "Product"
      },
      {
        type: "bulletListItem",
        content: "Core solution and functionality: An AI-powered personal financial advisor that:"
      },
      {
        type: "bulletListItem",
        content: "- Integrates with users' bank accounts"
      },
      {
        type: "bulletListItem",
        content: "- Provides personalized advice and insights through chat interface"
      },
      {
        type: "bulletListItem",
        content: "- Helps track spending, budget, and save"
      },
      {
        type: "bulletListItem",
        content: "- Sends intelligent notifications"
      },
      {
        type: "bulletListItem",
        content: "- Available across multiple messaging channels with mobile app"
      },
      {
        type: "bulletListItem",
        content: "Key differentiators:"
      },
      {
        type: "bulletListItem",
        content: "- Millennial-friendly personality"
      },
      {
        type: "bulletListItem",
        content: "- Conversational interface"
      },
      {
        type: "bulletListItem",
        content: "- Direct bank integration"
      },
      {
        type: "bulletListItem",
        content: "- Ability to move funds between accounts"
      },
      {
        type: "bulletListItem",
        content: "- Can help chase money owed by friends"
      },
      {
        type: "bulletListItem",
        content: "- Helps users switch to better financial products"
      },
      {
        type: "bulletListItem",
        content: "Technical details:"
      },
      {
        type: "bulletListItem",
        content: "- Uses open banking APIs (enabled by PSD2 regulation)"
      },
      {
        type: "bulletListItem",
        content: "- Integrates with Nutmeg and other financial services"
      },
      {
        type: "heading",
        props: { level: 2 },
        content: "Go-to-Market"
      },
      {
        type: "bulletListItem",
        content: "Business model and revenue streams:"
      },
      {
        type: "bulletListItem",
        content: "- Product referrals & Lead Generation"
      },
      {
        type: "bulletListItem",
        content: "- £22+ yearly revenue per user potential"
      },
      {
        type: "bulletListItem",
        content: "- Market opportunity: £220M - £350M (assuming 10-15M potential customers)"
      },
      {
        type: "bulletListItem",
        content: "- Additional opportunity in credit market (£200B+ in UK)"
      },
      {
        type: "heading",
        props: { level: 2 },
        content: "Traction"
      },
      {
        type: "bulletListItem",
        content: "Current metrics and growth:"
      },
      {
        type: "bulletListItem",
        content: "- 272 bank connects after 7 weeks (beta)"
      },
      {
        type: "bulletListItem",
        content: "- 27% week-on-week growth"
      },
      {
        type: "bulletListItem",
        content: "- 64% weekly user engagement"
      },
      {
        type: "bulletListItem",
        content: "- 5000 messages sent to Cleo"
      },
      {
        type: "heading",
        props: { level: 2 },
        content: "Additional Key Insights"
      },
      {
        type: "bulletListItem",
        content: "Vision: Become the banking platform of the future by linking innovative financial services to bank accounts"
      },
      {
        type: "bulletListItem",
        content: "Strategy: Focus on user experience rather than becoming a bank"
      },
      {
        type: "bulletListItem",
        content: "Regulatory advantage: PSD2 regulation enables open banking APIs"
      }
    ]
  });

  const getEditorContent = () => {
    return JSON.stringify(editor.document);
  };

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
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4 p-4 bg-secondary/50 backdrop-blur-sm shadow-md rounded-full z-10">
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
      <ChatSidebar getContext={getEditorContent} />
    </div>
  );
}

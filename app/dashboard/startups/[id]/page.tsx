'use client'

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { startups } from "../../page";
import { notFound } from "next/navigation";
import ChatSidebar from "@/components/ChatSidebar";

export default function StartupPage({ params }: { params: { id: string } }) {
  const startup = startups.find((s) => s.id === params.id);
  
  if (!startup) {
    notFound();
  }

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
      <main className="flex-1 container p-4 md:p-6 ">
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
      </main>
      <ChatSidebar />
    </div>
  );
}

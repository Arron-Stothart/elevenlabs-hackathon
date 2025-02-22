'use client'

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { startups } from "../../page";
import { notFound } from "next/navigation";
import * as shiki from 'shiki'

export default function StartupPage({ params }: { params: { id: string } }) {
  const startup = startups.find((s) => s.id === params.id);
  
  if (!startup) {
    notFound();
  }

  const editor = useCreateBlockNote({
    initialContent: [
      {
        type: "heading",
        props: { level: 2 },
        content: startup.name
      },
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
    <main className="container mx-auto p-4 md:p-6">
      <BlockNoteView editor={editor} theme="light" />
    </main>
  );
}

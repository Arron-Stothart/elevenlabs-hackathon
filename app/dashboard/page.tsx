'use client'

import { useEffect, useState } from 'react'
import { getAllStartups } from '@/persistence/storage'
import { Startup } from '@/types/startup'
import Link from 'next/link'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export const startups: Startup[] = [
  {
    id: "1",
    name: "Quantum Compute Labs",
    industry: "Quantum Computing",
    location: "Cambridge, MA",
    fundingRound: "Series A",
    summary: "Building next-gen quantum processors for AI acceleration. Novel approach reduces decoherence by 100x. Team from MIT and Google Quantum AI. $2M in LOIs from major cloud providers.",
    tags: ["Deep Tech", "Hardware", "AI Infrastructure"],
    pitchDate: "2024-03-15",
  },
  {
    id: "2",
    name: "CarbonTrace",
    industry: "Climate Tech",
    location: "San Francisco, CA",
    fundingRound: "Seed",
    summary: "AI-powered supply chain emissions tracking platform. Already working with Fortune 500 clients. 300% QoQ growth. Former Tesla and Stripe founding engineers.",
    tags: ["Climate", "Enterprise", "B2B"],
    pitchDate: "2024-03-14",
  },
  {
    id: "3",
    name: "NeuroWrite",
    industry: "AI/ML",
    location: "New York, NY",
    fundingRound: "Pre-seed",
    summary: "Personalized AI writing assistant that adapts to individual style and brand voice. 50K active users, $100K MRR. Founded by ex-OpenAI NLP researcher.",
    tags: ["AI/ML", "B2B", "SaaS"],
    pitchDate: "2024-03-13",
  },
  {
    id: "4",
    name: "BioSequence",
    industry: "Biotech",
    location: "San Diego, CA",
    fundingRound: "Series B",
    summary: "ML-powered drug discovery platform. 10x faster protein folding predictions. Partnership with top 3 pharma company. Team from Moderna and DeepMind.",
    tags: ["Biotech", "AI/ML", "Healthcare"],
    pitchDate: "2024-03-12",
  },
  {
    id: "5",
    name: "SecureAI",
    industry: "Security",
    location: "Washington, D.C.",
    fundingRound: "Series A",
    summary: "AI-driven cybersecurity platform detecting zero-day threats. Used by 3 government agencies. 95% reduction in false positives. Founded by NSA veterans.",
    tags: ["Security", "Enterprise", "AI/ML"],
    pitchDate: "2024-03-11",
  },
  {
    id: "6",
    name: "AgriTech Solutions",
    industry: "Agriculture",
    location: "Salinas, CA",
    fundingRound: "Seed",
    summary: "Autonomous drone swarms for precision agriculture. Reducing water usage by 40%. Pilots with major US farms. Team from John Deere Autonomy.",
    tags: ["AgTech", "Robotics", "AI/ML"],
    pitchDate: "2024-03-10",
  }
]

export default function Dashboard() {
  const [startups, setStartups] = useState<Startup[]>([])

  useEffect(() => {
    // Fetch startups using the async function
    const fetchStartups = async () => {
      const data = await getAllStartups()
      setStartups(data)
    }
    
    fetchStartups()
  }, [])

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Startups Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {startups.map(startup => (
          <Link 
            key={startup.id} 
            href={`/dashboard/startups/${startup.id}`}
            className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{startup.name}</h2>
            <p className="text-gray-600 mb-4">{startup.summary}</p>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {startup.industry}
              </span>
              <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                {startup.fundingRound}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              {new Date(startup.pitchDate).toLocaleDateString()}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
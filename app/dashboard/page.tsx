import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { getAllStartups } from "@/persistence/storage"
import { Settings, Target } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export interface Startup {
  id: string
  name: string
  industry: string
  location: string
  fundingRound: string
  summary: string
  tags: string[]
  pitchDate: string
}

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

export default async function StartupsPage() {
  const startups = await getAllStartups();
  
  const placeholderStartup: Partial<Startup> = {
    industry: "Unspecified",
    location: "Location TBD",
    fundingRound: "Unknown",
    summary: "Details coming soon...",
    tags: ["Unclassified"],
    pitchDate: new Date().toISOString(),
  };

  return (
    <main className="container mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Target className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-semibold">Ventro</h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="shadow-none rounded-lg">Configure Persona</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">Investor Persona</DialogTitle>
              <DialogDescription className="text-base">
                Configure investment preferences and target metrics for your meetings.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-base font-medium">
                  Name
                </label>
                <input
                  id="name"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background"
                  placeholder="Enter your name"
                  defaultValue="Oliver Kicks"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="knowledgebase" className="text-base font-medium">
                  Knowledgebase
                </label>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      id="knowledgebase"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background"
                      placeholder="acme.com"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10"
                      type="button"
                    >
                      +
                    </Button>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-base">
                        https://www.conceptventures.vc
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 p-0 hover:bg-transparent"
                        >
                          <span className="sr-only">Remove</span>
                          ×
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-base">
                        https://www.conceptventures.vc/news/top-questions-vcs-ask-founders
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 p-0 hover:bg-transparent"
                        >
                          <span className="sr-only">Remove</span>
                          ×
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <label htmlFor="description" className="text-base font-medium">
                  Partner Bio
                </label>
                <textarea
                  id="description"
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background"
                  placeholder="Brief description of your role and investment focus"
                  defaultValue="Partner at Concept Ventures, focusing on pre-seed investments in Games, Entertainment, and AI. Previously the firm's first employee in 2019, he serves as a Board Observer for companies like Waypoint and Eleven Labs."
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="meetingGuidance" className="text-base font-medium">
                  Key Questions
                </label>
                <textarea
                  id="meetingGuidance"
                  className="flex min-h-[180px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background"
                  placeholder="Provide guidance for startup meetings and key questions to ask"
                  defaultValue={`
What experience/expertise do you have in this industry?
How is your product different?
How much does customer acquisition cost?
What is your go-to-market strategy?
How have customers been interacting with your product/service?`}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mb-8 shadow-none border">
        <CardContent className="p-6">
          <div className="flex gap-6">
            <div className="relative w-32 h-32">
              <Image
                src="/oliver-profile.jpeg"
                alt="Oliver Profile"
                fill
                className="rounded-lg object-cover"
                priority
              />
            </div>
            
            <div className="flex-1">
              <h1 className="text-2xl font-semibold mb-2">
                Oliver Kicks - Partner at Concept Ventures
              </h1>
              <p className="text-muted-foreground mb-4">
                Partner at Concept Ventures, focusing on pre-seed investments in Games, Entertainment, and AI. Previously the firm's first employee in 2019, he serves as a Board Observer for companies like Waypoint and Eleven Labs.
              </p>
              <div className="flex gap-2">
                <Badge variant="secondary">Games</Badge>
                <Badge variant="secondary">Entertainment</Badge>
                <Badge variant="secondary">AI</Badge>
                <Badge variant="secondary">Pre-seed</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {startups.map((startup) => {
          const startupWithDefaults = {
            ...placeholderStartup,
            ...startup
          };
          
          return (
            <Link 
              href={`/dashboard/startups/${startupWithDefaults.id}`} 
              key={startupWithDefaults.id}
              className="group"
            >
              <Card className="overflow-hidden shadow-none border hover:bg-gray-50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-medium">{startupWithDefaults.name}</h2>
                      <div className="text-sm text-muted-foreground">
                        {new Date(startupWithDefaults.pitchDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <svg 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        className="text-gray-400"
                      >
                        <path d="M5 12h14"/>
                        <path d="m12 5 7 7-7 7"/>
                      </svg>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-muted-foreground">{startupWithDefaults.summary}</p>
                  </div>

                  <div className="mt-6">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-blue-50">
                        {startupWithDefaults.fundingRound || "Unspecified"}
                      </Badge>
                      {startupWithDefaults.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </main>
  )
}
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Page() {
  const categories = [
    { icon: "trending-up", label: "SaaS" },
    { icon: "cpu", label: "AI/ML" },
    { icon: "cloud", label: "Cloud" },
    { icon: "shield", label: "Security" },
    { icon: "smartphone", label: "Mobile" },
    { icon: "database", label: "Web3" },
    { icon: "heart", label: "Health" },
    { icon: "zap", label: "Climate" },
    { icon: "shopping-cart", label: "E-commerce" },
    { icon: "dollar-sign", label: "Fintech" },
    { icon: "users", label: "B2B" },
    { icon: "globe", label: "D2C" },
  ]

  const interviews = [
    {
      title: "Seed Stage Evaluation",
      company: "General",
      description: "Evaluate early-stage startups efficiently",
      duration: "15m",
      difficulty: "Standard",
      bgColor: "bg-blue-50",
      logo: "/placeholder.svg",
    },
    {
      title: "Series A Deep Dive",
      company: "Growth",
      description: "Assess product-market fit and scalability",
      duration: "30m",
      difficulty: "Detailed",
      bgColor: "bg-green-50",
      logo: "/placeholder.svg",
    },
    {
      title: "Technical Assessment",
      company: "Tech",
      description: "Evaluate technical founders and solutions",
      duration: "25m",
      difficulty: "Technical",
      bgColor: "bg-purple-50",
      logo: "/placeholder.svg",
    },
    {
      title: "Market Analysis",
      company: "Strategy",
      description: "Test market understanding and positioning",
      duration: "20m",
      difficulty: "Strategic",
      bgColor: "bg-red-50",
      logo: "/placeholder.svg",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg" />
            <span className="font-semibold text-xl">Ventro</span>
            <span className="text-sm text-muted-foreground">AI Pitch Evaluation</span>
          </div>
          <Button variant="outline">Sign in</Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl font-bold tracking-tight mb-4">Automate Your Startup Evaluation Process</h1>
          <p className="text-xl text-muted-foreground">
            Screen startup pitches efficiently with AI-powered evaluation tools. Get consistent assessments, detailed analytics, and voice-matched feedback powered by ElevenLabs.
          </p>
        </div>

        <div className="mb-12 overflow-x-auto">
          <div className="flex gap-8 min-w-max px-4">
            {categories.map((category) => (
              <Link
                key={category.label}
                href="#"
                className="flex flex-col items-center gap-2 min-w-[80px] hover:text-primary transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                  <span className="lucide" data-icon={category.icon}></span>
                </div>
                <span className="text-sm">{category.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {interviews.map((interview) => (
            <div key={interview.title} className={`${interview.bgColor} rounded-xl p-6 space-y-4`}>
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                <Image src={interview.logo || "/placeholder.svg"} alt={interview.company} width={32} height={32} />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">{interview.title}</h3>
                <p className="text-sm text-muted-foreground">{interview.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 mr-1" />
                  {interview.duration}
                </div>
                <Badge variant="secondary">{interview.difficulty}</Badge>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}


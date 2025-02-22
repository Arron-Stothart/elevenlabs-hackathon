import Link from 'next/link'
import { Button } from '@/components/ui/button'

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
    <div className="flex min-h-screen flex-col">
      <header className="fixed w-full bg-white/80 backdrop-blur-sm border-b z-50">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-2xl font-bold">
              Ventro
            </Link>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/interview">
              <Button>Start Interview</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-32 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center">
              <h1 className="text-5xl font-bold tracking-tight mb-6">
                Voice-Powered Startup Interviews
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Have a natural conversation with our AI interviewer to share your startup's story. 
                No forms, no typing - just talk.
              </p>
              <div className="flex justify-center">
                <Link href="/interview">
                  <Button size="lg" className="px-12">Start Your Interview</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-gray-50">
          <div className="container mx-auto max-w-5xl px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary text-xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Start Interview</h3>
                <p className="text-gray-600">Begin the conversation with our voice-powered interviewer.</p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary text-xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Share Your Story</h3>
                <p className="text-gray-600">Speak naturally about your startup as the AI guides the conversation.</p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary text-xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Get Your Transcript</h3>
                <p className="text-gray-600">Receive a complete record of your interview responses.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto max-w-5xl px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 border rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Natural Conversation</h3>
                <p className="text-gray-600">Just talk naturally - our AI interviewer guides the discussion.</p>
              </div>
              <div className="p-6 border rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Smart Questions</h3>
                <p className="text-gray-600">Questions adapted for different startup stages and sectors.</p>
              </div>
              <div className="p-6 border rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Instant Transcript</h3>
                <p className="text-gray-600">Get a complete record of your responses immediately.</p>
              </div>
              <div className="p-6 border rounded-lg">
                <h3 className="text-xl font-semibold mb-2">No Setup Required</h3>
                <p className="text-gray-600">Start your interview instantly - no registration needed.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Ventro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}


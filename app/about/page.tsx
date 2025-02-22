import { Navigation } from '@/components/navigation'

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="container mx-auto py-8">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">About VentroAI</h1>
            
            <div className="prose prose-lg">
              <p className="text-xl text-gray-600 mb-8">
                VentroAI revolutionizes the venture capital due diligence process by providing voice-powered
                interviews for startup founders. Our platform enables VCs to conduct standardized,
                efficient, and insightful interviews while maintaining a personal touch through
                natural voice interactions.
              </p>

              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-gray-600 mb-8">
                We believe in making the fundraising process more efficient and equitable.
                By standardizing the initial interview process, we help VCs evaluate more startups
                while giving founders equal opportunities to present their vision.
              </p>

              <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
              <p className="text-gray-600 mb-8">
                VentroAI uses advanced voice technology to conduct natural, conversational interviews.
                Our AI interviewer asks questions verbally, listens to your responses, and provides
                a seamless experience that feels like talking to a real person. The entire conversation
                is transcribed and analyzed to provide valuable insights.
              </p>

              <h2 className="text-2xl font-semibold mb-4">Benefits</h2>
              <ul className="list-disc list-inside text-gray-600 mb-8 space-y-2">
                <li>Natural voice conversations</li>
                <li>Standardized evaluation process</li>
                <li>Time-efficient screening</li>
                <li>Detailed interview transcripts</li>
                <li>Reduced bias in initial evaluations</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
              <p className="text-gray-600">
                Ready to transform your startup evaluation process? Try our voice interview
                system today and experience the future of venture capital due diligence.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 
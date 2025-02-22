import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Ventro: AI-powered pitch simulations for venture capital</h1>
          </div>

          <div className="space-y-6 max-w-md">
            <p className="text-base text-muted-foreground">Create AI personas that match your investment thesis and communication style, enabling personalized pitch simulations with voice-matched responses.</p>

            <Button variant="outline" className="w-full h-12 text-base font-normal">
              Continue with Google
            </Button>

            <div className="flex items-center gap-4">
              <Separator className="flex-1" />
              <span className="text-sm text-muted-foreground">or</span>
              <Separator className="flex-1" />
            </div>

            <div className="space-y-4">
              <Input type="email" placeholder="partner@venturefund.com" className="h-12" />
              <Button className="w-full h-12 text-base bg-[#1a1f36] hover:bg-[#1a1f36]/90">Continue</Button>
            </div>

            <p className="text-sm text-muted-foreground text-center">
              By signing up, you agree to the{" "}
              <a href="#" className="underline hover:text-foreground">
                Terms of Use
              </a>
              ,{" "}
              <a href="#" className="underline hover:text-foreground">
                Privacy Notice
              </a>
              , and{" "}
              <a href="#" className="underline hover:text-foreground">
                Cookie Notice
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

// Load WhyteInktrap font
const whyteInktrap = localFont({
  src: '../public/WhyteInktrap.ttf',
  variable: '--font-whyte-inktrap'
})

export const metadata: Metadata = {
  title: 'Ventro - AI Startup Screening',
  description: 'Conduct AI-powered interviews with startup founders using natural voice interactions.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={whyteInktrap.variable}>
      <body>
        {children}
      </body>
    </html>
  )
}

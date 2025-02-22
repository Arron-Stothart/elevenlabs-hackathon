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

export interface StartupDetails extends Startup {
  structuredData?: {
    company_description: string
    has_revenue: boolean
    has_users: boolean
  }
  meetings?: {
    date: string
    notes: string
  }[]
  transcripts?: {
    date: string
    content: string
  }[]
  files?: {
    name: string
    path: string
    type: 'pdf' | 'md' | 'other'
    uploadedAt: string
  }[]
} 
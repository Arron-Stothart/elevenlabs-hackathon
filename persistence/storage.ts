"use server"

import { Startup, StartupDetails } from '@/types/startup'
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

// Ensure persistence directory exists
const PERSISTENCE_DIR = join(process.cwd(), 'persistence', 'data')
const STARTUPS_FILE = join(PERSISTENCE_DIR, 'startups.json')
const FILES_DIR = join(PERSISTENCE_DIR, 'files')

// Create directories if they don't exist
if (!existsSync(PERSISTENCE_DIR)) {
  mkdirSync(PERSISTENCE_DIR, { recursive: true })
}
if (!existsSync(FILES_DIR)) {
  mkdirSync(FILES_DIR, { recursive: true })
}

// Internal data store
let data: Record<string, StartupDetails> = {}

// Load data on initialization
try {
  if (existsSync(STARTUPS_FILE)) {
    const fileContent = readFileSync(STARTUPS_FILE, 'utf-8')
    data = JSON.parse(fileContent)
  }
} catch (error) {
  console.error('Error loading startup data:', error)
  data = {}
}

// Helper function to save data
function saveData() {
  try {
    writeFileSync(STARTUPS_FILE, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('Error saving startup data:', error)
  }
}

// Export server actions
export async function saveStartup(startup: StartupDetails) {
  data[startup.id] = startup
  saveData()
}

export async function addFile(
  startupId: string,
  file: { name: string; path: string; type: 'pdf' | 'md' | 'other' }
) {
  const startup = data[startupId]
  if (!startup) return

  startup.files = startup.files || []
  startup.files.push({
    ...file,
    uploadedAt: new Date().toISOString()
  })
  saveData()
}

export async function getAllStartups(): Promise<Startup[]> {
  return Object.values(data).map(startup => ({
    id: startup.id,
    name: startup.name,
    industry: startup.industry,
    location: startup.location,
    fundingRound: startup.fundingRound,
    summary: startup.summary,
    tags: startup.tags,
    pitchDate: startup.pitchDate
  }))
}

export async function getStartupById(id: string): Promise<StartupDetails | null> {
  return data[id] || null
} 
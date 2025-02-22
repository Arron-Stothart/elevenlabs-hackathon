# VentroAI - AI-Powered VC Interviews

VentroAI is a modern platform that enables VCs to conduct AI-powered interviews with startup founders using natural voice interactions. Built with Next.js, TypeScript, and the Eleven Labs API, it provides a seamless way to evaluate startup pitches and gather insights.

## Features

- 🎙️ Natural voice interactions powered by Eleven Labs AI
- 📝 Real-time transcription of founder responses
- 🔄 Customizable interview questions
- 📊 Progress tracking and interview management
- 🎯 Focused evaluation of startup potential

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- An Eleven Labs API key (get one at [elevenlabs.io](https://elevenlabs.io))

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ventroai.git
   cd ventroai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment variables file and configure it:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and add your Eleven Labs API key.

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Navigate to the interview page
2. Click "Start" to begin recording your response
3. Speak clearly into your microphone
4. Click "Stop" when you're done
5. The AI interviewer will respond and move to the next question

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Eleven Labs Conversation API

## Acknowledgments

- [Eleven Labs](https://elevenlabs.io) for their amazing voice AI technology
- [Next.js](https://nextjs.org) for the awesome React framework
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework

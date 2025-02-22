export const INTERVIEW_QUESTIONS = [
  {
    id: 'problem',
    question: 'What problem does your startup solve and what\'s your unique value proposition?',
    hint: 'Focus on the specific pain point and how your solution is different from existing alternatives.'
  },
  {
    id: 'market',
    question: 'Tell me about your target market and its size.',
    hint: 'Include both TAM (Total Addressable Market) and SAM (Serviceable Addressable Market) figures.'
  },
  {
    id: 'business-model',
    question: 'What\'s your business model and how do you plan to make money?',
    hint: 'Explain your revenue streams, pricing strategy, and unit economics.'
  },
  {
    id: 'traction',
    question: 'What traction have you achieved so far?',
    hint: 'Share key metrics, customer testimonials, and any notable milestones.'
  },
  {
    id: 'team',
    question: 'Tell me about your team and why you\'re the right people to solve this problem.',
    hint: 'Highlight relevant experience, domain expertise, and past successes.'
  }
]

export const AI_INTERVIEWER_PROMPTS = {
  welcome: 'Hello! I\'m your AI interviewer today. I\'ll be asking you some questions about your startup. Please speak clearly and naturally. Let\'s begin with understanding your startup better.',
  transition: 'Thank you for that answer. Let\'s move on to the next question.',
  clarification: 'Could you elaborate more on that point?',
  closing: 'Thank you for sharing all of that information about your startup. This concludes our interview.'
}

export const VOICE_SETTINGS = {
  stability: 0.5,
  similarity_boost: 0.75,
  style: 0.5,
  use_speaker_boost: true
} 
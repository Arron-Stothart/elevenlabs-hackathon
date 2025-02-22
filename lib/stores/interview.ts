import { create } from 'zustand'

interface InterviewState {
  currentQuestionIndex: number
  transcriptHistory: string[]
  setCurrentQuestionIndex: (index: number) => void
  addTranscript: (transcript: string) => void
  resetInterview: () => void
}

export const useInterviewStore = create<InterviewState>((set) => ({
  currentQuestionIndex: 0,
  transcriptHistory: [],
  setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
  addTranscript: (transcript) => 
    set((state) => ({ 
      transcriptHistory: [...state.transcriptHistory, transcript] 
    })),
  resetInterview: () => set({ 
    currentQuestionIndex: 0, 
    transcriptHistory: [] 
  })
})) 
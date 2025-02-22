import { create } from 'zustand'

interface InterviewState {
  currentQuestionIndex: number
  transcriptHistory: string[]
  isRecording: boolean
  setCurrentQuestionIndex: (index: number) => void
  addTranscript: (transcript: string) => void
  setIsRecording: (isRecording: boolean) => void
}

export const useInterviewStore = create<InterviewState>((set) => ({
  currentQuestionIndex: 0,
  transcriptHistory: [],
  isRecording: false,
  setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
  addTranscript: (transcript) =>
    set((state) => ({
      transcriptHistory: [...state.transcriptHistory, transcript],
    })),
  setIsRecording: (isRecording) => set({ isRecording }),
})) 
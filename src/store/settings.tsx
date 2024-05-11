import { create } from 'zustand'

interface ChunkerizerStore {
  size: number
  setSize: (size: number) => void
  overlap: number
  setOverlap: (overlap: number) => void
  chunks: {
    text: string
    tokens: number
  }[]
  setChunks: (chunks: { text: string; tokens: number }[]) => void
  contentTokens: number
  setContentTokens: (contentTokens: number) => void
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
}

export const useChunkerizerStore = create<ChunkerizerStore>()(set => ({
  size: 128,
  setSize: (size: number) => set(() => ({ size })),
  overlap: 0,
  setOverlap: (overlap: number) => set(() => ({ overlap })),
  chunks: [],
  setChunks: (chunks: { text: string; tokens: number }[]) => set(() => ({ chunks })),
  contentTokens: 0,
  setContentTokens: (contentTokens: number) => set(() => ({ contentTokens })),
  isLoading: false,
  setIsLoading: (isLoading: boolean) => set(() => ({ isLoading }))
}))
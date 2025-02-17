import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Conversation, Settings, TokenUsage } from '../types';

interface State {
  user: User | null;
  conversations: Conversation[];
  settings: Settings;
  tokenUsage: TokenUsage;
  selectedModel: string;
  setUser: (user: User | null) => void;
  addConversation: (conversation: Conversation) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  updateTokenUsage: (usage: Partial<TokenUsage>) => void;
  setSelectedModel: (model: string) => void;
}

const useStore = create<State>()(
  persist(
    (set) => ({
      user: null,
      conversations: [],
      settings: {
        model: 'gemini-2.0-flash',
        temperature: 0.7,
        maxTokens: 1000,
      },
      tokenUsage: {
        remaining: 100000,
        lastReset: Date.now(),
      },
      selectedModel: 'gemini-2.0-flash',
      setUser: (user) => set({ user }),
      addConversation: (conversation) =>
        set((state) => ({
          conversations: [conversation, ...state.conversations],
        })),
      updateSettings: (settings) =>
        set((state) => ({
          settings: { ...state.settings, ...settings },
        })),
      updateTokenUsage: (usage) =>
        set((state) => ({
          tokenUsage: { ...state.tokenUsage, ...usage },
        })),
      setSelectedModel: (model) => set({ selectedModel: model }),
    }),
    {
      name: 'chat-storage',
    }
  )
);

export default useStore;
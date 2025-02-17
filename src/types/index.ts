export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isGuest: boolean;
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
  attachments?: Attachment[];
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  timestamp: number;
  content?: string;
  role?: 'user' | 'assistant';
}

export interface Settings {
  model: 'gemini-2.0-flash' | 'gemini-2.0-flash-lite-preview-02-05' | 'gemini-1.5-flash' | 'gemini-1.5-flash-8b' | 'gemini-1.5-pro' | 'text-embedding-004';
  temperature: number;
  maxTokens: number;
}

export interface TokenUsage {
  remaining: number;
  lastReset: number;
}

export interface Attachment {
  id: string;
  file: File;
  type: string;
  name: string;
  size: number;
  content?: string;
}
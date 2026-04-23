/**
 * TypeScript type definitions for the Election Guide Bot
 * Ensures type safety and better developer experience
 */

// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name?: string;
  age?: number;
  state?: string;
  constituency?: string;
  isVoter?: boolean;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  language: 'en' | 'hi' | 'bn' | 'te' | 'ta' | 'mr' | 'gu' | 'kn' | 'ml' | 'pa' | 'or' | 'as';
  theme: 'light' | 'dark' | 'system';
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  electionReminders: boolean;
  resultUpdates: boolean;
  policyChanges: boolean;
  voterRegistration: boolean;
}

// Election Data Types
export interface ElectionPhase {
  id: number;
  name: string;
  description: string;
  startDate?: Date;
  endDate?: Date;
  duration: string;
  requirements: string[];
  importance: 'low' | 'medium' | 'high' | 'critical';
  resources: Resource[];
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'article' | 'video' | 'pdf' | 'tool' | 'form';
  language: string;
  verified: boolean;
}

export interface ElectionTimeline {
  id: string;
  year: number;
  type: 'lok_sabha' | 'rajya_sabha' | 'vidhan_sabha' | 'panchayat';
  phases: ElectionPhase[];
  currentPhase?: number;
  keyDates: KeyDate[];
}

export interface KeyDate {
  id: string;
  title: string;
  date: Date;
  description: string;
  importance: 'low' | 'medium' | 'high' | 'critical';
  actionRequired: boolean;
}

// Chat and AI Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: MessageMetadata;
}

export interface MessageMetadata {
  intent?: string;
  entities?: Entity[];
  sentiment?: 'positive' | 'negative' | 'neutral';
  confidence?: number;
  suggestedActions?: SuggestedAction[];
}

export interface Entity {
  type: string;
  value: string;
  confidence: number;
  startIndex: number;
  endIndex: number;
}

export interface SuggestedAction {
  type: 'quiz' | 'timeline' | 'eligibility' | 'resource' | 'form';
  title: string;
  description: string;
  url?: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: ChatMessage[];
  startedAt: Date;
  lastActivity: Date;
  context: ConversationContext;
}

export interface ConversationContext {
  userState: string;
  currentTopic?: string;
  previousQuestions: string[];
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  location?: string;
  voterStatus?: 'eligible' | 'ineligible' | 'registered' | 'unknown';
}

// Quiz Types
export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: QuizCategory;
  references?: string[];
}

export interface QuizOption {
  id: number;
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface QuizCategory {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export interface QuizResult {
  id: string;
  userId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  category: string;
  difficulty: string;
  completedAt: Date;
  feedback: string;
  recommendations: Resource[];
}

// Eligibility Types
export interface EligibilityCheck {
  id: string;
  userId: string;
  age: number;
  citizenship: string;
  residence: string;
  isRegistered: boolean;
  hasVoterID: boolean;
  constituency?: string;
  state: string;
  eligible: boolean;
  reasons: string[];
  nextSteps: string[];
  forms: Form[];
  checkedAt: Date;
}

export interface Form {
  id: string;
  name: string;
  description: string;
  url: string;
  type: 'registration' | 'correction' | 'transfer' | 'objection';
  deadline?: Date;
  requiredDocuments: string[];
  process: string[];
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: ApiError;
  timestamp: Date;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  stack?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Google Services Integration Types
export interface GoogleMapsResponse {
  results: GoogleMapsResult[];
  status: string;
}

export interface GoogleMapsResult {
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  place_id: string;
  types: string[];
}

export interface GeminiAIResponse {
  candidates: GeminiCandidate[];
  usage: GeminiUsage;
}

export interface GeminiCandidate {
  content: {
    parts: {
      text: string;
    }[];
  };
  finishReason: string;
}

export interface GeminiUsage {
  promptTokens: number;
  candidatesTokens: number;
  totalTokens: number;
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  'aria-label'?: string;
  'data-testid'?: string;
}

export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface ErrorState {
  hasError: boolean;
  error?: Error;
  message?: string;
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequireAtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> & Partial<Record<Exclude<keyof T, K>, undefined>>;
}[keyof T];

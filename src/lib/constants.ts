/**
 * Application constants and configuration
 * Centralized for maintainability and consistency
 */

export const APP_CONFIG = {
  name: 'ElectionGuide Bot',
  description: 'AI-powered election assistant for Indian elections',
  version: '1.0.0',
  author: 'ElectionGuide Team',
} as const;

export const ELECTION_CONSTANTS = {
  MIN_VOTING_AGE: 18,
  REGISTRATION_DEADLINE_DAYS: 21,
  LOK_SABHA_SEATS: 543,
  PHASE_COUNT: 12,
  ECI_WEBSITE: 'https://eci.gov.in',
  VOTER_REGISTRATION_PORTAL: 'https://voters.eci.gov.in',
} as const;

export const UI_CONSTANTS = {
  ANIMATION_DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },
  BREAKPOINTS: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
  },
  Z_INDEX: {
    BASE: 10,
    DROPDOWN: 1000,
    STICKY: 1100,
    MODAL: 1200,
    TOOLTIP: 1300,
    MAXIMUM: 9999,
  },
} as const;

export const API_ENDPOINTS = {
  SUPABASE_FUNCTIONS: {
    ELECTION_CHAT: '/functions/v1/election-chat',
  },
  GOOGLE_APIS: {
    GEMINI: 'https://generativelanguage.googleapis.com/v1beta',
    MAPS_GEOCODING: 'https://maps.googleapis.com/maps/api/geocode/json',
  },
} as const;

export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your connection and try again.',
  AUTHENTICATION: 'Authentication failed. Please log in again.',
  VALIDATION: 'Please check your input and try again.',
  RATE_LIMIT: 'Too many requests. Please wait a moment and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  CHAT_UNAVAILABLE: 'Chat service is currently unavailable. Please try again later.',
} as const;

export const SUCCESS_MESSAGES = {
  MESSAGE_SENT: 'Message sent successfully!',
  FORM_SUBMITTED: 'Form submitted successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
} as const;

export const ACCESSIBILITY_LABELS = {
  CHAT_BUTTON: 'Open chat assistant',
  TIMELINE_BUTTON: 'View election timeline',
  QUIZ_BUTTON: 'Start election quiz',
  ELIGIBILITY_BUTTON: 'Check voter eligibility',
  NAVIGATION_MENU: 'Navigation menu',
  SEARCH_INPUT: 'Search election information',
  LANGUAGE_SELECTOR: 'Select language',
  THEME_TOGGLE: 'Toggle dark/light theme',
} as const;

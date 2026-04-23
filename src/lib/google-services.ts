/**
 * Google Services integration for the Election Guide Bot
 * Implements meaningful integration with Google AI and Maps APIs
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { Loader } from '@googlemaps/js-api-loader';
import { CacheManager, retry, handleError } from './utils';
import type { GeminiAIResponse, GoogleMapsResponse } from './types';

/**
 * Google Gemini AI integration for intelligent chat responses
 */
export class GeminiAIService {
  private static instance: GeminiAIService;
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;
  private readonly API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY;
  private readonly CACHE_TTL = 300000; // 5 minutes

  private constructor() {}

  static getInstance(): GeminiAIService {
    if (!GeminiAIService.instance) {
      GeminiAIService.instance = new GeminiAIService();
    }
    return GeminiAIService.instance;
  }

  async initialize(): Promise<void> {
    if (!this.API_KEY) {
      throw new Error('Google AI API key is required');
    }

    try {
      this.genAI = new GoogleGenerativeAI(this.API_KEY);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    } catch (error) {
      console.error('Failed to initialize Gemini AI:', error);
      throw error;
    }
  }

  async generateElectionResponse(prompt: string, context?: any): Promise<string> {
    if (!this.model) {
      await this.initialize();
    }

    const cacheKey = `gemini:${prompt}:${JSON.stringify(context || {})}`;
    const cached = CacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }

    const systemPrompt = `You are an AI assistant specializing in Indian elections. 
    Provide accurate, helpful information about:
    - Election Commission of India (ECI) processes
    - Voter registration and eligibility
    - Election phases and timelines
    - Voting procedures and guidelines
    - Political parties and candidates
    - Electoral reforms and voting rights
    
    Always be:
    - Factual and accurate
    - Neutral and unbiased
    - Helpful and educational
    - Respectful of all political views
    - Concise yet comprehensive
    
    If you don't know something, admit it and suggest reliable sources like the ECI website.`;

    const fullPrompt = context 
      ? `${systemPrompt}\n\nContext: ${JSON.stringify(context)}\n\nUser Question: ${prompt}`
      : `${systemPrompt}\n\nUser Question: ${prompt}`;

    try {
      const result = await retry(
        () => this.model.generateContent(fullPrompt),
        3,
        1000
      );

      const response = result.response;
      const text = response.text();
      
      CacheManager.set(cacheKey, text, this.CACHE_TTL);
      return text;
    } catch (error) {
      console.error('Gemini AI error:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  async analyzeElectionQuery(query: string): Promise<{
    intent: string;
    entities: string[];
    sentiment: string;
    confidence: number;
  }> {
    const analysisPrompt = `Analyze this election-related query: "${query}"
    
    Return a JSON object with:
    - intent: the main intent (eligibility, timeline, process, information, other)
    - entities: key entities mentioned (states, parties, positions, etc.)
    - sentiment: positive, negative, or neutral
    - confidence: confidence score (0-1)
    
    Only return the JSON, no other text.`;

    try {
      const response = await this.generateElectionResponse(analysisPrompt);
      const analysis = JSON.parse(response);
      return analysis;
    } catch (error) {
      return {
        intent: 'information',
        entities: [],
        sentiment: 'neutral',
        confidence: 0.5,
      };
    }
  }

  async generateQuizQuestion(topic: string, difficulty: 'easy' | 'medium' | 'hard'): Promise<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }> {
    const quizPrompt = `Generate a ${difficulty} quiz question about ${topic} in Indian elections.
    
    Return a JSON object with:
    - question: the quiz question
    - options: array of 4 options
    - correctAnswer: index of correct option (0-3)
    - explanation: explanation of the correct answer
    
    Make it educational and factually accurate.`;

    try {
      const response = await this.generateElectionResponse(quizPrompt);
      const quizData = JSON.parse(response);
      return quizData;
    } catch (error) {
      throw new Error('Failed to generate quiz question');
    }
  }
}

/**
 * Google Maps integration for location-based election information
 */
export class GoogleMapsService {
  private static instance: GoogleMapsService;
  private loader: Loader | null = null;
  private mapsApi: any = null;
  private readonly API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  private readonly CACHE_TTL = 3600000; // 1 hour

  private constructor() {}

  static getInstance(): GoogleMapsService {
    if (!GoogleMapsService.instance) {
      GoogleMapsService.instance = new GoogleMapsService();
    }
    return GoogleMapsService.instance;
  }

  async initialize(): Promise<void> {
    if (!this.API_KEY) {
      throw new Error('Google Maps API key is required');
    }

    try {
      this.loader = new Loader({
        apiKey: this.API_KEY,
        version: 'weekly',
        libraries: ['places', 'geocoding'],
      });

      await this.loader.load();
      this.mapsApi = (window as any).google;
    } catch (error) {
      console.error('Failed to initialize Google Maps:', error);
      throw error;
    }
  }

  async geocodeAddress(address: string): Promise<{
    lat: number;
    lng: number;
    formattedAddress: string;
    state: string;
    constituency?: string;
  }> {
    const cacheKey = `geocode:${address}`;
    const cached = CacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }

    if (!this.mapsApi) {
      await this.initialize();
    }

    try {
      const geocoder = new this.mapsApi.maps.Geocoder();
      const result = await new Promise((resolve, reject) => {
        geocoder.geocode({ address }, (results: any, status: string) => {
          if (status === 'OK' && results[0]) {
            resolve(results[0]);
          } else {
            reject(new Error(`Geocoding failed: ${status}`));
          }
        });
      });

      const location = result.geometry.location;
      const addressComponents = result.address_components;
      
      // Extract state and constituency information
      let state = '';
      let constituency = '';
      
      addressComponents.forEach((component: any) => {
        if (component.types.includes('administrative_area_level_1')) {
          state = component.long_name;
        }
        if (component.types.includes('administrative_area_level_3')) {
          constituency = component.long_name;
        }
      });

      const geocodedData = {
        lat: location.lat(),
        lng: location.lng(),
        formattedAddress: result.formatted_address,
        state,
        constituency: constituency || undefined,
      };

      CacheManager.set(cacheKey, geocodedData, this.CACHE_TTL);
      return geocodedData;
    } catch (error) {
      console.error('Geocoding error:', error);
      throw new Error('Failed to geocode address');
    }
  }

  async findNearbyPollingBooths(lat: number, lng: number): Promise<Array<{
    name: string;
    address: string;
    distance: number;
    directions: string;
  }>> {
    const cacheKey = `polling-booths:${lat},${lng}`;
    const cached = CacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }

    if (!this.mapsApi) {
      await this.initialize();
    }

    try {
      const placesService = new this.mapsApi.maps.places.PlacesService(
        document.createElement('div')
      );

      const pollingBooths = await new Promise((resolve, reject) => {
        const request = {
          location: { lat, lng },
          radius: 5000, // 5km radius
          keyword: 'polling booth election commission',
          type: 'establishment',
        };

        placesService.nearbySearch(request, (results: any, status: string) => {
          if (status === 'OK') {
            resolve(results);
          } else {
            resolve([]);
          }
        });
      });

      const processedBooths = (pollingBooths as any[]).map(booth => ({
        name: booth.name,
        address: booth.vicinity,
        distance: this.calculateDistance(lat, lng, booth.geometry.location.lat(), booth.geometry.location.lng()),
        directions: `https://www.google.com/maps/dir/?api=1&destination=${booth.geometry.location.lat()},${booth.geometry.location.lng()}`,
      }));

      CacheManager.set(cacheKey, processedBooths, this.CACHE_TTL);
      return processedBooths;
    } catch (error) {
      console.error('Error finding polling booths:', error);
      return [];
    }
  }

  async getElectionInfoForLocation(state: string): Promise<{
    state: string;
    constituencies: number;
    upcomingElections: string;
    voterRegistrationLink: string;
    electionOffice: string;
  }> {
    const cacheKey = `election-info:${state}`;
    const cached = CacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }

    // This would typically integrate with ECI APIs
    // For now, return structured mock data
    const electionInfo = {
      state,
      constituencies: this.getConstituencyCount(state),
      upcomingElections: 'Lok Sabha 2024',
      voterRegistrationLink: 'https://voters.eci.gov.in',
      electionOffice: this.getChiefElectoralOffice(state),
    };

    CacheManager.set(cacheKey, electionInfo, this.CACHE_TTL);
    return electionInfo;
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private getConstituencyCount(state: string): number {
    const constituencyCounts: Record<string, number> = {
      'Uttar Pradesh': 80,
      'Maharashtra': 48,
      'West Bengal': 42,
      'Bihar': 40,
      'Tamil Nadu': 39,
      'Madhya Pradesh': 29,
      'Rajasthan': 25,
      'Karnataka': 28,
      'Gujarat': 26,
      'Andhra Pradesh': 25,
      'Telangana': 17,
      'Assam': 14,
      'Jharkhand': 14,
      'Kerala': 20,
      'Punjab': 13,
      'Chhattisgarh': 11,
      'Odisha': 21,
      'Uttarakhand': 5,
      'Himachal Pradesh': 4,
      'Haryana': 10,
      'Delhi': 7,
      'Jammu & Kashmir': 5,
      'Lakshadweep': 1,
      'Daman & Diu': 2,
      'Dadra & Nagar Haveli': 1,
      'Puducherry': 1,
      'Goa': 2,
      'Sikkim': 1,
      'Meghalaya': 2,
      'Mizoram': 1,
      'Nagaland': 1,
      'Arunachal Pradesh': 2,
      'Manipur': 2,
      'Tripura': 2,
    };
    return constituencyCounts[state] || 0;
  }

  private getChiefElectoralOffice(state: string): string {
    const offices: Record<string, string> = {
      'Delhi': 'Chief Electoral Officer, Delhi',
      'Maharashtra': 'Chief Electoral Officer, Maharashtra',
      'Uttar Pradesh': 'Chief Electoral Officer, Uttar Pradesh',
      // Add more states as needed
    };
    return offices[state] || `Chief Electoral Officer, ${state}`;
  }
}

/**
 * Google Analytics integration for user behavior tracking
 */
export class GoogleAnalyticsService {
  private static instance: GoogleAnalyticsService;
  private initialized = false;
  private readonly MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

  private constructor() {}

  static getInstance(): GoogleAnalyticsService {
    if (!GoogleAnalyticsService.instance) {
      GoogleAnalyticsService.instance = new GoogleAnalyticsService();
    }
    return GoogleAnalyticsService.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized || !this.MEASUREMENT_ID) return;

    try {
      // Load gtag script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.MEASUREMENT_ID}`;
      document.head.appendChild(script);

      // Initialize gtag
      (window as any).gtag('js', new Date());
      (window as any).gtag('config', this.MEASUREMENT_ID, {
        page_title: document.title,
        page_location: window.location.href,
      });

      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize Google Analytics:', error);
    }
  }

  trackPageView(page: string, title?: string): void {
    if (!this.initialized) return;

    (window as any).gtag('config', this.MEASUREMENT_ID, {
      page_path: page,
      page_title: title || document.title,
    });
  }

  trackEvent(eventName: string, parameters?: Record<string, any>): void {
    if (!this.initialized) return;

    (window as any).gtag('event', eventName, parameters);
  }

  trackChatInteraction(message: string, intent: string): void {
    this.trackEvent('chat_interaction', {
      message_length: message.length,
      intent,
      timestamp: new Date().toISOString(),
    });
  }

  trackQuizStart(category: string, difficulty: string): void {
    this.trackEvent('quiz_start', {
      category,
      difficulty,
    });
  }

  trackQuizComplete(category: string, score: number, total: number): void {
    this.trackEvent('quiz_complete', {
      category,
      score,
      total,
      percentage: Math.round((score / total) * 100),
    });
  }

  trackEligibilityCheck(age: number, state: string, eligible: boolean): void {
    this.trackEvent('eligibility_check', {
      age,
      state,
      eligible,
    });
  }

  trackTimelineInteraction(phase: string, action: string): void {
    this.trackEvent('timeline_interaction', {
      phase,
      action,
    });
  }
}

/**
 * Combined Google Services Manager
 */
export class GoogleServicesManager {
  private static instance: GoogleServicesManager;
  private geminiService: GeminiAIService;
  private mapsService: GoogleMapsService;
  private analyticsService: GoogleAnalyticsService;

  private constructor() {
    this.geminiService = GeminiAIService.getInstance();
    this.mapsService = GoogleMapsService.getInstance();
    this.analyticsService = GoogleAnalyticsService.getInstance();
  }

  static getInstance(): GoogleServicesManager {
    if (!GoogleServicesManager.instance) {
      GoogleServicesManager.instance = new GoogleServicesManager();
    }
    return GoogleServicesManager.instance;
  }

  async initializeAll(): Promise<void> {
    try {
      await Promise.all([
        this.geminiService.initialize(),
        this.mapsService.initialize(),
        this.analyticsService.initialize(),
      ]);
    } catch (error) {
      console.error('Failed to initialize Google Services:', error);
      throw error;
    }
  }

  getGeminiService(): GeminiAIService {
    return this.geminiService;
  }

  getMapsService(): GoogleMapsService {
    return this.mapsService;
  }

  getAnalyticsService(): GoogleAnalyticsService {
    return this.analyticsService;
  }

  async getElectionInformation(query: string, userLocation?: { lat: number; lng: number }): Promise<{
    aiResponse: string;
    locationInfo?: any;
    nearbyResources?: any[];
  }> {
    const [aiResponse, locationInfo, nearbyResources] = await Promise.allSettled([
      this.geminiService.generateElectionResponse(query),
      userLocation ? this.mapsService.geocodeAddress(`${userLocation.lat}, ${userLocation.lng}`) : Promise.resolve(null),
      userLocation ? this.mapsService.findNearbyPollingBooths(userLocation.lat, userLocation.lng) : Promise.resolve([]),
    ]);

    return {
      aiResponse: aiResponse.status === 'fulfilled' ? aiResponse.value : 'I apologize, but I\'m having trouble processing your request right now.',
      locationInfo: locationInfo.status === 'fulfilled' ? locationInfo.value : undefined,
      nearbyResources: nearbyResources.status === 'fulfilled' ? nearbyResources.value : [],
    };
  }
}

// Export singleton instances
export const geminiAI = GeminiAIService.getInstance();
export const googleMaps = GoogleMapsService.getInstance();
export const googleAnalytics = GoogleAnalyticsService.getInstance();
export const googleServices = GoogleServicesManager.getInstance();

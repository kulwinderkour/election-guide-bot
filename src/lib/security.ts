/**
 * Security utilities for the Election Guide Bot
 * Implements safe coding practices and security measures
 */

import { sanitizeInput } from './utils';

// Content Security Policy
export const CSP_CONFIG = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "https://apis.google.com"],
  'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  'font-src': ["'self'", "https://fonts.gstatic.com"],
  'img-src': ["'self'", "data:", "https:", "blob:"],
  'connect-src': ["'self'", "https://api.supabase.co", "https://generativelanguage.googleapis.com"],
  'frame-src': ["'none'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
};

/**
 * Generate Content Security Policy header
 */
export function generateCSP(): string {
  return Object.entries(CSP_CONFIG)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');
}

/**
 * Rate limiting configuration
 */
export const RATE_LIMITS = {
  CHAT_REQUESTS: { max: 10, windowMs: 60000 }, // 10 requests per minute
  API_REQUESTS: { max: 100, windowMs: 60000 }, // 100 requests per minute
  FORM_SUBMISSIONS: { max: 5, windowMs: 300000 }, // 5 submissions per 5 minutes
} as const;

/**
 * Simple rate limiter implementation
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  constructor(private config: { max: number; windowMs: number }) {}

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.config.windowMs);
    
    if (validRequests.length >= this.config.max) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    return true;
  }

  reset(identifier: string): void {
    this.requests.delete(identifier);
  }
}

/**
 * Input validation and sanitization
 */
export class InputValidator {
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  static validateName(name: string): boolean {
    return /^[a-zA-Z\s.]{2,50}$/.test(name.trim());
  }

  static validateAge(age: string): boolean {
    const ageNum = parseInt(age);
    return !isNaN(ageNum) && ageNum >= 18 && ageNum <= 120;
  }

  static validatePhone(phone: string): boolean {
    const cleanPhone = phone.replace(/\D/g, '');
    return /^[6-9]\d{9}$/.test(cleanPhone);
  }

  static validateMessage(message: string): boolean {
    const sanitized = sanitizeInput(message);
    return sanitized.length >= 1 && sanitized.length <= 1000;
  }

  static validateState(state: string): boolean {
    const validStates = [
      'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
      'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
      'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
      'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
      'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
      'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Puducherry'
    ];
    return validStates.includes(state.trim());
  }
}

/**
 * XSS protection utilities
 */
export class XSSProtection {
  static escapeHtml(unsafe: string): string {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  static sanitizeHtml(dirty: string): string {
    const div = document.createElement('div');
    div.textContent = dirty;
    return div.innerHTML;
  }

  static validateUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  }
}

/**
 * CSRF protection utilities
 */
export class CSRFProtection {
  private static readonly TOKEN_LENGTH = 32;
  private static readonly STORAGE_KEY = 'csrf-token';

  static generateToken(): string {
    const array = new Uint8Array(this.TOKEN_LENGTH);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  static getToken(): string {
    let token = localStorage.getItem(this.STORAGE_KEY);
    if (!token) {
      token = this.generateToken();
      localStorage.setItem(this.STORAGE_KEY, token);
    }
    return token;
  }

  static validateToken(token: string): boolean {
    const storedToken = this.getToken();
    return token === storedToken;
  }

  static refreshToken(): string {
    const token = this.generateToken();
    localStorage.setItem(this.STORAGE_KEY, token);
    return token;
  }
}

/**
 * API security utilities
 */
export class APISecurity {
  private static rateLimiters = new Map<string, RateLimiter>();

  static getRateLimiter(key: keyof typeof RATE_LIMITS): RateLimiter {
    if (!this.rateLimiters.has(key)) {
      this.rateLimiters.set(key, new RateLimiter(RATE_LIMITS[key]));
    }
    return this.rateLimiters.get(key)!;
  }

  static async secureFetch(url: string, options: RequestInit = {}): Promise<Response> {
    // Add security headers
    const secureOptions: RequestInit = {
      ...options,
      headers: {
        'Content-Security-Policy': generateCSP(),
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        ...options.headers,
      },
    };

    return fetch(url, secureOptions);
  }

  static validateApiResponse(response: Response): boolean {
    return response.ok && response.headers.get('content-type')?.includes('application/json');
  }
}

/**
 * Authentication security utilities
 */
export class AuthSecurity {
  private static readonly SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  static generateSecureToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array));
  }

  static hashPassword(password: string): string {
    // In a real app, use bcrypt or similar
    return btoa(password + 'salt'); // Simple hashing for demo
  }

  static validatePassword(password: string): boolean {
    // Password must be at least 8 characters with uppercase, lowercase, number, and special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  static isSessionValid(sessionStart: number): boolean {
    return Date.now() - sessionStart < this.SESSION_DURATION;
  }
}

/**
 * Data encryption utilities
 */
export class DataEncryption {
  static async encrypt(data: string): Promise<string> {
    try {
      const encoder = new TextEncoder();
      const dataUint8Array = encoder.encode(data);
      const key = await crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encryptedData = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        dataUint8Array
      );
      
      const result = new Uint8Array(iv.length + encryptedData.byteLength);
      result.set(iv);
      result.set(new Uint8Array(encryptedData), iv.length);
      
      return btoa(String.fromCharCode(...result));
    } catch (error) {
      console.error('Encryption failed:', error);
      return data; // Fallback to plain text
    }
  }

  static async decrypt(encryptedData: string): Promise<string> {
    try {
      const data = atob(encryptedData);
      const uint8Array = new Uint8Array(data.length);
      for (let i = 0; i < data.length; i++) {
        uint8Array[i] = data.charCodeAt(i);
      }
      
      const iv = uint8Array.slice(0, 12);
      const dataUint8Array = uint8Array.slice(12);
      
      // In a real app, you'd need to store and retrieve the key
      // This is a simplified version for demo purposes
      return new TextDecoder().decode(dataUint8Array);
    } catch (error) {
      console.error('Decryption failed:', error);
      return encryptedData; // Fallback to original data
    }
  }
}

/**
 * Security middleware for API requests
 */
export class SecurityMiddleware {
  static validateRequest(request: Request): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Check Content-Type
    const contentType = request.headers.get('content-type');
    if (request.method !== 'GET' && !contentType?.includes('application/json')) {
      errors.push('Invalid content type');
    }
    
    // Check CSRF token for state-changing requests
    if (['POST', 'PUT', 'DELETE'].includes(request.method)) {
      const csrfToken = request.headers.get('X-CSRF-Token');
      if (!csrfToken || !CSRFProtection.validateToken(csrfToken)) {
        errors.push('Invalid CSRF token');
      }
    }
    
    // Check rate limiting
    const clientIP = request.headers.get('X-Forwarded-For') || 'unknown';
    const rateLimiter = APISecurity.getRateLimiter('API_REQUESTS');
    if (!rateLimiter.isAllowed(clientIP)) {
      errors.push('Rate limit exceeded');
    }
    
    return {
      valid: errors.length === 0,
      errors,
    };
  }

  static sanitizeInput(data: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        sanitized[key] = sanitizeInput(value);
      } else if (Array.isArray(value)) {
        sanitized[key] = value.map(item => 
          typeof item === 'string' ? sanitizeInput(item) : item
        );
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeInput(value);
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }
}

/**
 * Security monitoring and logging
 */
export class SecurityMonitor {
  private static logs: Array<{
    timestamp: Date;
    event: string;
    details: any;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }> = [];

  static logSecurityEvent(
    event: string,
    details: any,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ): void {
    this.logs.push({
      timestamp: new Date(),
      event,
      details,
      severity,
    });

    // Keep only last 1000 logs
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-1000);
    }

    // In production, send to security monitoring service
    if (severity === 'high' || severity === 'critical') {
      console.warn('Security Event:', { event, details, severity });
    }
  }

  static getSecurityLogs(): typeof this.logs {
    return [...this.logs];
  }

  static detectSuspiciousActivity(patterns: string[]): boolean {
    const recentLogs = this.logs.filter(
      log => Date.now() - log.timestamp.getTime() < 300000 // Last 5 minutes
    );

    return patterns.some(pattern =>
      recentLogs.some(log => log.event.includes(pattern))
    );
  }
}

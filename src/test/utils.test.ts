import { describe, it, expect, beforeEach } from 'vitest';
import {
  formatDate,
  formatTime,
  formatRelativeTime,
  isValidEmail,
  isValidIndianPhone,
  isValidVotingAge,
  sanitizeInput,
  generateId,
  debounce,
  throttle,
  copyToClipboard,
  formatNumber,
  calculatePercentage,
  getInitials,
  isMobile,
  getDeviceType,
  storage,
  handleError,
  retry,
  isOnline,
  getBrowserLanguage,
  formatCurrency,
} from '@/lib/utils';

describe('Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Date Formatting', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15');
      expect(formatDate(date)).toBe('15 Jan 2024');
    });

    it('should format date with custom options', () => {
      const date = new Date('2024-01-15');
      expect(formatDate(date, { month: 'long' })).toBe('15 January 2024');
    });

    it('should format date string', () => {
      expect(formatDate('2024-01-15')).toBe('15 Jan 2024');
    });

    it('should format time correctly', () => {
      const date = new Date('2024-01-15T14:30:00');
      expect(formatTime(date)).toMatch(/^(1|2):30 (AM|PM)$/);
    });

    it('should format relative time', () => {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 3600000);
      expect(formatRelativeTime(oneHourAgo)).toBe('1 hours ago');
    });
  });

  describe('Validation Functions', () => {
    it('should validate email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
    });

    it('should validate Indian phone numbers', () => {
      expect(isValidIndianPhone('9876543210')).toBe(true);
      expect(isValidIndianPhone('1234567890')).toBe(false);
      expect(isValidIndianPhone('98765432109')).toBe(false);
      expect(isValidIndianPhone('987-654-3210')).toBe(true); // Should handle dashes
    });

    it('should validate voting age', () => {
      expect(isValidVotingAge(18)).toBe(true);
      expect(isValidVotingAge(25)).toBe(true);
      expect(isValidVotingAge(17)).toBe(false);
      expect(isValidVotingAge(121)).toBe(false);
    });

    it('should sanitize input', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe('alertxss');
      expect(sanitizeInput('Hello World')).toBe('Hello World');
      expect(sanitizeInput('  Trimmed  ')).toBe('Trimmed');
    });
  });

  describe('Utility Functions', () => {
    it('should generate random ID', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).toHaveLength(8);
      expect(id2).toHaveLength(8);
      expect(id1).not.toBe(id2);
    });

    it('should generate ID with custom length', () => {
      const id = generateId(12);
      expect(id).toHaveLength(12);
    });

    it('should debounce function', () => {
      vi.useFakeTimers();
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      expect(mockFn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);

      vi.useRealTimers();
    });

    it('should throttle function', () => {
      vi.useFakeTimers();
      const mockFn = vi.fn();
      const throttledFn = throttle(mockFn, 100);

      throttledFn();
      throttledFn();
      throttledFn();

      expect(mockFn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);
      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(2);

      vi.useRealTimers();
    });

    it('should format numbers', () => {
      expect(formatNumber(1234567)).toBe('12,34,567');
      expect(formatNumber(0)).toBe('0');
    });

    it('should calculate percentage', () => {
      expect(calculatePercentage(25, 100)).toBe(25);
      expect(calculatePercentage(1, 3)).toBe(33);
      expect(calculatePercentage(0, 100)).toBe(0);
      expect(calculatePercentage(50, 0)).toBe(0);
    });

    it('should get initials from name', () => {
      expect(getInitials('John Doe')).toBe('JD');
      expect(getInitials('John')).toBe('J');
      expect(getInitials('John Middle Doe')).toBe('JM');
    });

    it('should detect mobile device', () => {
      // Mock user agent
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        writable: true,
      });
      expect(isMobile()).toBe(true);

      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        writable: true,
      });
      expect(isMobile()).toBe(false);
    });
  });

  describe('Storage Utilities', () => {
    it('should set and get storage items', () => {
      storage.set('test-key', { data: 'test' });
      expect(storage.get('test-key')).toEqual({ data: 'test' });
    });

    it('should return null for non-existent items', () => {
      expect(storage.get('non-existent')).toBeNull();
    });

    it('should remove storage items', () => {
      storage.set('test-key', 'test');
      storage.remove('test-key');
      expect(storage.get('test-key')).toBeNull();
    });

    it('should handle storage errors gracefully', () => {
      // Mock localStorage to throw error
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        throw new Error('Storage error');
      });

      expect(() => storage.set('test', 'value')).not.toThrow();

      // Restore
      localStorage.setItem = originalSetItem;
    });
  });

  describe('Error Handling', () => {
    it('should handle Error objects', () => {
      const error = new Error('Test error');
      const handled = handleError(error);
      
      expect(handled.message).toBe('Test error');
      expect(handled.timestamp).toBeInstanceOf(Date);
    });

    it('should handle unknown errors', () => {
      const handled = handleError('string error');
      
      expect(handled.message).toBe('An unknown error occurred');
      expect(handled.timestamp).toBeInstanceOf(Date);
    });
  });

  describe('Retry Function', () => {
    it('should retry successful function', async () => {
      const mockFn = vi.fn().mockResolvedValue('success');
      
      const result = await retry(mockFn, 3, 100);
      
      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should retry failed function', async () => {
      vi.useFakeTimers();
      const mockFn = vi.fn()
        .mockRejectedValueOnce(new Error('First failure'))
        .mockRejectedValueOnce(new Error('Second failure'))
        .mockResolvedValue('success');

      const result = await retry(mockFn, 3, 100);
      
      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalledTimes(3);

      vi.useRealTimers();
    });

    it('should throw after max attempts', async () => {
      const mockFn = vi.fn().mockRejectedValue(new Error('Always fails'));
      
      await expect(retry(mockFn, 2, 100)).rejects.toThrow('Always fails');
      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('Browser Utilities', () => {
    it('should check online status', () => {
      expect(isOnline()).toBe(true);
    });

    it('should get browser language', () => {
      expect(getBrowserLanguage()).toBeDefined();
      expect(typeof getBrowserLanguage()).toBe('string');
    });

    it('should format currency', () => {
      expect(formatCurrency(1234.56)).toBe('₹1,234.56');
    });
  });

  describe('Device Detection', () => {
    it('should get device type based on screen width', () => {
      // Mock window.innerWidth
      Object.defineProperty(window, 'innerWidth', {
        value: 480,
        writable: true,
      });
      expect(getDeviceType()).toBe('mobile');

      Object.defineProperty(window, 'innerWidth', {
        value: 800,
        writable: true,
      });
      expect(getDeviceType()).toBe('tablet');

      Object.defineProperty(window, 'innerWidth', {
        value: 1200,
        writable: true,
      });
      expect(getDeviceType()).toBe('desktop');
    });
  });
});

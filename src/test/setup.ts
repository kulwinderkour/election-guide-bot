import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

// Mock crypto
Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: vi.fn().mockImplementation(arr => 
      Array.from(arr, () => Math.floor(Math.random() * 256))
    ),
    subtle: {
      generateKey: vi.fn().mockResolvedValue({}),
      encrypt: vi.fn().mockResolvedValue(new ArrayBuffer(8)),
      decrypt: vi.fn().mockResolvedValue(new ArrayBuffer(8)),
    },
  },
});

// Mock fetch
global.fetch = vi.fn();

// Mock Image
global.Image = vi.fn().mockImplementation(() => ({
  onload: null,
  onerror: null,
  src: '',
  complete: false,
  naturalWidth: 0,
  naturalHeight: 0,
})) as any;

// Mock performance
Object.defineProperty(window, 'performance', {
  value: {
    getEntriesByType: vi.fn(() => []),
    now: vi.fn(() => Date.now()),
    mark: vi.fn(),
    measure: vi.fn(),
    navigation: {
      type: 'navigate',
      redirectCount: 0,
    },
    memory: {
      usedJSHeapSize: 1000000,
      totalJSHeapSize: 2000000,
      jsHeapSizeLimit: 4000000,
    },
  },
});

// Mock navigator
Object.defineProperty(window, 'navigator', {
  value: {
    userAgent: 'test-user-agent',
    language: 'en-US',
    languages: ['en-US', 'en'],
    onLine: true,
    clipboard: {
      writeText: vi.fn().mockResolvedValue(undefined),
      readText: vi.fn().mockResolvedValue(''),
    },
  },
});

// Mock URL constructor
global.URL = class URL {
  constructor(href: string, base?: string) {
    this.href = href;
    this.origin = 'http://localhost';
    this.protocol = 'http:';
    this.host = 'localhost';
    this.hostname = 'localhost';
    this.port = '';
    this.pathname = '/';
    this.search = '';
    this.hash = '';
  }
  href: string;
  origin: string;
  protocol: string;
  host: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  toString() { return this.href; }
} as any;

// Mock TextEncoder/TextDecoder
global.TextEncoder = class TextEncoder {
  encode(input: string): Uint8Array {
    return new Uint8Array(input.split('').map(char => char.charCodeAt(0)));
  }
} as any;

global.TextDecoder = class TextDecoder {
  decode(input: Uint8Array): string {
    return String.fromCharCode(...input);
  }
} as any;

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn((cb) => setTimeout(cb, 16));
global.cancelAnimationFrame = vi.fn(clearTimeout);

// Mock scrollTo
global.scrollTo = vi.fn();

// Mock alert/confirm
global.alert = vi.fn();
global.confirm = vi.fn(() => true);

// Setup cleanup after each test
afterEach(() => {
  vi.clearAllMocks();
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
  localStorageMock.clear.mockClear();
  sessionStorageMock.getItem.mockClear();
  sessionStorageMock.setItem.mockClear();
  sessionStorageMock.removeItem.mockClear();
  sessionStorageMock.clear.mockClear();
});

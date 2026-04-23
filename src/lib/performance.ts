/**
 * Performance optimization utilities for the Election Guide Bot
 * Implements efficient resource usage and performance monitoring
 */

import { debounce, throttle } from './utils';

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  private static metrics: Map<string, number[]> = new Map();
  private static observers: PerformanceObserver[] = [];

  static startMonitoring(): void {
    // Monitor navigation timing
    this.observeNavigationTiming();
    
    // Monitor resource loading
    this.observeResourceTiming();
    
    // Monitor long tasks
    this.observeLongTasks();
    
    // Monitor memory usage
    this.observeMemoryUsage();
  }

  private static observeNavigationTiming(): void {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      this.recordMetric('domContentLoaded', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart);
      this.recordMetric('loadComplete', navigation.loadEventEnd - navigation.loadEventStart);
      this.recordMetric('firstPaint', navigation.responseEnd - navigation.requestStart);
    }
  }

  private static observeResourceTiming(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource') {
            const resource = entry as PerformanceResourceTiming;
            this.recordMetric('resourceLoadTime', resource.responseEnd - resource.requestStart);
          }
        }
      });
      observer.observe({ entryTypes: ['resource'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('Resource timing observation not supported:', error);
    }
  }

  private static observeLongTasks(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'longtask') {
            this.recordMetric('longTask', entry.duration);
          }
        }
      });
      observer.observe({ entryTypes: ['longtask'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('Long task observation not supported:', error);
    }
  }

  private static observeMemoryUsage(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.recordMetric('memoryUsed', memory.usedJSHeapSize);
      this.recordMetric('memoryLimit', memory.jsHeapSizeLimit);
    }
  }

  static recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    const values = this.metrics.get(name)!;
    values.push(value);
    
    // Keep only last 100 values
    if (values.length > 100) {
      values.shift();
    }
  }

  static getMetricStats(name: string): { avg: number; min: number; max: number } | null {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) return null;
    
    return {
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
    };
  }

  static getAllMetrics(): Record<string, { avg: number; min: number; max: number }> {
    const result: Record<string, { avg: number; min: number; max: number }> = {};
    for (const [name] of this.metrics) {
      const stats = this.getMetricStats(name);
      if (stats) result[name] = stats;
    }
    return result;
  }

  static stopMonitoring(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

/**
 * Image optimization utilities
 */
export class ImageOptimizer {
  private static imageCache = new Map<string, string>();

  static async optimizeImage(src: string, options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpeg' | 'png';
  } = {}): Promise<string> {
    const cacheKey = `${src}-${JSON.stringify(options)}`;
    
    if (this.imageCache.has(cacheKey)) {
      return this.imageCache.get(cacheKey)!;
    }

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        
        const { width = img.width, height = img.height, quality = 0.8, format = 'webp' } = options;
        
        canvas.width = width;
        canvas.height = height;
        
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            this.imageCache.set(cacheKey, url);
            resolve(url);
          } else {
            resolve(src);
          }
        }, `image/${format}`, quality);
      };
      
      img.onerror = () => resolve(src);
      img.src = src;
    });
  }

  static preloadImages(urls: string[]): Promise<void[]> {
    return Promise.all(urls.map(url => this.preloadImage(url)));
  }

  static preloadImage(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = url;
    });
  }
}

/**
 * Resource loading optimization
 */
export class ResourceOptimizer {
  private static loadedScripts = new Set<string>();
  private static loadedStyles = new Set<string>();

  static async loadScript(src: string, options: { async?: boolean; defer?: boolean } = {}): Promise<void> {
    if (this.loadedScripts.has(src)) return;

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = options.async ?? true;
      script.defer = options.defer ?? false;
      
      script.onload = () => {
        this.loadedScripts.add(src);
        resolve();
      };
      
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  static async loadStyle(href: string): Promise<void> {
    if (this.loadedStyles.has(href)) return;

    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      
      link.onload = () => {
        this.loadedStyles.add(href);
        resolve();
      };
      
      link.onerror = reject;
      document.head.appendChild(link);
    });
  }

  static prefetchResource(url: string, type: 'script' | 'style' | 'image' | 'font'): void {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    
    if (type === 'script') {
      link.as = 'script';
    } else if (type === 'style') {
      link.as = 'style';
    } else if (type === 'image') {
      link.as = 'image';
    } else if (type === 'font') {
      link.as = 'font';
      link.type = 'font/woff2';
    }
    
    document.head.appendChild(link);
  }

  static preloadCriticalResources(): void {
    // Preload critical fonts
    this.prefetchResource('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap', 'style');
    
    // Preload critical images
    this.prefetchResource('/hero-democracy.jpg', 'image');
  }
}

/**
 * Virtual scrolling for large lists
 */
export class VirtualScroller {
  private container: HTMLElement;
  private items: any[];
  private itemHeight: number;
  private visibleCount: number;
  private scrollTop = 0;
  private startIndex = 0;
  private endIndex = 0;

  constructor(container: HTMLElement, items: any[], itemHeight: number) {
    this.container = container;
    this.items = items;
    this.itemHeight = itemHeight;
    this.visibleCount = Math.ceil(container.clientHeight / itemHeight) + 2;
    
    this.setupScrollListener();
    this.render();
  }

  private setupScrollListener(): void {
    const throttledScroll = throttle(() => {
      this.scrollTop = this.container.scrollTop;
      this.updateIndices();
      this.render();
    }, 16); // 60fps

    this.container.addEventListener('scroll', throttledScroll);
  }

  private updateIndices(): void {
    this.startIndex = Math.floor(this.scrollTop / this.itemHeight);
    this.endIndex = Math.min(this.startIndex + this.visibleCount, this.items.length - 1);
  }

  private render(): void {
    const fragment = document.createDocumentFragment();
    
    for (let i = this.startIndex; i <= this.endIndex; i++) {
      const item = this.items[i];
      const element = this.createItemElement(item, i);
      fragment.appendChild(element);
    }
    
    this.container.innerHTML = '';
    this.container.appendChild(fragment);
  }

  private createItemElement(item: any, index: number): HTMLElement {
    const element = document.createElement('div');
    element.style.height = `${this.itemHeight}px`;
    element.style.position = 'absolute';
    element.style.top = `${index * this.itemHeight}px`;
    element.style.width = '100%';
    element.textContent = item.toString(); // Customize based on your data structure
    return element;
  }

  updateItems(items: any[]): void {
    this.items = items;
    this.updateIndices();
    this.render();
  }
}

/**
 * Lazy loading utilities
 */
export class LazyLoader {
  private static observer: IntersectionObserver;

  static initialize(): void {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.loadElement(entry.target as HTMLElement);
              this.observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '50px',
          threshold: 0.1,
        }
      );
    }
  }

  static observe(element: HTMLElement): void {
    if (this.observer) {
      this.observer.observe(element);
    }
  }

  static unobserve(element: HTMLElement): void {
    if (this.observer) {
      this.observer.unobserve(element);
    }
  }

  private static loadElement(element: HTMLElement): void {
    if (element.dataset.src) {
      if (element.tagName === 'IMG') {
        const img = element as HTMLImageElement;
        img.src = img.dataset.src;
        img.onload = () => img.classList.add('loaded');
      } else {
        element.style.backgroundImage = `url(${element.dataset.src})`;
        element.classList.add('loaded');
      }
    }
  }

  static loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }
}

/**
 * Caching utilities
 */
export class CacheManager {
  private static cache = new Map<string, {
    data: any;
    timestamp: number;
    ttl: number;
  }>();

  static set(key: string, data: any, ttl: number = 300000): void { // 5 minutes default TTL
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  static get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  static delete(key: string): boolean {
    return this.cache.delete(key);
  }

  static clear(): void {
    this.cache.clear();
  }

  static size(): number {
    return this.cache.size;
  }

  static cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

/**
 * Bundle optimization utilities
 */
export class BundleOptimizer {
  private static loadedChunks = new Set<string>();

  static async loadChunk(chunkName: string): Promise<any> {
    if (this.loadedChunks.has(chunkName)) {
      return this.getChunk(chunkName);
    }

    try {
      const chunk = await import(`../chunks/${chunkName}.js`);
      this.loadedChunks.add(chunkName);
      CacheManager.set(`chunk:${chunkName}`, chunk, 3600000); // Cache for 1 hour
      return chunk;
    } catch (error) {
      console.error(`Failed to load chunk ${chunkName}:`, error);
      throw error;
    }
  }

  private static getChunk(chunkName: string): any {
    return CacheManager.get(`chunk:${chunkName}`);
  }

  static preloadChunks(chunkNames: string[]): Promise<void[]> {
    return Promise.all(chunkNames.map(name => this.loadChunk(name)));
  }
}

/**
 * Network optimization utilities
 */
export class NetworkOptimizer {
  private static requestCache = new Map<string, any>();

  static async cachedFetch(url: string, options: RequestInit = {}, ttl: number = 300000): Promise<Response> {
    const cacheKey = `${url}:${JSON.stringify(options)}`;
    const cached = CacheManager.get(cacheKey);
    
    if (cached) {
      return new Response(JSON.stringify(cached), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch(url, options);
    
    if (response.ok) {
      const data = await response.json();
      CacheManager.set(cacheKey, data, ttl);
    }
    
    return response;
  }

  static batchRequests<T>(requests: (() => Promise<T>)[]): Promise<T[]> {
    return Promise.all(requests.map(request => request()));
  }

  static async requestWithTimeout<T>(
    request: () => Promise<T>,
    timeout: number = 10000
  ): Promise<T> {
    return Promise.race([
      request(),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), timeout)
      ),
    ]);
  }
}

/**
 * Memory management utilities
 */
export class MemoryManager {
  private static cleanupCallbacks: (() => void)[] = [];

  static addCleanupCallback(callback: () => void): void {
    this.cleanupCallbacks.push(callback);
  }

  static cleanup(): void {
    this.cleanupCallbacks.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('Cleanup callback failed:', error);
      }
    });
    this.cleanupCallbacks = [];
  }

  static monitorMemory(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const used = (memory.usedJSHeapSize / 1024 / 1024).toFixed(2);
      const total = (memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2);
      
      console.log(`Memory Usage: ${used}MB / ${total}MB`);
      
      // Trigger cleanup if memory usage is high
      if (memory.usedJSHeapSize / memory.jsHeapSizeLimit > 0.8) {
        this.cleanup();
        CacheManager.cleanup();
      }
    }
  }

  static forceGarbageCollection(): void {
    if ('gc' in window) {
      (window as any).gc();
    } else {
      // Fallback: create temporary objects to trigger GC
      const temp = new Array(1000).fill(null).map(() => ({}));
      temp.length = 0;
    }
  }
}

// Initialize performance monitoring
if (typeof window !== 'undefined') {
  PerformanceMonitor.startMonitoring();
  ResourceOptimizer.preloadCriticalResources();
  LazyLoader.initialize();
  
  // Set up periodic cleanup
  setInterval(() => {
    CacheManager.cleanup();
    MemoryManager.monitorMemory();
  }, 60000); // Every minute
}

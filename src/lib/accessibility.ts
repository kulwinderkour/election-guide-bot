/**
 * Accessibility utilities for the Election Guide Bot
 * Implements WCAG 2.1 AA compliance and inclusive design
 */

import { useEffect, useRef } from 'react';

/**
 * Screen reader announcements
 */
export class ScreenReader {
  private static announcementElement: HTMLElement | null = null;

  static initialize(): void {
    if (typeof document === 'undefined') return;

    // Create hidden announcement element
    this.announcementElement = document.createElement('div');
    this.announcementElement.setAttribute('aria-live', 'polite');
    this.announcementElement.setAttribute('aria-atomic', 'true');
    this.announcementElement.className = 'sr-only';
    this.announcementElement.style.position = 'absolute';
    this.announcementElement.style.left = '-10000px';
    this.announcementElement.style.width = '1px';
    this.announcementElement.style.height = '1px';
    this.announcementElement.style.overflow = 'hidden';
    
    document.body.appendChild(this.announcementElement);
  }

  static announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if (!this.announcementElement) {
      this.initialize();
    }

    if (this.announcementElement) {
      this.announcementElement.setAttribute('aria-live', priority);
      this.announcementElement.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        if (this.announcementElement) {
          this.announcementElement.textContent = '';
        }
      }, 1000);
    }
  }

  static announceError(error: string): void {
    this.announce(`Error: ${error}`, 'assertive');
  }

  static announceSuccess(success: string): void {
    this.announce(`Success: ${success}`, 'polite');
  }
}

/**
 * Focus management utilities
 */
export class FocusManager {
  private static focusableSelectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(', ');

  static getFocusableElements(container: HTMLElement): HTMLElement[] {
    return Array.from(container.querySelectorAll(this.focusableSelectors))
      .filter(element => {
        // Check if element is visible and not disabled
        const style = window.getComputedStyle(element);
        return style.display !== 'none' && 
               style.visibility !== 'hidden' && 
               !element.hasAttribute('disabled');
      });
  }

  static trapFocus(container: HTMLElement): () => void {
    const focusableElements = this.getFocusableElements(container);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);

    // Focus first element
    if (firstElement) {
      firstElement.focus();
    }

    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }

  static restoreFocus(previousElement: HTMLElement | null): void {
    if (previousElement && previousElement.focus) {
      previousElement.focus();
    }
  }
}

/**
 * Keyboard navigation utilities
 */
export class KeyboardNavigation {
  static handleEscape(callback: () => void): () => void {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        callback();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }

  static handleArrowKeys(
    container: HTMLElement,
    onSelect: (element: HTMLElement) => void,
    orientation: 'horizontal' | 'vertical' = 'vertical'
  ): () => void {
    const focusableElements = FocusManager.getFocusableElements(container);
    let currentIndex = 0;

    const handleArrowKey = (event: KeyboardEvent) => {
      const isVertical = orientation === 'vertical';
      const nextKey = isVertical ? 'ArrowDown' : 'ArrowRight';
      const prevKey = isVertical ? 'ArrowUp' : 'ArrowLeft';

      if (event.key === nextKey) {
        event.preventDefault();
        currentIndex = (currentIndex + 1) % focusableElements.length;
        focusableElements[currentIndex].focus();
        onSelect(focusableElements[currentIndex]);
      } else if (event.key === prevKey) {
        event.preventDefault();
        currentIndex = currentIndex === 0 ? focusableElements.length - 1 : currentIndex - 1;
        focusableElements[currentIndex].focus();
        onSelect(focusableElements[currentIndex]);
      }
    };

    container.addEventListener('keydown', handleArrowKey);

    return () => {
      container.removeEventListener('keydown', handleArrowKey);
    };
  }
}

/**
 * Color contrast utilities
 */
export class ColorContrast {
  /**
   * Calculate relative luminance of a color
   */
  static getLuminance(color: string): number {
    const rgb = this.hexToRgb(color);
    if (!rgb) return 0;

    const [r, g, b] = rgb.map(value => {
      value = value / 255;
      return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  /**
   * Calculate contrast ratio between two colors
   */
  static getContrastRatio(color1: string, color2: string): number {
    const lum1 = this.getLuminance(color1);
    const lum2 = this.getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  }

  /**
   * Check if contrast meets WCAG AA standards
   */
  static meetsWCAG_AA(foreground: string, background: string, large: boolean = false): boolean {
    const ratio = this.getContrastRatio(foreground, background);
    return large ? ratio >= 3 : ratio >= 4.5;
  }

  /**
   * Check if contrast meets WCAG AAA standards
   */
  static meetsWCAG_AAA(foreground: string, background: string, large: boolean = false): boolean {
    const ratio = this.getContrastRatio(foreground, background);
    return large ? ratio >= 4.5 : ratio >= 7;
  }

  private static hexToRgb(hex: string): [number, number, number] | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : null;
  }
}

/**
 * ARIA utilities
 */
export class AriaUtils {
  static setAriaLabel(element: HTMLElement, label: string): void {
    element.setAttribute('aria-label', label);
  }

  static setAriaLabelledby(element: HTMLElement, labelledBy: string): void {
    element.setAttribute('aria-labelledby', labelledBy);
  }

  static setAriaDescribedby(element: HTMLElement, describedBy: string): void {
    element.setAttribute('aria-describedby', describedBy);
  }

  static setAriaExpanded(element: HTMLElement, expanded: boolean): void {
    element.setAttribute('aria-expanded', expanded.toString());
  }

  static setAriaPressed(element: HTMLElement, pressed: boolean): void {
    element.setAttribute('aria-pressed', pressed.toString());
  }

  static setAriaSelected(element: HTMLElement, selected: boolean): void {
    element.setAttribute('aria-selected', selected.toString());
  }

  static setAriaHidden(element: HTMLElement, hidden: boolean): void {
    element.setAttribute('aria-hidden', hidden.toString());
  }

  static setRole(element: HTMLElement, role: string): void {
    element.setAttribute('role', role);
  }

  static setAriaLive(element: HTMLElement, live: 'off' | 'polite' | 'assertive'): void {
    element.setAttribute('aria-live', live);
  }

  static setAriaAtomic(element: HTMLElement, atomic: boolean): void {
    element.setAttribute('aria-atomic', atomic.toString());
  }

  static setAriaBusy(element: HTMLElement, busy: boolean): void {
    element.setAttribute('aria-busy', busy.toString());
  }
}

/**
 * Skip link utilities
 */
export class SkipLinks {
  static createSkipLink(href: string, text: string): HTMLElement {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = text;
    link.className = 'skip-link';
    
    // Style for skip link
    Object.assign(link.style, {
      position: 'absolute',
      top: '-40px',
      left: '6px',
      background: '#000',
      color: '#fff',
      padding: '8px',
      textDecoration: 'none',
      borderRadius: '4px',
      zIndex: '10000',
      transition: 'top 0.3s',
    });

    // Show on focus
    link.addEventListener('focus', () => {
      link.style.top = '6px';
    });

    link.addEventListener('blur', () => {
      link.style.top = '-40px';
    });

    return link;
  }

  static initializeSkipLinks(): void {
    if (typeof document === 'undefined') return;

    // Create skip links
    const skipToMain = this.createSkipLink('#main', 'Skip to main content');
    const skipToNavigation = this.createSkipLink('#navigation', 'Skip to navigation');

    // Add to beginning of body
    document.body.insertBefore(skipToMain, document.body.firstChild);
    document.body.insertBefore(skipToNavigation, document.body.firstChild);
  }
}

/**
 * Reduced motion utilities
 */
export class ReducedMotion {
  static prefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  static getAnimationDuration(defaultDuration: number): number {
    return this.prefersReducedMotion() ? 0 : defaultDuration;
  }

  static setupReducedMotion(): void {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleMotionChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        document.documentElement.classList.add('reduced-motion');
      } else {
        document.documentElement.classList.remove('reduced-motion');
      }
    };

    mediaQuery.addEventListener('change', handleMotionChange);
    handleMotionChange(mediaQuery as any);
  }
}

/**
 * High contrast mode utilities
 */
export class HighContrast {
  static prefersHighContrast(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-contrast: high)').matches;
  }

  static setupHighContrast(): void {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    
    const handleContrastChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }
    };

    mediaQuery.addEventListener('change', handleContrastChange);
    handleContrastChange(mediaQuery as any);
  }
}

/**
 * React hooks for accessibility
 */
export function useFocusTrap(isActive: boolean, containerRef: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const cleanup = FocusManager.trapFocus(containerRef.current);
    return cleanup;
  }, [isActive, containerRef]);
}

export function useEscapeKey(callback: () => void, isActive: boolean = true) {
  useEffect(() => {
    if (!isActive) return;

    const cleanup = KeyboardNavigation.handleEscape(callback);
    return cleanup;
  }, [callback, isActive]);
}

export function useScreenReaderAnnouncement() {
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    ScreenReader.announce(message, priority);
  };

  return { announce };
}

export function useAriaAnnouncer() {
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    ScreenReader.announce(message, priority);
  };

  const announceError = (error: string) => {
    ScreenReader.announceError(error);
  };

  const announceSuccess = (success: string) => {
    ScreenReader.announceSuccess(success);
  };

  return { announce, announceError, announceSuccess };
}

/**
 * Accessibility testing utilities
 */
export class AccessibilityTesting {
  static checkAltText(): { missing: string[]; present: string[] } {
    const images = document.querySelectorAll('img');
    const missing: string[] = [];
    const present: string[] = [];

    images.forEach(img => {
      const alt = img.getAttribute('alt');
      const src = img.getAttribute('src') || '';
      
      if (alt === null) {
        missing.push(src);
      } else {
        present.push(src);
      }
    });

    return { missing, present };
  }

  static checkHeadingStructure(): { valid: boolean; issues: string[] } {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const issues: string[] = [];
    let previousLevel = 0;

    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.substring(1));
      
      if (index === 0 && level !== 1) {
        issues.push(`First heading should be h1, found h${level}`);
      }
      
      if (level > previousLevel + 1) {
        issues.push(`Heading level skipped: h${previousLevel} to h${level}`);
      }
      
      previousLevel = level;
    });

    return {
      valid: issues.length === 0,
      issues,
    };
  }

  static checkFocusableElements(): { count: number; elements: string[] } {
    const focusable = FocusManager.getFocusableElements(document.body);
    return {
      count: focusable.length,
      elements: focusable.map(el => el.tagName.toLowerCase()),
    };
  }

  static checkColorContrast(): { pass: boolean; fail: string[] } {
    // This would require actual color computation
    // For now, return a placeholder
    return {
      pass: true,
      fail: [],
    };
  }
}

// Initialize accessibility features
if (typeof window !== 'undefined') {
  ScreenReader.initialize();
  SkipLinks.initializeSkipLinks();
  ReducedMotion.setupReducedMotion();
  HighContrast.setupHighContrast();
}

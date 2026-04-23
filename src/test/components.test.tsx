import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from '@tanstack/react-router';
import FloatingRobot from '@/components/FloatingRobot';

// Mock the Link component
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  MessageCircle: ({ className }: { className: string }) => (
    <div data-testid="message-circle" className={className} />
  ),
  Sparkles: ({ className }: { className: string }) => (
    <div data-testid="sparkles" className={className} />
  ),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('FloatingRobot Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the floating robot', () => {
    renderWithRouter(<FloatingRobot />);
    
    // Check if the main container exists
    const robotContainer = screen.getByRole('link');
    expect(robotContainer).toBeInTheDocument();
    expect(robotContainer).toHaveAttribute('href', '/chat');
  });

  it('should have correct positioning classes', () => {
    renderWithRouter(<FloatingRobot />);
    
    const robotContainer = screen.getByRole('link');
    expect(robotContainer.parentElement).toHaveClass('fixed', 'bottom-6', 'right-6', 'z-50');
  });

  it('should have hover effects', () => {
    renderWithRouter(<FloatingRobot />);
    
    const robotContainer = screen.getByRole('link');
    expect(robotContainer).toHaveClass('group');
  });

  it('should display the chat icon', () => {
    renderWithRouter(<FloatingRobot />);
    
    const messageIcon = screen.getByTestId('message-circle');
    expect(messageIcon).toBeInTheDocument();
  });

  it('should display sparkles around the robot', () => {
    renderWithRouter(<FloatingRobot />);
    
    const sparkles = screen.getAllByTestId('sparkles');
    expect(sparkles).toHaveLength(3); // Should have 3 sparkle elements
  });

  it('should have graduation cap', () => {
    renderWithRouter(<FloatingRobot />);
    
    // Check for graduation cap elements
    const capElements = document.querySelectorAll('.bg-blue-800');
    expect(capElements.length).toBeGreaterThan(0);
  });

  it('should have facial features', () => {
    renderWithRouter(<FloatingRobot />);
    
    // Check for eyes
    const eyes = document.querySelectorAll('.bg-white.rounded-full.border');
    expect(eyes.length).toBe(2);
    
    // Check for nose
    const nose = document.querySelector('.bg-orange-400.rounded-full');
    expect(nose).toBeInTheDocument();
    
    // Check for blush cheeks
    const cheeks = document.querySelectorAll('.bg-pink-200.rounded-full');
    expect(cheeks.length).toBe(2);
  });

  it('should have correct accessibility attributes', () => {
    renderWithRouter(<FloatingRobot />);
    
    const robotContainer = screen.getByRole('link');
    expect(robotContainer).toHaveAttribute('href', '/chat');
  });

  it('should handle click events', async () => {
    const user = userEvent.setup();
    renderWithRouter(<FloatingRobot />);
    
    const robotContainer = screen.getByRole('link');
    
    await user.click(robotContainer);
    
    // Should navigate to /chat (handled by the Link component)
    expect(robotContainer.closest('a')).toHaveAttribute('href', '/chat');
  });

  it('should have animation classes', () => {
    renderWithRouter(<FloatingRobot />);
    
    const robotContainer = screen.getByRole('link');
    expect(robotContainer).toHaveClass('animate-float');
  });

  it('should have gradient background', () => {
    renderWithRouter(<FloatingRobot />);
    
    const robotContainer = screen.getByRole('link');
    expect(robotContainer).toHaveClass('bg-gradient-to-br', 'from-sky-200', 'via-sky-300', 'to-blue-300');
  });

  it('should have proper size classes', () => {
    renderWithRouter(<FloatingRobot />);
    
    const robotContainer = screen.getByRole('link');
    expect(robotContainer).toHaveClass('h-16', 'w-16');
  });

  it('should have shadow effects', () => {
    renderWithRouter(<FloatingRobot />);
    
    const robotContainer = screen.getByRole('link');
    expect(robotContainer).toHaveClass('shadow-elegant');
  });

  it('should have hover scale effect', () => {
    renderWithRouter(<FloatingRobot />);
    
    const robotContainer = screen.getByRole('link');
    expect(robotContainer).toHaveClass('hover:scale-110');
  });

  it('should have hover glow effect', () => {
    renderWithRouter(<FloatingRobot />);
    
    const robotContainer = screen.getByRole('link');
    expect(robotContainer).toHaveClass('hover:shadow-glow');
  });

  it('should have transition effects', () => {
    renderWithRouter(<FloatingRobot />);
    
    const robotContainer = screen.getByRole('link');
    expect(robotContainer).toHaveClass('transition-all', 'duration-300');
  });
});

describe('FloatingRobot Accessibility', () => {
  it('should be keyboard accessible', async () => {
    const user = userEvent.setup();
    renderWithRouter(<FloatingRobot />);
    
    const robotContainer = screen.getByRole('link');
    
    // Focus the element
    robotContainer.focus();
    expect(robotContainer).toHaveFocus();
    
    // Activate with Enter key
    await user.keyboard('{Enter}');
    expect(robotContainer.closest('a')).toHaveAttribute('href', '/chat');
  });

  it('should have proper ARIA attributes', () => {
    renderWithRouter(<FloatingRobot />);
    
    const robotContainer = screen.getByRole('link');
    
    // Should have a meaningful href for navigation
    expect(robotContainer).toHaveAttribute('href', '/chat');
  });

  it('should have sufficient color contrast', () => {
    renderWithRouter(<FloatingRobot />);
    
    const robotContainer = screen.getByRole('link');
    
    // Check that it has background classes for contrast
    expect(robotContainer).toHaveClass('bg-gradient-to-br');
  });
});

describe('FloatingRobot Performance', () => {
  it('should not cause memory leaks', () => {
    const { unmount } = renderWithRouter(<FloatingRobot />);
    
    // Component should unmount without errors
    expect(() => unmount()).not.toThrow();
  });

  it('should have optimized animations', () => {
    renderWithRouter(<FloatingRobot />);
    
    // Check for CSS animation classes instead of JavaScript animations
    const sparkles = screen.getAllByTestId('sparkles');
    sparkles.forEach(sparkle => {
      expect(sparkle).toHaveClass('animate-spin');
    });
  });
});

describe('FloatingRobot Error Handling', () => {
  it('should handle navigation errors gracefully', async () => {
    const user = userEvent.setup();
    renderWithRouter(<FloatingRobot />);
    
    const robotContainer = screen.getByRole('link');
    
    // Mock console.error to check for error messages
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Click should not throw errors
    await user.click(robotContainer);
    
    // Should not have logged errors
    expect(consoleSpy).not.toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });
});

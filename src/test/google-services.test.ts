import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  GeminiAIService,
  GoogleMapsService,
  GoogleAnalyticsService,
  GoogleCalendarService,
} from "../lib/google-services";

// Mocking dependencies
vi.mock("@google/generative-ai", () => {
  const mockModel = {
    generateContent: vi.fn().mockResolvedValue({
      response: { text: () => "Mocked AI Response" },
    }),
  };
  const mockGenAI = {
    getGenerativeModel: vi.fn().mockReturnValue(mockModel),
  };
  return {
    GoogleGenerativeAI: vi.fn().mockImplementation(() => mockGenAI),
  };
});

vi.mock("@googlemaps/js-api-loader", () => ({
  Loader: vi.fn().mockImplementation(() => ({
    load: vi.fn().mockResolvedValue(undefined),
  })),
}));

describe("Google Services", () => {
  describe("GeminiAIService", () => {
    it("should be a singleton", () => {
      const instance1 = GeminiAIService.getInstance();
      const instance2 = GeminiAIService.getInstance();
      expect(instance1).toBe(instance2);
    });

    it("should generate election response", async () => {
      const service = GeminiAIService.getInstance();
      // Mocking environment variables on the instance property if needed,
      // or ensuring the singleton doesn't fail initialization
      (service as unknown as { API_KEY: string }).API_KEY = "test-key";
      const response = await service.generateElectionResponse("What is voting?");
      expect(response).toBe("Mocked AI Response");
    });
  });

  describe("GoogleMapsService", () => {
    it("should be a singleton", () => {
      const instance1 = GoogleMapsService.getInstance();
      const instance2 = GoogleMapsService.getInstance();
      expect(instance1).toBe(instance2);
    });

    it("should calculate distance correctly", () => {
      const service = GoogleMapsService.getInstance();
      // Distance between two points in Delhi
      const dist = (
        service as unknown as {
          calculateDistance: (a: number, b: number, c: number, d: number) => number;
        }
      ).calculateDistance(28.6139, 77.209, 28.612, 77.2295);
      expect(dist).toBeGreaterThan(0);
      expect(dist).toBeLessThan(10);
    });
  });

  describe("GoogleAnalyticsService", () => {
    it("should be a singleton", () => {
      const instance1 = GoogleAnalyticsService.getInstance();
      const instance2 = GoogleAnalyticsService.getInstance();
      expect(instance1).toBe(instance2);
    });

    it("should initialize without crashing", async () => {
      const service = GoogleAnalyticsService.getInstance();
      vi.stubEnv("VITE_GA_MEASUREMENT_ID", "UA-TEST-1");
      await service.initialize();
      // Just check no errors
    });
  });

  describe("GoogleCalendarService", () => {
    it("should generate valid calendar URL", () => {
      const service = GoogleCalendarService.getInstance();
      const url = service.generateCalendarUrl({
        title: "Test Event",
        details: "Test Details",
        startDate: "20240520T090000Z",
        endDate: "20240520T180000Z",
      });
      expect(url).toContain("google.com/calendar/render");
      expect(url).toContain("Test+Event");
    });
  });
});

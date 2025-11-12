// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Mock ResizeObserver for Radix UI components
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
} as any;
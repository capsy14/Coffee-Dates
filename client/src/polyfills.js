// Polyfills for browser compatibility
import { Buffer } from 'buffer';
import process from 'process/browser';

// Make Buffer and process available globally
window.Buffer = Buffer;
window.process = process;

// Additional polyfills if needed
if (typeof global === 'undefined') {
  window.global = window;
}
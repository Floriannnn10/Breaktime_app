import { ThemeColors } from '../types';

export const theme: ThemeColors = {
  background: '#0f0f23',
  surface: '#1a1a2e',
  primary: '#4ecdc4',      // Turquoise
  secondary: '#4f46e5',    // Violet
  accent: '#10b981',       // Vert
  text: '#ffffff',         // Blanc
  textSecondary: '#9ca3af', // Gris
  success: '#10b981',      // Vert
  error: '#ef4444',        // Rouge
};

export const gradients = {
  primary: ['#4ecdc4', '#4f46e5'],
  secondary: ['#1a1a2e', '#16213e'],
  accent: ['#4f46e5', '#4ecdc4'],
  background: ['#0f0f23', '#1a1a2e'],
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
}; 
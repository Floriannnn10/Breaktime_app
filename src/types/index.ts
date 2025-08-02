export interface PauseSettings {
  duration: number;      // Durée de pause (minutes)
  frequency: number;     // Fréquence de travail (minutes)
  isActive: boolean;     // Programme actif/inactif
}

export interface TimerState {
  isRunning: boolean;
  timeRemaining: number;
  currentPhase: 'work' | 'break';
  totalWorkTime: number;
  totalBreakTime: number;
}

export interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  vibration: boolean;
}

export interface AppState {
  settings: PauseSettings;
  timer: TimerState;
  notifications: NotificationSettings;
  currentScreen: 'welcome' | 'captivation' | 'main' | 'settings';
}

export interface ThemeColors {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  textSecondary: string;
  success: string;
  error: string;
} 
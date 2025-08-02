export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const formatTimeLong = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${remainingSeconds}s`;
  }
};

export const minutesToSeconds = (minutes: number): number => {
  return minutes * 60;
};

export const secondsToMinutes = (seconds: number): number => {
  return Math.floor(seconds / 60);
};

export const calculateProgress = (current: number, total: number): number => {
  if (total === 0) return 0;
  return Math.max(0, Math.min(1, (total - current) / total));
};

export const getPhaseLabel = (phase: 'work' | 'break'): string => {
  return phase === 'work' ? 'Travail' : 'Pause';
};

export const getPhaseEmoji = (phase: 'work' | 'break'): string => {
  return phase === 'work' ? '💼' : '☕';
};

export const getPhaseColor = (phase: 'work' | 'break'): string => {
  return phase === 'work' ? '#4f46e5' : '#4ecdc4';
};

export const getDefaultSettings = () => ({
  duration: 10,    // 10 minutes de pause par défaut
  frequency: 60,   // 60 minutes de travail par défaut
  isActive: false,
});

export const validateSettings = (settings: { duration: number; frequency: number }) => {
  const errors: string[] = [];
  
  if (settings.duration < 1 || settings.duration > 60) {
    errors.push('La durée de pause doit être entre 1 et 60 minutes');
  }
  
  if (settings.frequency < 5 || settings.frequency > 240) {
    errors.push('La fréquence de travail doit être entre 5 et 240 minutes');
  }
  
  return errors;
}; 
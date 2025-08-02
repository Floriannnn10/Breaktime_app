import { useState, useEffect, useCallback, useRef } from 'react';
import { TimerState, PauseSettings } from '../types';
import { formatTime, minutesToSeconds, calculateProgress, getDefaultSettings } from '../utils/timeUtils';
import { 
  scheduleBreakNotification, 
  scheduleWorkNotification, 
  cancelAllNotifications,
  triggerHapticFeedback,
  triggerHapticImpact 
} from '../utils/notifications';

export const useTimer = (settings?: PauseSettings) => {
  const defaultSettings = settings || getDefaultSettings();
  
  const [timerState, setTimerState] = useState<TimerState>({
    isRunning: false,
    timeRemaining: minutesToSeconds(defaultSettings.frequency),
    currentPhase: 'work',
    totalWorkTime: minutesToSeconds(defaultSettings.frequency),
    totalBreakTime: minutesToSeconds(defaultSettings.duration),
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [progress, setProgress] = useState(0);

  // Réinitialiser le timer quand les paramètres changent
  useEffect(() => {
    if (settings) {
      setTimerState({
        isRunning: false,
        timeRemaining: minutesToSeconds(settings.frequency),
        currentPhase: 'work',
        totalWorkTime: minutesToSeconds(settings.frequency),
        totalBreakTime: minutesToSeconds(settings.duration),
      });
      
      // Arrêter le timer en cours si il y en a un
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [settings?.duration, settings?.frequency]);

  // Fonction pour démarrer le timer
  const startTimer = useCallback(async () => {
    if (timerState.isRunning) return;

    setTimerState(prev => ({ ...prev, isRunning: true }));
    triggerHapticImpact('medium');

    // Programmer la notification appropriée selon la phase actuelle
    if (timerState.currentPhase === 'work') {
      // En phase de travail, programmer une notification de pause
      await scheduleBreakNotification(timerState.timeRemaining);
    } else {
      // En phase de pause, programmer une notification de travail
      await scheduleWorkNotification(timerState.timeRemaining);
    }

    intervalRef.current = setInterval(() => {
      setTimerState(prev => {
        const newTimeRemaining = prev.timeRemaining - 1;
        
        if (newTimeRemaining <= 0) {
          // Phase terminée
          triggerHapticFeedback('success');
          
          if (prev.currentPhase === 'work') {
            // Passer à la pause
            return {
              ...prev,
              timeRemaining: minutesToSeconds(defaultSettings.duration),
              currentPhase: 'break',
              totalBreakTime: minutesToSeconds(defaultSettings.duration),
              isRunning: true,
            };
          } else {
            // Passer au travail
            return {
              ...prev,
              timeRemaining: minutesToSeconds(defaultSettings.frequency),
              currentPhase: 'work',
              totalWorkTime: minutesToSeconds(defaultSettings.frequency),
              isRunning: true,
            };
          }
        }
        
        return {
          ...prev,
          timeRemaining: newTimeRemaining,
        };
      });
    }, 1000);
  }, [timerState, defaultSettings]);

  // Fonction pour arrêter le timer
  const stopTimer = useCallback(async () => {
    if (!timerState.isRunning) return;

    setTimerState(prev => ({ ...prev, isRunning: false }));
    triggerHapticImpact('light');
    await cancelAllNotifications();

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [timerState.isRunning]);

  // Fonction pour réinitialiser le timer
  const resetTimer = useCallback(async () => {
    await stopTimer();
    setTimerState({
      isRunning: false,
      timeRemaining: minutesToSeconds(defaultSettings.frequency),
      currentPhase: 'work',
      totalWorkTime: minutesToSeconds(defaultSettings.frequency),
      totalBreakTime: minutesToSeconds(defaultSettings.duration),
    });
  }, [defaultSettings, stopTimer]);

  // Fonction pour passer à la phase suivante
  const skipPhase = useCallback(async () => {
    triggerHapticImpact('medium');
    
    if (timerState.currentPhase === 'work') {
      setTimerState(prev => ({
        ...prev,
        timeRemaining: minutesToSeconds(defaultSettings.duration),
        currentPhase: 'break',
        totalBreakTime: minutesToSeconds(defaultSettings.duration),
      }));
    } else {
      setTimerState(prev => ({
        ...prev,
        timeRemaining: minutesToSeconds(defaultSettings.frequency),
        currentPhase: 'work',
        totalWorkTime: minutesToSeconds(defaultSettings.frequency),
      }));
    }
  }, [timerState.currentPhase, defaultSettings]);

  // Calculer le progrès
  useEffect(() => {
    const total = timerState.currentPhase === 'work' 
      ? timerState.totalWorkTime 
      : timerState.totalBreakTime;
    
    setProgress(calculateProgress(timerState.timeRemaining, total));
  }, [timerState.timeRemaining, timerState.currentPhase, timerState.totalWorkTime, timerState.totalBreakTime]);

  // Nettoyer l'intervalle quand le composant se démonte
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Formater le temps restant
  const formattedTime = formatTime(timerState.timeRemaining);

  return {
    timerState,
    progress,
    formattedTime,
    startTimer,
    stopTimer,
    resetTimer,
    skipPhase,
  };
}; 
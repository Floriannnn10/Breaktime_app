import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CircularTimer } from '../components/CircularTimer';
import { useTimer } from '../hooks/useTimer';
import { theme, shadows } from '../utils/theme';
import { formatTimeLong } from '../utils/timeUtils';

const { width } = Dimensions.get('window');

interface MainTimerScreenProps {
  onOpenSettings: () => void;
  settings?: { duration: number; frequency: number };
}

export const MainTimerScreen: React.FC<MainTimerScreenProps> = ({ 
  onOpenSettings,
  settings 
}) => {
  const {
    timerState,
    progress,
    formattedTime,
    startTimer,
    stopTimer,
    resetTimer,
    skipPhase,
  } = useTimer(settings);

  const [showTips, setShowTips] = useState(false);

  const handleStartStop = () => {
    if (timerState.isRunning) {
      stopTimer();
    } else {
      startTimer();
    }
  };

  const handleReset = () => {
    resetTimer();
  };

  const handleSkip = () => {
    skipPhase();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={theme.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>BreaktimeApp</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={onOpenSettings}
          activeOpacity={0.7}
        >
          <Text style={styles.settingsButtonText}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Timer principal */}
      <View style={styles.timerSection}>
        <CircularTimer
          timeRemaining={timerState.timeRemaining}
          totalTime={timerState.currentPhase === 'work' ? timerState.totalWorkTime : timerState.totalBreakTime}
          currentPhase={timerState.currentPhase}
          isRunning={timerState.isRunning}
        />
      </View>

      {/* Contrôles */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, styles.primaryButton]}
          onPress={handleStartStop}
          activeOpacity={0.8}
        >
          <View style={[styles.buttonGradient, { backgroundColor: theme.primary }]}>
            <Text style={styles.primaryButtonText}>
              {timerState.isRunning ? '⏸️ Pause' : '▶️ Démarrer'}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.secondaryControls}>
          <TouchableOpacity
            style={[styles.controlButton, styles.secondaryButton]}
            onPress={handleReset}
            activeOpacity={0.8}
          >
            <View style={[styles.buttonGradient, { backgroundColor: theme.surface }]}>
              <Text style={styles.secondaryButtonText}>🔄 Reset</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.secondaryButton]}
            onPress={handleSkip}
            activeOpacity={0.8}
          >
            <View style={[styles.buttonGradient, { backgroundColor: theme.surface }]}>
              <Text style={styles.secondaryButtonText}>⏭️ Passer</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Informations */}
      <ScrollView style={styles.infoSection} showsVerticalScrollIndicator={false}>
        {/* Configuration actuelle */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>📋 Configuration actuelle</Text>
          <Text style={styles.infoCardText}>
            • Travail : {formatTimeLong(timerState.totalWorkTime)}{'\n'}
            • Pause : {formatTimeLong(timerState.totalBreakTime)}{'\n'}
            • Phase actuelle : {timerState.currentPhase === 'work' ? 'Travail' : 'Pause'}
          </Text>
        </View>

        {/* Conseils */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>💡 Conseils</Text>
          <Text style={styles.infoCardText}>
            • Prenez des pauses régulières pour votre bien-être{'\n'}
            • Éloignez-vous de votre écran pendant les pauses{'\n'}
            • Buvez de l'eau et étirez-vous régulièrement{'\n'}
            • Ajustez les paramètres selon vos besoins
          </Text>
        </View>

        {/* Statistiques */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>📊 Statistiques</Text>
          <Text style={styles.infoCardText}>
            • Temps total de travail : {formatTimeLong(timerState.totalWorkTime)}{'\n'}
            • Temps total de pause : {formatTimeLong(timerState.totalBreakTime)}{'\n'}
            • Temps restant : {formatTimeLong(timerState.timeRemaining)}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.text,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.small,
  },
  settingsButtonText: {
    fontSize: 20,
  },
  timerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  controls: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  controlButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    ...shadows.medium,
  },
  primaryButton: {
    ...shadows.large,
  },
  secondaryButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
  },
  secondaryControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.textSecondary,
  },
  infoSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  infoCard: {
    backgroundColor: theme.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    ...shadows.small,
  },
  infoCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 12,
  },
  infoCardText: {
    fontSize: 14,
    color: theme.textSecondary,
    lineHeight: 20,
  },
}); 
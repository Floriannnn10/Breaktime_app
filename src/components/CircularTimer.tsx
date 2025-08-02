import React from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { theme } from '../utils/theme';
import { getPhaseEmoji, getPhaseColor } from '../utils/timeUtils';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = Math.min(width * 0.7, 300);
const STROKE_WIDTH = 12;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface CircularTimerProps {
  timeRemaining: number;
  totalTime: number;
  currentPhase: 'work' | 'break';
  isRunning: boolean;
}

export const CircularTimer: React.FC<CircularTimerProps> = ({
  timeRemaining,
  totalTime,
  currentPhase,
  isRunning,
}) => {
  const progress = 1 - (timeRemaining / totalTime);
  const strokeDasharray = CIRCUMFERENCE;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  const animatedValue = React.useRef(new Animated.Value(0)).current;
  const pulseAnimation = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  React.useEffect(() => {
    if (isRunning) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnimation.setValue(1);
    }
  }, [isRunning]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.timerContainer,
          {
            transform: [{ scale: pulseAnimation }],
          },
        ]}
      >
        <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
          {/* Cercle de fond */}
          <Circle
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            r={RADIUS}
            stroke={theme.surface}
            strokeWidth={STROKE_WIDTH}
            fill="transparent"
          />
          
          {/* Cercle de progression */}
          <Circle
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            r={RADIUS}
            stroke={getPhaseColor(currentPhase)}
            strokeWidth={STROKE_WIDTH}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            transform={`rotate(-90 ${CIRCLE_SIZE / 2} ${CIRCLE_SIZE / 2})`}
          />
        </Svg>
        
        {/* Contenu central */}
        <View style={styles.centerContent}>
          <Text style={styles.phaseEmoji}>{getPhaseEmoji(currentPhase)}</Text>
          <Text style={styles.timeText}>{formatTime(timeRemaining)}</Text>
          <Text style={styles.phaseText}>
            {currentPhase === 'work' ? 'Travail' : 'Pause'}
          </Text>
          <Text style={styles.statusText}>
            {isRunning ? 'En cours...' : 'En pause'}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  timerContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  timeText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: theme.text,
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  phaseText: {
    fontSize: 18,
    color: theme.textSecondary,
    marginBottom: 2,
  },
  statusText: {
    fontSize: 14,
    color: theme.textSecondary,
    opacity: 0.7,
  },
}); 
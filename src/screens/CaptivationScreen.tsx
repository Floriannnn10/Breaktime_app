import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { theme, shadows } from '../utils/theme';

const { width, height } = Dimensions.get('window');

interface CaptivationScreenProps {
  onComplete: () => void;
}

const CAPTIVATION_STEPS = [
  { emoji: '🎯', text: 'Préparez-vous pour une session productive' },
  { emoji: '⚡', text: 'Concentrez-vous sur vos objectifs' },
  { emoji: '🧘', text: 'Respirez profondément et détendez-vous' },
  { emoji: '💪', text: 'Vous êtes prêt à donner le meilleur de vous-même' },
  { emoji: '🚀', text: 'C\'est parti pour une expérience optimale !' },
];

export const CaptivationScreen: React.FC<CaptivationScreenProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const totalDuration = 7000; // 7 secondes total
    const stepDuration = totalDuration / CAPTIVATION_STEPS.length;
    
    // Animation de progression
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: totalDuration,
      useNativeDriver: false,
    }).start();

    // Animation du premier step
    animateStep();

    // Timer pour changer les steps
    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => {
        const next = prev + 1;
        if (next >= CAPTIVATION_STEPS.length) {
          clearInterval(stepTimer);
          setTimeout(() => {
            onComplete();
          }, 1000);
          return prev;
        }
        animateStep();
        return next;
      });
    }, stepDuration);

    return () => clearInterval(stepTimer);
  }, []);

  const animateStep = () => {
    // Reset animations
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.8);
    rotateAnim.setValue(0);

    // Start new animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={theme.background} />
      
      {/* Barre de progression */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {Math.round(progressAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 100],
          }))}%
        </Text>
      </View>

      {/* Contenu principal */}
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.emojiContainer,
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
                { rotate: spin },
              ],
            },
          ]}
        >
          <Text style={styles.emoji}>{CAPTIVATION_STEPS[currentStep].emoji}</Text>
        </Animated.View>

        <Animated.Text
          style={[
            styles.message,
            {
              opacity: fadeAnim,
              transform: [{ translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }) }],
            },
          ]}
        >
          {CAPTIVATION_STEPS[currentStep].text}
        </Animated.Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Préparez-vous pour une expérience optimale...
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  progressContainer: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: theme.surface,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.primary,
    borderRadius: 2,
  },
  progressText: {
    marginTop: 8,
    fontSize: 12,
    color: theme.textSecondary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 400,
  },
  emojiContainer: {
    marginBottom: 40,
  },
  emoji: {
    fontSize: 120,
  },
  message: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.text,
    textAlign: 'center',
    lineHeight: 32,
  },
  footer: {
    position: 'absolute',
    bottom: 100,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: 'center',
  },
}); 
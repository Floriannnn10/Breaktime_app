import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { theme, gradients, shadows } from '../utils/theme';

const { width, height } = Dimensions.get('window');

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animation d'entrée
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Animation de pulsation continue
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleStart = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
      onStart();
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={theme.background} />
      
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        {/* Logo et titre */}
        <View style={styles.header}>
          <Animated.Text
            style={[
              styles.logo,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            ⏰
          </Animated.Text>
          <Text style={styles.title}>BreaktimeApp</Text>
          <Text style={styles.subtitle}>
            Votre compagnon pour un équilibre travail-pause optimal
          </Text>
        </View>

        {/* Description */}
        <View style={styles.description}>
          <Text style={styles.descriptionTitle}>🎯 Pourquoi BreaktimeApp ?</Text>
          <Text style={styles.descriptionText}>
            • Améliorez votre productivité avec la méthode Pomodoro{'\n'}
            • Prenez des pauses régulières pour votre bien-être{'\n'}
            • Interface moderne et intuitive{'\n'}
            • Notifications intelligentes et feedback haptique
          </Text>
        </View>

        {/* Conseils */}
        <View style={styles.tips}>
          <Text style={styles.tipsTitle}>💡 Conseils d'utilisation</Text>
          <Text style={styles.tipsText}>
            • Travaillez 25-60 minutes puis prenez 5-15 minutes de pause{'\n'}
            • Éloignez-vous de votre écran pendant les pauses{'\n'}
            • Buvez de l'eau et étirez-vous régulièrement
          </Text>
        </View>

        {/* Bouton de démarrage */}
        <Animated.View
          style={[
            styles.buttonContainer,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStart}
            activeOpacity={0.8}
          >
            <View style={[styles.buttonGradient, { backgroundColor: theme.primary }]}>
              <Text style={styles.buttonText}>🚀 Commencer l'expérience</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
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
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  description: {
    backgroundColor: theme.surface,
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    width: '100%',
    ...shadows.medium,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: theme.textSecondary,
    lineHeight: 20,
  },
  tips: {
    backgroundColor: theme.surface,
    padding: 20,
    borderRadius: 16,
    marginBottom: 40,
    width: '100%',
    ...shadows.medium,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 12,
  },
  tipsText: {
    fontSize: 14,
    color: theme.textSecondary,
    lineHeight: 20,
  },
  buttonContainer: {
    width: '100%',
  },
  startButton: {
    borderRadius: 16,
    overflow: 'hidden',
    ...shadows.large,
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
  },
}); 
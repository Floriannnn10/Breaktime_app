import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme, shadows } from '../utils/theme';
import { validateSettings } from '../utils/timeUtils';

interface SettingsScreenProps {
  onClose: () => void;
  onSaveSettings: (settings: { duration: number; frequency: number }) => void;
  currentSettings: { duration: number; frequency: number };
}

const DURATION_OPTIONS = [5, 10, 15, 20, 30];
const FREQUENCY_OPTIONS = [25, 45, 60, 90, 120];

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onClose,
  onSaveSettings,
  currentSettings,
}) => {
  const [selectedDuration, setSelectedDuration] = useState(currentSettings.duration);
  const [selectedFrequency, setSelectedFrequency] = useState(currentSettings.frequency);
  const [errors, setErrors] = useState<string[]>([]);

  const handleSave = () => {
    const newSettings = {
      duration: selectedDuration,
      frequency: selectedFrequency,
    };

    const validationErrors = validateSettings(newSettings);
    setErrors(validationErrors);

    if (validationErrors.length === 0) {
      onSaveSettings(newSettings);
      onClose();
    }
  };

  const handleReset = () => {
    setSelectedDuration(10);
    setSelectedFrequency(60);
    setErrors([]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={theme.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onClose}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paramètres</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Durée de pause */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⏰ Durée de pause</Text>
          <Text style={styles.sectionDescription}>
            Choisissez la durée de vos pauses
          </Text>
          
          <View style={styles.optionsContainer}>
            {DURATION_OPTIONS.map((duration) => (
              <TouchableOpacity
                key={duration}
                style={[
                  styles.option,
                  selectedDuration === duration && styles.selectedOption,
                ]}
                onPress={() => setSelectedDuration(duration)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedDuration === duration && styles.selectedOptionText,
                  ]}
                >
                  {duration} min
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Fréquence de travail */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💼 Fréquence de travail</Text>
          <Text style={styles.sectionDescription}>
            Choisissez la durée de vos sessions de travail
          </Text>
          
          <View style={styles.optionsContainer}>
            {FREQUENCY_OPTIONS.map((frequency) => (
              <TouchableOpacity
                key={frequency}
                style={[
                  styles.option,
                  selectedFrequency === frequency && styles.selectedOption,
                ]}
                onPress={() => setSelectedFrequency(frequency)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedFrequency === frequency && styles.selectedOptionText,
                  ]}
                >
                  {frequency} min
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Erreurs de validation */}
        {errors.length > 0 && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>⚠️ Erreurs de validation :</Text>
            {errors.map((error, index) => (
              <Text key={index} style={styles.errorText}>
                • {error}
              </Text>
            ))}
          </View>
        )}

        {/* Conseils d'optimisation */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>💡 Conseils d'optimisation</Text>
          
          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>🎯 Méthode Pomodoro classique</Text>
            <Text style={styles.tipText}>
              25 min de travail + 5 min de pause
            </Text>
          </View>

          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>⚡ Sessions intensives</Text>
            <Text style={styles.tipText}>
              45 min de travail + 15 min de pause
            </Text>
          </View>

          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>🌙 Sessions longues</Text>
            <Text style={styles.tipText}>
              90 min de travail + 20 min de pause
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.resetButton]}
            onPress={handleReset}
            activeOpacity={0.8}
          >
            <View style={[styles.buttonGradient, { backgroundColor: theme.surface }]}>
              <Text style={styles.resetButtonText}>🔄 Réinitialiser</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.saveButton]}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <View style={[styles.buttonGradient, { backgroundColor: theme.primary }]}>
              <Text style={styles.saveButtonText}>💾 Sauvegarder</Text>
            </View>
          </TouchableOpacity>
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
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: theme.textSecondary,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.text,
  },
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  option: {
    backgroundColor: theme.surface,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    ...shadows.small,
  },
  selectedOption: {
    borderColor: theme.primary,
    backgroundColor: theme.primary + '20',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.textSecondary,
  },
  selectedOptionText: {
    color: theme.primary,
  },
  errorContainer: {
    backgroundColor: theme.error + '20',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: theme.error,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.error,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: theme.error,
    marginBottom: 4,
  },
  tipsSection: {
    marginBottom: 30,
  },
  tipsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 16,
  },
  tipCard: {
    backgroundColor: theme.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    ...shadows.small,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },
  actionButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    ...shadows.medium,
  },
  resetButton: {
    // Styles spécifiques pour le bouton reset
  },
  saveButton: {
    // Styles spécifiques pour le bouton save
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.textSecondary,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.text,
  },
}); 
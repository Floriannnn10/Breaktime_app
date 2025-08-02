import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { CaptivationScreen } from './src/screens/CaptivationScreen';
import { MainTimerScreen } from './src/screens/MainTimerScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { getDefaultSettings } from './src/utils/timeUtils';
import { PauseSettings } from './src/types';

type Screen = 'welcome' | 'captivation' | 'main' | 'settings';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [settings, setSettings] = useState<PauseSettings>(getDefaultSettings());

  const handleStartExperience = () => {
    setCurrentScreen('captivation');
  };

  const handleCaptivationComplete = () => {
    setCurrentScreen('main');
  };

  const handleOpenSettings = () => {
    setCurrentScreen('settings');
  };

  const handleCloseSettings = () => {
    setCurrentScreen('main');
  };

  const handleSaveSettings = (newSettings: { duration: number; frequency: number }) => {
    setSettings({
      ...settings,
      duration: newSettings.duration,
      frequency: newSettings.frequency,
    });
    setCurrentScreen('main');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen onStart={handleStartExperience} />;

      case 'captivation':
        return <CaptivationScreen onComplete={handleCaptivationComplete} />;

      case 'main':
        return (
          <MainTimerScreen
            onOpenSettings={handleOpenSettings}
            settings={settings}
          />
        );

      case 'settings':
        return (
          <SettingsScreen
            onClose={handleCloseSettings}
            onSaveSettings={handleSaveSettings}
            currentSettings={settings}
          />
        );

      default:
        return <WelcomeScreen onStart={handleStartExperience} />;
    }
  };

  return (
    <>
      <StatusBar style="light" />
      {renderScreen()}
    </>
  );
} 
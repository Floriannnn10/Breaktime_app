import * as Notifications from 'expo-notifications';
import * as Haptics from 'expo-haptics';

// Configuration des notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const requestNotificationPermissions = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    console.log('Permissions de notification non accordées');
    return false;
  }
  
  return true;
};

export const scheduleBreakNotification = async (timeInSeconds: number) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '💼 Retour au travail !',
      body: 'Votre pause est terminée. Il est temps de reprendre le travail avec énergie !',
      data: { type: 'break' },
    },
    trigger: {
      seconds: timeInSeconds,
    },
  });
};

export const scheduleWorkNotification = async (timeInSeconds: number) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '☕ Pause bienvenue !',
      body: 'Votre session de travail est terminée. Prenez une pause pour vous détendre et vous ressourcer !',
      data: { type: 'work' },
    },
    trigger: {
      seconds: timeInSeconds,
    },
  });
};

export const cancelAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

export const triggerHapticFeedback = (type: 'success' | 'warning' | 'error' = 'success') => {
  switch (type) {
    case 'success':
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      break;
    case 'warning':
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      break;
    case 'error':
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      break;
  }
};

export const triggerHapticImpact = (style: 'light' | 'medium' | 'heavy' = 'medium') => {
  switch (style) {
    case 'light':
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      break;
    case 'medium':
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      break;
    case 'heavy':
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      break;
  }
}; 
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { getOnboardDay, getIsCompleted } from './getFromStorage';
import { setOnboardDay, setIsCompleted } from './saveToSecureStorage';
import * as Notifications from 'expo-notifications';

const BACKGROUND_FETCH_TASK = 'background-fetch-task';

export const initializeBackgroundTask = () => {
  TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
    try {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      if (hours === 0 && minutes < 30) {
        const isComplete = await getIsCompleted();
        if (isComplete) {
          let onboardDay = await getOnboardDay();
          onboardDay++;
          await setOnboardDay(onboardDay);
          await setIsCompleted(false);
          scheduleNotification();
        }
      }

      return BackgroundFetch.BackgroundFetchResult.NewData;
    } catch (error) {
      console.error('Error in background fetch task:', error);
      return BackgroundFetch.BackgroundFetchResult.Failed;
    }
  });

  BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 15 * 60, // 15 minutes
    stopOnTerminate: false,
    startOnBoot: true,
  });
};

const scheduleNotification = () => {
  Notifications.scheduleNotificationAsync({
    content: {
      title: "Daily Challenge Update",
      body: "A new challenge is ready for you!",
      sound: 'default',
    },
    trigger: null, // Immediate trigger
  });
};

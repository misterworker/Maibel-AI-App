import { Stack } from "expo-router";
import { ThemeProvider } from '../context/ThemeContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ModalProvider } from '../context/ModalContext';
import { NotificationProvider } from "../context/NotificationContext";

export default function RootLayout() {
  return (
    <NotificationProvider>
    <ModalProvider>
    <GestureHandlerRootView style={{ flex: 1 }}>
    <ThemeProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboard" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
    </GestureHandlerRootView>
    </ModalProvider>
    </NotificationProvider>
  );
};

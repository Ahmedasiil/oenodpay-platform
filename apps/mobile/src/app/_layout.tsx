import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { colors } from '@/lib/theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="global" />
        <Stack.Screen name="bills" />
        <Stack.Screen name="travel" />
        <Stack.Screen name="esim" />
        <Stack.Screen name="security" />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="verify" />
      </Stack>
    </SafeAreaProvider>
  );
}

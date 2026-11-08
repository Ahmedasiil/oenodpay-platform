import { Tabs } from 'expo-router/js-tabs';
import { View, type ColorValue } from 'react-native';

import { colors } from '@/lib/theme';

function Dot({ color, focused }: { color: ColorValue; focused: boolean }) {
  return <View style={{ width: focused ? 20 : 6, height: 6, borderRadius: 3, backgroundColor: color }} />;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#7E89A6',
        tabBarStyle: { backgroundColor: colors.black, borderTopColor: '#141A2B' },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ color, focused }) => <Dot color={color} focused={focused} />,
      }}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="send" options={{ title: 'Send' }} />
      <Tabs.Screen name="card" options={{ title: 'Card' }} />
      <Tabs.Screen name="loans" options={{ title: 'Loans' }} />
      <Tabs.Screen name="invest" options={{ title: 'Invest' }} />
    </Tabs>
  );
}

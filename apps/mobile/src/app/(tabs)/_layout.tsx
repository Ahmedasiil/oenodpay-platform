import { Tabs } from 'expo-router/js-tabs';
import { View, type ColorValue } from 'react-native';

import { useT } from '@/lib/i18n';
import { colors } from '@/lib/theme';

function Dot({ color, focused }: { color: ColorValue; focused: boolean }) {
  return <View style={{ width: focused ? 20 : 6, height: 6, borderRadius: 3, backgroundColor: color }} />;
}

export default function TabsLayout() {
  const t = useT();
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
      <Tabs.Screen name="index" options={{ title: t('Home') }} />
      <Tabs.Screen name="send" options={{ title: t('Send') }} />
      <Tabs.Screen name="card" options={{ title: t('Card') }} />
      <Tabs.Screen name="loans" options={{ title: t('Loans') }} />
      <Tabs.Screen name="invest" options={{ title: t('Invest') }} />
    </Tabs>
  );
}

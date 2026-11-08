import { Tabs } from 'expo-router/js-tabs';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/ui';
import { useT } from '@/lib/i18n';
import { colors } from '@/lib/theme';

const ICON: Record<string, IconName> = { index: 'home', send: 'send', card: 'card', loans: 'coins', invest: 'chart' };

type BarProps = {
  state: { index: number; routes: { key: string; name: string }[] };
  descriptors: Record<string, { options: { title?: string } }>;
  navigation: { emit: (e: { type: 'tabPress'; target: string; canPreventDefault: true }) => { defaultPrevented: boolean }; navigate: (name: string) => void };
};

/** Floating pill tab bar: round icon buttons, the open tab in cream. */
function PillBar({ state, descriptors, navigation }: BarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View pointerEvents="box-none" style={{ position: 'absolute', left: 0, right: 0, bottom: Math.max(insets.bottom, 14), alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', gap: 8, padding: 7, borderRadius: 999, backgroundColor: 'rgba(44,44,49,0.92)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 20, shadowOffset: { width: 0, height: 10 } }}>
        {state.routes.map((r, i) => {
          const focused = state.index === i;
          return (
            <Pressable
              key={r.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={descriptors[r.key]?.options.title}
              onPress={() => {
                const e = navigation.emit({ type: 'tabPress', target: r.key, canPreventDefault: true });
                if (!focused && !e.defaultPrevented) navigation.navigate(r.name);
              }}
              style={{ width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', backgroundColor: focused ? colors.primary : '#3A3A41' }}>
              <Icon name={ICON[r.name] ?? 'home'} size={21} color={focused ? colors.onPrimary : colors.ink} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  const t = useT();
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(p) => <PillBar {...(p as unknown as BarProps)} />}>
      <Tabs.Screen name="index" options={{ title: t('Home') }} />
      <Tabs.Screen name="send" options={{ title: t('Send') }} />
      <Tabs.Screen name="card" options={{ title: t('Card') }} />
      <Tabs.Screen name="loans" options={{ title: t('Loans') }} />
      <Tabs.Screen name="invest" options={{ title: t('Invest') }} />
    </Tabs>
  );
}

import type { ReactNode } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View, type ImageSourcePropType, type TextInputProps, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { useT } from '@/lib/i18n';
import { colors, radius, space } from '@/lib/theme';

export function Screen({ title, back, children }: { title?: string; back?: boolean; children: ReactNode }) {
  const t = useT();
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {title ? (
          <View style={styles.header}>
            {back ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t('Back')}
                onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
                style={styles.iconButton}>
                <Image source={require('@/assets/ui/i-back.png')} style={{ width: 22, height: 22, tintColor: colors.ink }} />
              </Pressable>
            ) : null}
            <Text style={styles.title} accessibilityRole="header">
              {title}
            </Text>
          </View>
        ) : null}
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function Card({ children, dark, style }: { children: ReactNode; dark?: boolean; style?: ViewStyle }) {
  return <View style={[styles.card, dark && styles.cardDark, style]}>{children}</View>;
}

export function Heading({ children }: { children: ReactNode }) {
  return <Text style={styles.heading}>{children}</Text>;
}

export function Body({ children, muted, light }: { children: ReactNode; muted?: boolean; light?: boolean }) {
  return <Text style={[styles.body, muted && styles.muted, light && styles.light]}>{children}</Text>;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
}: {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'soft' | 'danger';
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.button, styles[`btn_${variant}`], (pressed || disabled) && styles.pressed]}>
      <Text style={[styles.buttonText, styles[`btnText_${variant}`]]}>{label}</Text>
    </Pressable>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
}) {
  return (
    <View style={styles.segmented} accessibilityRole="tablist">
      {options.map((o) => {
        const selected = o.id === value;
        return (
          <Pressable
            key={o.id}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onChange(o.id)}
            style={[styles.segment, selected && styles.segmentSelected]}>
            <Text style={[styles.segmentText, selected && styles.segmentTextSelected]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function ListRow({
  leading,
  title,
  subtitle,
  trailing,
  onPress,
}: {
  leading?: string;
  title: string;
  subtitle?: string;
  trailing?: ReactNode;
  onPress?: () => void;
}) {
  const content = (
    <View style={styles.row}>
      {leading ? (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{leading}</Text>
        </View>
      ) : null}
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
      </View>
      {typeof trailing === 'string' ? <Text style={styles.rowTrailing}>{trailing}</Text> : trailing}
    </View>
  );
  return onPress ? (
    <Pressable accessibilityRole="button" onPress={onPress}>
      {content}
    </Pressable>
  ) : (
    content
  );
}

export function Field({ label, ...props }: TextInputProps & { label: string }) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor="#6E6E76"
        style={styles.input}
        {...props}
      />
    </View>
  );
}

export function Chip({ label, selected, onPress }: { label: string; selected?: boolean; onPress?: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}>
      <Text style={styles.chipText}>{label}</Text>
    </Pressable>
  );
}

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: space.xl, gap: space.lg, paddingBottom: 120 },
  header: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  title: { fontSize: 28, fontWeight: '600', color: colors.ink, letterSpacing: -0.8 },
  iconButton: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center',
  },
  backGlyph: { fontSize: 28, lineHeight: 30, color: colors.ink },
  card: { backgroundColor: colors.surface, borderRadius: radius.xxl, padding: space.xl, gap: space.md },
  cardDark: { backgroundColor: colors.black },
  heading: { fontSize: 17, fontWeight: '500', color: colors.ink },
  body: { fontSize: 14, color: colors.ink, lineHeight: 20 },
  muted: { color: colors.muted },
  light: { color: '#B5B5BC' },
  button: { minHeight: 58, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', paddingHorizontal: space.lg },
  btn_primary: { backgroundColor: colors.primary },
  btn_secondary: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#4A4A52' },
  btn_soft: { backgroundColor: colors.primarySoft },
  btn_danger: { backgroundColor: colors.danger },
  buttonText: { fontSize: 16, fontWeight: '500' },
  btnText_primary: { color: colors.onPrimary },
  btnText_secondary: { color: colors.ink },
  btnText_soft: { color: colors.ink },
  btnText_danger: { color: '#FFFFFF' },
  pressed: { opacity: 0.7 },
  segmented: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.pill, padding: 5, gap: 4 },
  segment: { flex: 1, minHeight: 42, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  segmentSelected: { backgroundColor: colors.primary },
  segmentText: { fontSize: 13, fontWeight: '600', color: colors.muted },
  segmentTextSelected: { color: colors.onPrimary },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.md, minHeight: 44 },
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.surfaceHigh, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 13, fontWeight: '600', color: colors.ink },
  rowTitle: { fontSize: 15, fontWeight: '500', color: colors.ink },
  rowSubtitle: { fontSize: 12, color: colors.muted },
  rowTrailing: { fontSize: 15, fontWeight: '500', color: colors.ink },
  fieldLabel: { fontSize: 13, color: colors.muted },
  input: {
    minHeight: 52, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 16,
    fontSize: 15, backgroundColor: colors.background, color: colors.ink,
  },
  chip: {
    minHeight: 44, paddingHorizontal: 16, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center',
  },
  chipSelected: { borderColor: colors.primary, backgroundColor: colors.surfaceHigh },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.ink },
});

const ICONS = {
  home: require('@/assets/ui/i-home.png'), send: require('@/assets/ui/i-send.png'), receive: require('@/assets/ui/i-receive.png'),
  plus: require('@/assets/ui/i-plus.png'), card: require('@/assets/ui/i-card.png'), chart: require('@/assets/ui/i-chart.png'),
  user: require('@/assets/ui/i-user.png'), grid: require('@/assets/ui/i-grid.png'), bell: require('@/assets/ui/i-bell.png'),
  more: require('@/assets/ui/i-more.png'), bill: require('@/assets/ui/i-bill.png'), globe: require('@/assets/ui/i-globe.png'),
  plane: require('@/assets/ui/i-plane.png'), sim: require('@/assets/ui/i-sim.png'), coins: require('@/assets/ui/i-coins.png'),
  shield: require('@/assets/ui/i-shield.png'), gift: require('@/assets/ui/i-gift.png'), back: require('@/assets/ui/i-back.png'),
  swap: require('@/assets/ui/i-swap.png'), chat: require('@/assets/ui/i-chat.png'),
} satisfies Record<string, ImageSourcePropType>;
export type IconName = keyof typeof ICONS;

/** Line icon from the oenodPay set, tinted to any colour. */
export function Icon({ name, size = 22, color = colors.ink }: { name: IconName; size?: number; color?: string }) {
  return <Image source={ICONS[name]} style={{ width: size, height: size, tintColor: color }} accessibilityIgnoresInvertColors />;
}

/** Round icon button, like the reference's top-bar and transaction avatars. */
export function IconCircle({ name, size = 52, light, onPress, label }: { name: IconName; size?: number; light?: boolean; onPress?: () => void; label?: string }) {
  const body = (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: light ? colors.primary : colors.surfaceHigh, alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={name} size={size * 0.42} color={light ? colors.onPrimary : colors.ink} />
    </View>
  );
  return onPress ? <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress}>{body}</Pressable> : body;
}

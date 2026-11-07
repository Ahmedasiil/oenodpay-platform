import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, type TextInputProps, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { colors, radius, space } from '@/lib/theme';

export function Screen({ title, back, children }: { title?: string; back?: boolean; children: ReactNode }) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {title ? (
          <View style={styles.header}>
            {back ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Back"
                onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
                style={styles.iconButton}>
                <Text style={styles.backGlyph}>‹</Text>
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
        placeholderTextColor="#7F8BA6"
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
  scroll: { padding: space.xl, gap: space.lg, paddingBottom: 48 },
  header: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  title: { fontSize: 28, fontWeight: '800', color: colors.ink, letterSpacing: -0.6 },
  iconButton: {
    width: 44, height: 44, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center',
  },
  backGlyph: { fontSize: 28, lineHeight: 30, color: colors.ink },
  card: { backgroundColor: colors.surface, borderRadius: radius.xxl, borderWidth: 1, borderColor: colors.border, padding: space.lg, gap: space.md },
  cardDark: { backgroundColor: colors.black, borderColor: '#1F2A44' },
  heading: { fontSize: 17, fontWeight: '600', color: colors.ink },
  body: { fontSize: 14, color: colors.ink, lineHeight: 20 },
  muted: { color: colors.muted },
  light: { color: '#B9C0D4' },
  button: { minHeight: 54, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', paddingHorizontal: space.lg },
  btn_primary: { backgroundColor: colors.primary },
  btn_secondary: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.ink },
  btn_soft: { backgroundColor: colors.primarySoft },
  btn_danger: { backgroundColor: colors.danger },
  buttonText: { fontSize: 16, fontWeight: '600' },
  btnText_primary: { color: colors.onPrimary },
  btnText_secondary: { color: colors.ink },
  btnText_soft: { color: colors.ink },
  btnText_danger: { color: '#FFFFFF' },
  pressed: { opacity: 0.7 },
  segmented: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.md, padding: 4, gap: 4 },
  segment: { flex: 1, minHeight: 40, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  segmentSelected: { backgroundColor: colors.primary },
  segmentText: { fontSize: 13, fontWeight: '600', color: colors.muted },
  segmentTextSelected: { color: colors.onPrimary },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.md, minHeight: 44 },
  avatar: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 12, fontWeight: '700', color: colors.ink },
  rowTitle: { fontSize: 14, fontWeight: '600', color: colors.ink },
  rowSubtitle: { fontSize: 12, color: colors.muted },
  rowTrailing: { fontSize: 14, fontWeight: '600', color: colors.ink },
  fieldLabel: { fontSize: 13, color: colors.muted },
  input: {
    minHeight: 48, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14,
    fontSize: 15, backgroundColor: colors.background, color: colors.ink,
  },
  chip: {
    minHeight: 44, paddingHorizontal: 14, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center',
  },
  chipSelected: { borderWidth: 2, borderColor: colors.ink, backgroundColor: colors.primarySoft },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.ink },
});

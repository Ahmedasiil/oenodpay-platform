import { useState } from 'react';
import { router, type Href } from 'expo-router';
import { Image, Modal, Pressable, Text, View, useWindowDimensions } from 'react-native';
import { formatMoney } from '@oenodpay/shared';

import { Icon, IconCircle, Screen, type IconName } from '@/components/ui';
import { sampleActivity, sampleUser } from '@/lib/sample';
import { m, useT } from '@/lib/i18n';
import { colors, radius } from '@/lib/theme';

/** Everything else the app does, one tap away from the "more" button. */
const services: { label: string; icon: IconName; href: Href }[] = [
  { label: m('Global'), icon: 'globe', href: '/global' },
  { label: m('Pay bills'), icon: 'bill', href: '/bills' },
  { label: m('Travel'), icon: 'plane', href: '/travel' },
  { label: m('eSIM'), icon: 'sim', href: '/esim' },
  { label: m('Loans'), icon: 'coins', href: '/loans' },
  { label: m('Invest'), icon: 'chart', href: '/invest' },
  { label: m('Verify your identity'), icon: 'shield', href: '/verify' },
  { label: m('Create account or sign in'), icon: 'user', href: '/welcome' },
];

function Pill({ icon, label, onPress }: { icon: IconName; label: string; onPress?: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => ({ flex: 1, height: 64, borderRadius: radius.pill, backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', paddingLeft: 18, gap: 12, opacity: pressed ? 0.85 : 1 })}>
      <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: colors.onPrimary, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={14} color={colors.primary} />
      </View>
      <Text style={{ fontSize: 17, color: colors.onPrimary }}>{label}</Text>
    </Pressable>
  );
}

export default function Home() {
  const t = useT();
  const [more, setMore] = useState(false);
  const { width } = useWindowDimensions();
  const cardW = Math.min(width, 520) - 40 - 56; // leaves the next card peeking in on the right
  const cardH = cardW * (428 / 680);

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8 }}>
        <IconCircle name="grid" size={54} label={t('More')} onPress={() => setMore(true)} />
        <View>
          <IconCircle name="bell" size={54} label={t('Security center')} onPress={() => router.push('/security')} />
          <View style={{ position: 'absolute', top: 13, right: 14, width: 9, height: 9, borderRadius: 5, backgroundColor: '#FF5A4E' }} />
        </View>
      </View>

      <View style={{ alignItems: 'center', paddingTop: 36, paddingBottom: 20, gap: 4 }}>
        <Text style={{ fontSize: 16, color: colors.muted }}>{t('Your balance')}</Text>
        <Text style={{ fontSize: 54, fontWeight: '400', color: colors.ink, letterSpacing: -1.6 }} adjustsFontSizeToFit numberOfLines={1} accessibilityLabel={t('Wallet balance')}>
          {formatMoney({ minor: sampleUser.balanceMinor, currency: 'CAD' })}
        </Text>
      </View>

      {/* Cards: the main card with the next one peeking in, half covered by the frosted "Cards" strip. */}
      <View style={{ marginHorizontal: -20 }}>
        <View style={{ flexDirection: 'row', gap: 10, paddingLeft: 26, height: cardH * 0.55, overflow: 'hidden' }}>
          <Pressable accessibilityRole="button" accessibilityLabel={t('Visa debit card ending {last4}', { last4: '2049' })} onPress={() => router.push('/card')}>
            <Image source={require('@/assets/ui/card-silver.png')} style={{ width: cardW, height: cardH, borderRadius: 18 }} />
          </Pressable>
          <Image source={require('@/assets/ui/card-blue.png')} style={{ width: cardW, height: cardH, borderRadius: 18 }} />
        </View>
        <View style={{ backgroundColor: 'rgba(120,120,124,0.38)', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.10)', paddingVertical: 18, paddingHorizontal: 26, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 16, color: colors.ink, opacity: 0.85 }}>{t('Cards')}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Pressable accessibilityRole="button" accessibilityLabel={t('Card')} onPress={() => router.push('/card')} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.22)', alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.75)', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="plus" size={13} color="#6B6B70" />
              </View>
            </Pressable>
            <View>
              <Image source={require('@/assets/ui/card-silver.png')} style={{ width: 64, height: 44, borderRadius: 4 }} resizeMode="cover" />
              <Text style={{ position: 'absolute', left: 5, bottom: 3, fontSize: 9, color: '#2A2A2E' }}>2049</Text>
            </View>
            <View>
              <Image source={require('@/assets/ui/card-blue.png')} style={{ width: 64, height: 44, borderRadius: 4 }} resizeMode="cover" />
              <Text style={{ position: 'absolute', left: 5, bottom: 3, fontSize: 9, color: '#FFFFFF' }}>7731</Text>
            </View>
          </View>
        </View>
        <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.06)' }} />
      </View>

      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', paddingTop: 10 }}>
        <Pill icon="plus" label={t('Add')} />
        <Pill icon="send" label={t('Send')} onPress={() => router.push('/send')} />
        <Pressable accessibilityRole="button" accessibilityLabel={t('More')} onPress={() => setMore(true)} style={{ width: 64, height: 64, borderRadius: 32, borderWidth: 1, borderColor: '#3A3A3E', alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#8A8A8F', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="more" size={16} color={colors.background} />
          </View>
        </Pressable>
      </View>

      <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginHorizontal: -20, marginTop: 6 }} />

      <Text style={{ fontSize: 16, color: colors.muted, paddingTop: 4 }}>{t('Transactions')}</Text>
      <View style={{ gap: 14 }}>
        {sampleActivity.map((a) => {
          const incoming = a.amountMinor > 0;
          const [kind, when] = t(a.meta).split(' · ');
          return (
            <View key={a.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              <IconCircle name={incoming ? 'receive' : a.id === '2' ? 'bill' : 'send'} size={60} />
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={{ fontSize: 17, color: colors.ink }}>{t(a.name)}</Text>
                <Text style={{ fontSize: 14, color: colors.muted }}>{when ?? kind}</Text>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 4 }}>
                <Text style={{ fontSize: 17, color: colors.ink }}>
                  {incoming ? '+' : '-'}{formatMoney({ minor: Math.abs(a.amountMinor), currency: 'CAD' })}
                </Text>
                <Text style={{ fontSize: 14, color: colors.muted }}>{when ? kind : ''}</Text>
              </View>
            </View>
          );
        })}
      </View>

      <Modal visible={more} transparent animationType="fade" onRequestClose={() => setMore(false)}>
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' }} onPress={() => setMore(false)}>
          <Pressable style={{ backgroundColor: colors.surface, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 44, gap: 18, width: '100%', maxWidth: 560, alignSelf: 'center' }}>
            <View style={{ alignSelf: 'center', width: 40, height: 5, borderRadius: 3, backgroundColor: '#4A4A4E' }} />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', rowGap: 20 }}>
              {services.map((s) => (
                <Pressable key={s.label} accessibilityRole="button" onPress={() => { setMore(false); router.push(s.href); }} style={{ width: '25%', alignItems: 'center', gap: 8 }}>
                  <IconCircle name={s.icon} size={56} />
                  <Text style={{ fontSize: 12, color: colors.ink, textAlign: 'center' }} numberOfLines={2}>{t(s.label)}</Text>
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </Screen>
  );
}

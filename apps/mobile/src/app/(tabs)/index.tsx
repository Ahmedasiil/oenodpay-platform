import { useEffect, useState } from 'react';
import { Link, router, type Href } from 'expo-router';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { formatMoney } from '@oenodpay/shared';

import { Body, Button, Card, Heading, Icon, IconCircle, Screen, type IconName } from '@/components/ui';
import { api, hasSession } from '@/lib/api';
import { sampleActivity, sampleUser } from '@/lib/sample';
import { m, useT } from '@/lib/i18n';
import { colors, radius } from '@/lib/theme';

const services: { label: string; icon: IconName; href: Href }[] = [
  { label: m('Global'), icon: 'globe', href: '/global' },
  { label: m('Pay bills'), icon: 'bill', href: '/bills' },
  { label: m('Travel'), icon: 'plane', href: '/travel' },
  { label: m('eSIM'), icon: 'sim', href: '/esim' },
  { label: m('Loans'), icon: 'coins', href: '/loans' },
  { label: m('Invest'), icon: 'chart', href: '/invest' },
];

type Account = 'guest' | 'unverified' | 'verified';

/** Nudges the person to the next step: create an account, then verify their identity. */
function NextStep({ account }: { account: Account }) {
  const t = useT();
  if (account === 'verified') return null;
  const guest = account === 'guest';
  return (
    <Card>
      <Heading>{guest ? t('Open your oenodPay account') : t('Verify your identity')}</Heading>
      <Body muted>
        {guest
          ? t('You’re exploring a demo with sample money. Create an account in under a minute.')
          : t('One quick ID check and you can send money, pay bills and get your card.')}
      </Body>
      <Button label={guest ? t('Create account or sign in') : t('Verify now · 2 min')} onPress={() => router.push(guest ? '/welcome' : '/verify')} />
    </Card>
  );
}

function Pill({ icon, label, onPress }: { icon: IconName; label: string; onPress?: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => ({ flex: 1, minHeight: 60, borderRadius: radius.pill, backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, gap: 10, opacity: pressed ? 0.8 : 1 })}>
      <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.onPrimary, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={18} color={colors.primary} />
      </View>
      <Text style={{ fontSize: 16, fontWeight: '500', color: colors.onPrimary }}>{label}</Text>
    </Pressable>
  );
}

export default function Home() {
  const t = useT();
  const [account, setAccount] = useState<Account>('guest');
  useEffect(() => {
    void (async () => {
      if (!(await hasSession())) return;
      const me = await api<{ user: { kycStatus: string } }>('/v1/me').catch(() => null);
      if (me) setAccount(me.user.kycStatus === 'verified' ? 'verified' : 'unverified');
    })();
  }, []);

  const balance = formatMoney({ minor: sampleUser.balanceMinor, currency: 'CAD' });

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <IconCircle name="grid" label={t('Security center')} onPress={() => router.push('/security')} />
        <Image source={require('@/assets/brand/oenodpay-logo-white-2000.png')} accessibilityLabel="OENODPAY" style={{ width: 123, height: 20 }} resizeMode="contain" />
        <View>
          <IconCircle name="bell" label={t('Security center')} onPress={() => router.push('/security')} />
          <View style={{ position: 'absolute', top: 12, right: 13, width: 9, height: 9, borderRadius: 5, backgroundColor: '#FF5A4E', borderWidth: 2, borderColor: colors.surfaceHigh }} />
        </View>
      </View>

      <View style={{ alignItems: 'center', paddingTop: 28, paddingBottom: 8, gap: 6 }}>
        <Text style={{ fontSize: 15, color: colors.muted }}>{t('Your balance')}</Text>
        <Text style={{ fontSize: 50, fontWeight: '400', color: colors.ink, letterSpacing: -1.5 }} adjustsFontSizeToFit numberOfLines={1} accessibilityLabel={t('Wallet balance')}>
          {balance}
        </Text>
      </View>

      <View style={{ marginHorizontal: -20 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} snapToInterval={292} decelerationRate="fast" contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}>
          <Link href="/card" asChild>
            <Pressable accessibilityRole="button" accessibilityLabel={t('Visa debit card ending {last4}', { last4: '2049' })}>
              <Image source={require('@/assets/ui/card-silver.png')} style={{ width: 280, height: 176, borderRadius: 22 }} />
            </Pressable>
          </Link>
          <Image source={require('@/assets/ui/card-blue.png')} style={{ width: 280, height: 176, borderRadius: 22 }} accessibilityLabel={t('Cards')} />
        </ScrollView>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.surface, borderRadius: radius.pill, paddingVertical: 8, paddingLeft: 20, paddingRight: 8 }}>
        <Text style={{ fontSize: 15, color: colors.muted }}>{t('Cards')}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <IconCircle name="plus" size={40} onPress={() => router.push('/card')} label={t('Card')} />
          <Image source={require('@/assets/ui/card-silver.png')} style={{ width: 62, height: 39, borderRadius: 7 }} />
          <Image source={require('@/assets/ui/card-blue.png')} style={{ width: 62, height: 39, borderRadius: 7 }} />
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
        <Pill icon="plus" label={t('Add')} />
        <Pill icon="send" label={t('Send')} onPress={() => router.push('/send')} />
        <IconCircle name="more" size={60} label={t('More')} onPress={() => router.push('/global')} />
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', rowGap: 16, paddingTop: 4 }}>
        {services.map((s) => (
          <Link key={s.label} href={s.href} asChild>
            <Pressable accessibilityRole="button" style={{ width: '33.33%', alignItems: 'center', gap: 8 }}>
              <IconCircle name={s.icon} size={56} />
              <Text style={{ fontSize: 13, color: colors.ink }}>{t(s.label)}</Text>
            </Pressable>
          </Link>
        ))}
      </View>

      <NextStep account={account} />

      <Text style={{ fontSize: 15, color: colors.muted, paddingTop: 4 }}>{t('Transactions')}</Text>
      <View style={{ gap: 18 }}>
        {sampleActivity.map((a) => {
          const incoming = a.amountMinor > 0;
          const [kind, when] = t(a.meta).split(' · ');
          return (
            <View key={a.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <IconCircle name={incoming ? 'receive' : a.id === '2' ? 'bill' : 'send'} size={54} />
              <View style={{ flex: 1, gap: 3 }}>
                <Text style={{ fontSize: 16, color: colors.ink }}>{t(a.name)}</Text>
                <Text style={{ fontSize: 13, color: colors.muted }}>{when ?? kind}</Text>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 3 }}>
                <Text style={{ fontSize: 16, color: incoming ? colors.positive : colors.ink }}>
                  {incoming ? '+' : ''}{formatMoney({ minor: a.amountMinor, currency: 'CAD' })}
                </Text>
                <Text style={{ fontSize: 13, color: colors.muted }}>{when ? kind : ''}</Text>
              </View>
            </View>
          );
        })}
      </View>

      <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <IconCircle name="gift" size={48} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, color: colors.ink }}>{t('{points} points', { points: sampleUser.points.toLocaleString('en-CA') })}</Text>
          <Text style={{ fontSize: 13, color: colors.muted }}>{t('Redeem for flights, hotels or eSIM data')}</Text>
        </View>
        <Pressable accessibilityRole="button" onPress={() => router.push('/travel')} style={{ paddingHorizontal: 16, minHeight: 40, borderRadius: 20, backgroundColor: colors.primary, justifyContent: 'center' }}>
          <Text style={{ color: colors.onPrimary, fontWeight: '500' }}>{t('Redeem')}</Text>
        </Pressable>
      </Card>
    </Screen>
  );
}

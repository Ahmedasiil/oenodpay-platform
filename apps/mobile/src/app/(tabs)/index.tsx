import { useEffect, useState } from 'react';
import { Link, router, type Href } from 'expo-router';
import { Image, Pressable, Text, View } from 'react-native';
import { formatMoney } from '@oenodpay/shared';

import { Body, Button, Card, Heading, ListRow, Screen } from '@/components/ui';
import { api, hasSession } from '@/lib/api';
import { sampleActivity, sampleUser } from '@/lib/sample';
import { m, useT } from '@/lib/i18n';
import { colors, radius } from '@/lib/theme';

const actions: { label: string; short: string; href: Href }[] = [
  { label: m('Send'), short: 'SE', href: '/send' },
  { label: m('Pay bills'), short: 'BI', href: '/bills' },
  { label: m('Global'), short: 'GL', href: '/global' },
  { label: m('Card'), short: 'CA', href: '/card' },
  { label: m('Travel'), short: 'TR', href: '/travel' },
  { label: m('eSIM'), short: 'ES', href: '/esim' },
  { label: m('Loans'), short: 'LO', href: '/loans' },
  { label: m('Invest'), short: 'IN', href: '/invest' },
];

type Account = 'guest' | 'unverified' | 'verified';

/** Nudges the person to the next step: create an account, then verify their identity. */
function NextStep({ account }: { account: Account }) {
  const t = useT();
  if (account === 'verified') return null;
  const guest = account === 'guest';
  return (
    <Card style={{ borderColor: colors.ink, borderWidth: 1.5 }}>
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

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Image
          source={require('@/assets/brand/oenodpay-logo-2000.png')}
          accessibilityLabel="OENODPAY"
          style={{ width: 148, height: 20 }}
          resizeMode="contain"
        />
        <Link href="/security" asChild>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('Security center')}
            style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFFFFF' }}>{sampleUser.firstName.slice(0, 2).toUpperCase()}</Text>
          </Pressable>
        </Link>
      </View>

      <View style={{ backgroundColor: colors.navy, borderRadius: radius.hero, padding: 24, gap: 6, overflow: 'hidden' }}>
        <View pointerEvents="none" style={{ position: 'absolute', width: 260, height: 260, borderRadius: 130, backgroundColor: colors.accent, opacity: 0.35, top: -140, right: -90 }} />
        <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '55%', backgroundColor: colors.black, opacity: 0.45 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: '#AFC2FF', fontSize: 14, fontWeight: '600' }}>{t('Total balance · CAD')}</Text>
          <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '700' }}>{t('Hi {name}', { name: sampleUser.firstName })}</Text>
        </View>
        <Text
          style={{ color: '#FFFFFF', fontSize: 50, fontWeight: '800', letterSpacing: -2 }}
          adjustsFontSizeToFit
          numberOfLines={1}
          accessibilityLabel={t('Wallet balance')}>
          {formatMoney({ minor: sampleUser.balanceMinor, currency: 'CAD' })}
        </Text>
        <View style={{ flexDirection: 'row', gap: 10, paddingTop: 8 }}>
          <Pressable accessibilityRole="button" style={{ flex: 1, minHeight: 50, borderRadius: 999, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: colors.navy, fontSize: 15, fontWeight: '700' }}>{t('Add money')}</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={() => router.push('/send')} style={{ flex: 1, minHeight: 50, borderRadius: 999, backgroundColor: colors.black, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '700' }}>{t('Send')}</Text>
          </Pressable>
        </View>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -5 }}>
        {actions.map((a) => (
          <Link key={a.label} href={a.href} asChild>
            <Pressable accessibilityRole="button" style={{ width: '25%', padding: 5 }}>
              <View style={{ height: 88, borderRadius: 22, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <View style={{ width: 34, height: 34, borderRadius: 11, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 11, fontWeight: '800', color: colors.accent, letterSpacing: 0.5 }}>{a.short}</Text>
                </View>
                <Text style={{ fontSize: 12, fontWeight: '600', color: colors.ink }}>{t(a.label)}</Text>
              </View>
            </Pressable>
          </Link>
        ))}
      </View>

      <Link href="/card" asChild>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('Visa debit card ending {last4}', { last4: '2049' })}
          style={{ height: 150, borderRadius: radius.xxl, backgroundColor: colors.black, borderWidth: 1, borderColor: '#1F2A44', padding: 22, justifyContent: 'space-between', overflow: 'hidden' }}>
          <View pointerEvents="none" style={{ position: 'absolute', width: 220, height: 220, borderRadius: 110, backgroundColor: colors.accent, opacity: 0.3, top: -120, right: -60 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Image source={require('@/assets/brand/oenodpay-logo-white-2000.png')} style={{ width: 111, height: 15 }} resizeMode="contain" />
            <Text style={{ color: '#B9C0D4', fontSize: 11, fontWeight: '700', letterSpacing: 2 }}>{t('DEBIT')}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <Text style={{ color: '#FFFFFF', fontSize: 16, letterSpacing: 3 }}>•••• 2049</Text>
            <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: '800', fontStyle: 'italic' }}>VISA</Text>
          </View>
        </Pressable>
      </Link>

      <NextStep account={account} />

      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13, color: colors.muted }}>{t('Rewards')}</Text>
            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.ink }}>{t('{points} points', { points: sampleUser.points.toLocaleString('en-CA') })}</Text>
            <Text style={{ fontSize: 12, color: colors.muted }}>{t('Redeem for flights, hotels or eSIM data')}</Text>
          </View>
          <Button label={t('Redeem')} variant="soft" onPress={() => router.push('/travel')} />
        </View>
      </Card>

      <Heading>{t('Recent activity')}</Heading>
      <Card>
        {sampleActivity.map((a) => (
          <ListRow
            key={a.id}
            leading={a.initials}
            title={t(a.name)}
            subtitle={t(a.meta)}
            trailing={
              <Text style={{ fontSize: 14, fontWeight: '600', color: a.amountMinor > 0 ? colors.positive : colors.ink }}>
                {a.amountMinor > 0 ? '+' : ''}
                {formatMoney({ minor: a.amountMinor, currency: 'CAD' })}
              </Text>
            }
          />
        ))}
      </Card>
    </Screen>
  );
}

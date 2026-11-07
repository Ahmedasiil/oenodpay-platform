import { useEffect, useState } from 'react';
import { Link, router, type Href } from 'expo-router';
import { Image, Pressable, Text, View } from 'react-native';
import { formatMoney } from '@oenodpay/shared';

import { Body, Button, Card, Heading, ListRow, Screen, styles as ui } from '@/components/ui';
import { api, hasSession } from '@/lib/api';
import { sampleActivity, sampleUser } from '@/lib/sample';
import { colors } from '@/lib/theme';

const actions: { label: string; short: string; href: Href }[] = [
  { label: 'Send', short: 'SE', href: '/send' },
  { label: 'Pay bills', short: 'BI', href: '/bills' },
  { label: 'Global', short: 'GL', href: '/global' },
  { label: 'Card', short: 'CA', href: '/card' },
  { label: 'Travel', short: 'TR', href: '/travel' },
  { label: 'eSIM', short: 'ES', href: '/esim' },
  { label: 'Loans', short: 'LO', href: '/loans' },
  { label: 'Invest', short: 'IN', href: '/invest' },
];

type Account = 'guest' | 'unverified' | 'verified';

/** Nudges the person to the next step: create an account, then verify their identity. */
function NextStep({ account }: { account: Account }) {
  if (account === 'verified') return null;
  const guest = account === 'guest';
  return (
    <Card style={{ borderColor: colors.primary, borderWidth: 1.5 }}>
      <Heading>{guest ? 'Open your oenodPay account' : 'Verify your identity'}</Heading>
      <Body muted>
        {guest
          ? 'You’re exploring a demo with sample money. Create an account in under a minute.'
          : 'One quick ID check and you can send money, pay bills and get your card.'}
      </Body>
      <Button label={guest ? 'Create account or sign in' : 'Verify now · 2 min'} onPress={() => router.push(guest ? '/welcome' : '/verify')} />
    </Card>
  );
}

export default function Home() {
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
        <View style={{ gap: 6 }}>
          <Image
            source={require('@/assets/brand/oenodpay-logo-1600.png')}
            accessibilityLabel="OENODPAY"
            style={{ width: 160, height: 16 }}
            resizeMode="contain"
          />
          <Text style={{ fontSize: 13, color: colors.muted }}>Good evening</Text>
          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.ink }}>{sampleUser.firstName}</Text>
        </View>
        <Link href="/security" asChild>
          <Pressable accessibilityRole="button" accessibilityLabel="Security center" style={ui.iconButton}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: colors.positive }}>SAFE</Text>
          </Pressable>
        </Link>
      </View>

      <Card dark>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: '#B9C0D4', fontSize: 13 }}>oenodPay wallet · CAD</Text>
          <Text style={{ backgroundColor: colors.mint, color: colors.ink, fontSize: 12, fontWeight: '600', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999, overflow: 'hidden' }}>
            Verified
          </Text>
        </View>
        <Text style={{ color: '#FFFFFF', fontSize: 40, fontWeight: '700', letterSpacing: -0.5 }} accessibilityLabel="Wallet balance">
          {formatMoney({ minor: sampleUser.balanceMinor, currency: 'CAD' })}
        </Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}><Button label="Add money" /></View>
          <View style={{ flex: 1 }}><Button label="Send" variant="soft" onPress={() => router.push('/send')} /></View>
        </View>
      </Card>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', rowGap: 14 }}>
        {actions.map((a) => (
          <Link key={a.label} href={a.href} asChild>
            <Pressable accessibilityRole="button" style={{ width: '25%', alignItems: 'center', gap: 6 }}>
              <View style={{ width: 56, height: 56, borderRadius: 18, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: colors.primary }}>{a.short}</Text>
              </View>
              <Text style={{ fontSize: 12, fontWeight: '500', color: colors.ink }}>{a.label}</Text>
            </Pressable>
          </Link>
        ))}
      </View>

      <NextStep account={account} />

      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13, color: colors.muted }}>Rewards</Text>
            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.ink }}>{sampleUser.points.toLocaleString('en-CA')} points</Text>
            <Text style={{ fontSize: 12, color: colors.muted }}>Redeem for flights, hotels or eSIM data</Text>
          </View>
          <Button label="Redeem" variant="soft" onPress={() => router.push('/travel')} />
        </View>
      </Card>

      <Heading>Recent activity</Heading>
      <Card>
        {sampleActivity.map((t) => (
          <ListRow
            key={t.id}
            leading={t.initials}
            title={t.name}
            subtitle={t.meta}
            trailing={
              <Text style={{ fontSize: 14, fontWeight: '600', color: t.amountMinor > 0 ? colors.positive : colors.ink }}>
                {t.amountMinor > 0 ? '+' : ''}
                {formatMoney({ minor: t.amountMinor, currency: 'CAD' })}
              </Text>
            }
          />
        ))}
      </Card>
    </Screen>
  );
}

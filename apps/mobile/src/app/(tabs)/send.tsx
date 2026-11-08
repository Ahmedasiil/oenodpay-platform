import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';

import { Body, Button, Card, Field, Screen, Segmented } from '@/components/ui';
import { sampleContacts } from '@/lib/sample';
import { useT } from '@/lib/i18n';
import { colors } from '@/lib/theme';

type Tab = 'wallet' | 'bank' | 'abroad';

export default function Send() {
  const t = useT();
  const [tab, setTab] = useState<Tab>('wallet');
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('50.00');

  return (
    <Screen title={t('Send money')}>
      <Segmented<Tab>
        options={[{ id: 'wallet', label: 'oenodPay' }, { id: 'bank', label: t('To a bank') }, { id: 'abroad', label: t('Abroad') }]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'wallet' ? (
        <>
          <Field label={t('To')} placeholder={t('Name, @handle, phone or email')} value={to} onChangeText={setTo} autoCapitalize="none" />
          <View style={{ flexDirection: 'row', gap: 16 }}>
            {sampleContacts.map((c) => (
              <Pressable key={c.handle} accessibilityRole="button" accessibilityLabel={t('Send to {name}', { name: c.name })} onPress={() => setTo(`@${c.handle}`)} style={{ alignItems: 'center', gap: 6 }}>
                <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: c.color, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>{c.initials}</Text>
                </View>
                <Text style={{ fontSize: 12, color: colors.ink }}>{c.name}</Text>
              </Pressable>
            ))}
          </View>
          <Field label={t('Amount (CAD)')} keyboardType="decimal-pad" value={amount} onChangeText={setAmount} />
          <Text style={{ fontSize: 12, fontWeight: '600', color: colors.positive }}>{t('Free · arrives instantly')}</Text>
          <Button label={t('Confirm with Face ID')} disabled={!to} />
        </>
      ) : null}

      {tab === 'bank' ? (
        <>
          <Body muted>{t('Send from your wallet to any Canadian bank account.')}</Body>
          <Card><Text style={{ fontWeight: '600', fontSize: 15 }}>Interac e-Transfer</Text><Body muted>{t('To an email or mobile number · usually within minutes')}</Body></Card>
          <Card><Text style={{ fontWeight: '600', fontSize: 15 }}>{t('Bank transfer (EFT)')}</Text><Body muted>{t('Transit, institution and account number · 1 to 2 business days')}</Body></Card>
        </>
      ) : null}

      {tab === 'abroad' ? (
        <>
          <Body muted>{t('Choose a country to see how money can be received there, the fee and the rate before you send.')}</Body>
          <Button label={t('Choose a country')} onPress={() => router.push('/global')} />
        </>
      ) : null}
    </Screen>
  );
}

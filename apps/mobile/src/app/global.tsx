import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { CORRIDORS, formatMoney, quoteTransfer } from '@oenodpay/shared';

import { Button, Card, Chip, Heading, Screen } from '@/components/ui';
import { colors } from '@/lib/theme';

const AMOUNTS = [10_000, 25_000, 50_000, 100_000];

export default function Global() {
  const [countryCode, setCountryCode] = useState('PH');
  const corridor = CORRIDORS.find((c) => c.countryCode === countryCode) ?? CORRIDORS[0]!;
  const [methodId, setMethodId] = useState(corridor.methods[0]!.id);
  const [amountMinor, setAmountMinor] = useState(50_000);

  const method = corridor.methods.find((m) => m.id === methodId) ?? corridor.methods[0]!;
  const quote = useMemo(() => quoteTransfer(corridor.countryCode, method.id, amountMinor), [corridor, method, amountMinor]);

  return (
    <Screen title="Send abroad" back>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {CORRIDORS.map((c) => (
          <Chip
            key={c.countryCode}
            label={c.countryName}
            selected={c.countryCode === corridor.countryCode}
            onPress={() => {
              setCountryCode(c.countryCode);
              setMethodId(c.methods[0]!.id);
            }}
          />
        ))}
      </View>

      <Heading>How they receive it in {corridor.countryName}</Heading>
      {corridor.methods.map((m) => {
        const selected = m.id === method.id;
        return (
          <Pressable
            key={m.id}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            onPress={() => setMethodId(m.id)}
            style={{
              backgroundColor: colors.surface, borderRadius: 16, padding: 14, flexDirection: 'row', justifyContent: 'space-between',
              alignItems: 'center', borderWidth: selected ? 2 : 1, borderColor: selected ? colors.primary : colors.border,
            }}>
            <View style={{ gap: 2 }}>
              <Text style={{ fontSize: 15, fontWeight: '600', color: colors.ink }}>{m.name}</Text>
              <Text style={{ fontSize: 12, color: colors.muted }}>{m.eta}</Text>
            </View>
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.muted }}>Fee {formatMoney({ minor: m.feeMinor, currency: 'CAD' })}</Text>
          </Pressable>
        );
      })}

      <Heading>You send</Heading>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {AMOUNTS.map((a) => (
          <View key={a} style={{ flex: 1 }}>
            <Chip label={formatMoney({ minor: a, currency: 'CAD' }).replace('.00', '')} selected={a === amountMinor} onPress={() => setAmountMinor(a)} />
          </View>
        ))}
      </View>

      <Card dark>
        <QuoteLine label="You send" value={formatMoney(quote.send)} />
        <QuoteLine label="Fee" value={formatMoney(quote.fee)} />
        <QuoteLine label="Rate" value={`1 CAD = ${quote.rate} ${quote.receive.currency}`} />
        <View style={{ height: 1, backgroundColor: '#1F2A44' }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Text style={{ color: '#B9C0D4', fontSize: 14 }}>They receive</Text>
          <Text style={{ color: colors.mint, fontSize: 22, fontWeight: '700' }}>{formatMoney(quote.receive)}</Text>
        </View>
        <Text style={{ color: '#B9C0D4', fontSize: 12 }}>Arrives: {quote.eta.toLowerCase()} · sample rates</Text>
      </Card>
      <Button label="Continue" />
    </Screen>
  );
}

function QuoteLine({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Text style={{ color: '#B9C0D4', fontSize: 14 }}>{label}</Text>
      <Text style={{ color: '#FFFFFF', fontSize: 14 }}>{value}</Text>
    </View>
  );
}

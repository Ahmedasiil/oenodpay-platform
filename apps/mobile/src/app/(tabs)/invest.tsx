import { Text, View } from 'react-native';
import { formatMoney } from '@oenodpay/shared';

import { Body, Button, Card, Heading, ListRow, Screen } from '@/components/ui';
import { sampleHoldings } from '@/lib/sample';
import { colors } from '@/lib/theme';

export default function Invest() {
  const total = sampleHoldings.reduce((sum, h) => sum + h.valueMinor, 0);
  return (
    <Screen title="Invest">
      <Card>
        <Text style={{ fontSize: 13, color: colors.muted }}>Portfolio value</Text>
        <Text style={{ fontSize: 34, fontWeight: '700', color: colors.ink }}>{formatMoney({ minor: total, currency: 'CAD' })}</Text>
        <Text style={{ fontSize: 13, fontWeight: '600', color: colors.positive }}>+$412.30 (5.3%) this year</Text>
      </Card>
      <Heading>Holdings</Heading>
      <Card>
        {sampleHoldings.map((h) => (
          <ListRow key={h.code} leading={h.code} title={h.name} subtitle={h.meta} trailing={formatMoney({ minor: h.valueMinor, currency: 'CAD' })} />
        ))}
      </Card>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={{ flex: 1 }}><Button label="Buy" /></View>
        <View style={{ flex: 1 }}><Button label="Sell" variant="secondary" /></View>
      </View>
      <Body muted>Sample portfolio. Trading will be offered through a CIRO-registered dealer partner.</Body>
    </Screen>
  );
}

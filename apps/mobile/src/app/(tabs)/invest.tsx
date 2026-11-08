import { Text, View } from 'react-native';
import { formatMoney } from '@oenodpay/shared';

import { Body, Button, Card, Heading, ListRow, Screen } from '@/components/ui';
import { sampleHoldings } from '@/lib/sample';
import { useT } from '@/lib/i18n';
import { colors } from '@/lib/theme';

export default function Invest() {
  const t = useT();
  const total = sampleHoldings.reduce((sum, h) => sum + h.valueMinor, 0);
  return (
    <Screen title={t('Invest')}>
      <Card>
        <Text style={{ fontSize: 13, color: colors.muted }}>{t('Portfolio value')}</Text>
        <Text style={{ fontSize: 34, fontWeight: '700', color: colors.ink }}>{formatMoney({ minor: total, currency: 'CAD' })}</Text>
        <Text style={{ fontSize: 13, fontWeight: '600', color: colors.positive }}>{t('{change} this year', { change: '+$412.30 (5.3%)' })}</Text>
      </Card>
      <Heading>{t('Holdings')}</Heading>
      <Card>
        {sampleHoldings.map((h) => (
          <ListRow key={h.code} leading={h.code} title={t(h.name)} subtitle={t('{n} shares', { n: h.shares })} trailing={formatMoney({ minor: h.valueMinor, currency: 'CAD' })} />
        ))}
      </Card>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={{ flex: 1 }}><Button label={t('Buy')} /></View>
        <View style={{ flex: 1 }}><Button label={t('Sell')} variant="secondary" /></View>
      </View>
      <Body muted>{t('Sample portfolio. Trading will be offered through a CIRO-registered dealer partner.')}</Body>
    </Screen>
  );
}

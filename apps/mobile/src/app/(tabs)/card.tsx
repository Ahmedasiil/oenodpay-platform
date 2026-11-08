import { useState } from 'react';
import { Image, Text, View, useWindowDimensions } from 'react-native';

import { Body, Button, Card, Screen } from '@/components/ui';
import { useT } from '@/lib/i18n';
import { colors } from '@/lib/theme';

export default function CardScreen() {
  const t = useT();
  const [frozen, setFrozen] = useState(false);
  const cw = Math.min(useWindowDimensions().width, 560) - 40;
  return (
    <Screen title={t('Your card')}>
      <View accessibilityLabel={frozen ? t('Debit card, frozen') : t('Debit card, active')} style={{ opacity: frozen ? 0.4 : 1 }}>
        <Image source={require('@/assets/ui/card-silver.png')} style={{ width: cw, height: cw * (428 / 680), borderRadius: 26 }} resizeMode="cover" />
        <Text style={{ position: 'absolute', left: 24, top: '58%', color: '#2A2A2E', fontSize: 12, fontWeight: '600', letterSpacing: 1 }}>AHMED ASIL · 09/30</Text>
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={{ flex: 1 }}><Button label={frozen ? t('Unfreeze') : t('Freeze card')} variant="secondary" onPress={() => setFrozen(!frozen)} /></View>
        <View style={{ flex: 1 }}><Button label={t('Show details')} variant="secondary" /></View>
      </View>
      <Card>
        <Text style={{ fontWeight: '600', fontSize: 14, color: colors.ink }}>
          {frozen ? t('Card frozen: no purchases or withdrawals until you unfreeze it') : t('Card active: purchases and ATM withdrawals allowed')}
        </Text>
        <Body muted>{t('Spent this month: {spent} of {limit}', { spent: '$642.18', limit: '$3,000' })}</Body>
        <Body muted>{t('Cashback earned: +{points} points', { points: 320 })}</Body>
      </Card>
      <Button label={t('Add to Apple Pay or Google Pay')} />
      <Body muted>{t('Card numbers are shown by the card partner’s secure view and never stored on oenodPay servers.')}</Body>
    </Screen>
  );
}

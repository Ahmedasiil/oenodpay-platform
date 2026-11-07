import { useState } from 'react';
import { Image, Text, View } from 'react-native';

import { Body, Button, Card, Screen } from '@/components/ui';
import { colors } from '@/lib/theme';

export default function CardScreen() {
  const [frozen, setFrozen] = useState(false);
  return (
    <Screen title="Your card">
      <View
        accessibilityLabel={frozen ? 'Debit card, frozen' : 'Debit card, active'}
        style={{ height: 210, borderRadius: 26, backgroundColor: colors.black, borderWidth: 1, borderColor: '#1F2A44', padding: 22, justifyContent: 'space-between', opacity: frozen ? 0.45 : 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Image source={require('@/assets/brand/oenodpay-logo-white-2000.png')} accessibilityLabel="OENODPAY" style={{ width: 114, height: 24 }} resizeMode="contain" />
          <Text style={{ color: '#B9C0D4', fontSize: 12 }}>Debit</Text>
        </View>
        <View style={{ width: 44, height: 32, borderRadius: 6, backgroundColor: '#C9CEDC' }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <View>
            <Text style={{ color: '#FFFFFF', fontSize: 16, letterSpacing: 2 }}>•••• •••• •••• 2049</Text>
            <Text style={{ color: '#B9C0D4', fontSize: 12 }}>AHMED ASIL · 09/30</Text>
          </View>
          <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '800', fontStyle: 'italic' }}>VISA</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={{ flex: 1 }}><Button label={frozen ? 'Unfreeze' : 'Freeze card'} variant="secondary" onPress={() => setFrozen(!frozen)} /></View>
        <View style={{ flex: 1 }}><Button label="Show details" variant="secondary" /></View>
      </View>
      <Card>
        <Text style={{ fontWeight: '600', fontSize: 14, color: colors.ink }}>
          {frozen ? 'Card frozen: no purchases or withdrawals until you unfreeze it' : 'Card active: purchases and ATM withdrawals allowed'}
        </Text>
        <Body muted>Spent this month: $642.18 of $3,000</Body>
        <Body muted>Cashback earned: +320 points</Body>
      </Card>
      <Button label="Add to Apple Pay or Google Pay" />
      <Body muted>Card numbers are shown by the card partner's secure view and never stored on oenodPay servers.</Body>
    </Screen>
  );
}

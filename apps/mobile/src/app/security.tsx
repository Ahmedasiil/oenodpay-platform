import { Text, View } from 'react-native';

import { Body, Button, Card, Heading, ListRow, Screen } from '@/components/ui';
import { colors } from '@/lib/theme';

const protections = [
  { name: 'Passkey sign-in', desc: 'No password to steal or phish' },
  { name: 'Face ID for every payment', desc: 'Required for transfers, new payees and card details' },
  { name: 'Trusted device', desc: 'New phones need approval from this one' },
  { name: 'SIM-swap protection', desc: 'SMS codes blocked if your number moves' },
  { name: 'Scam alerts', desc: 'Warnings before risky transfers' },
];

const OnBadge = () => (
  <Text style={{ fontSize: 12, fontWeight: '600', color: colors.positive, backgroundColor: colors.positiveSoft, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999, overflow: 'hidden' }}>On</Text>
);

export default function Security() {
  return (
    <Screen title="Security center" back>
      <Card dark>
        <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>Your account is protected</Text>
        <Body light>All {protections.length} protections are on</Body>
      </Card>
      <Card>
        {protections.map((p) => (
          <ListRow key={p.name} title={p.name} subtitle={p.desc} trailing={<OnBadge />} />
        ))}
      </Card>
      <Heading>Signed-in devices</Heading>
      <Card>
        <ListRow title="iPhone · this device" subtitle="Toronto · active now" />
        <ListRow title="Chrome on Windows" subtitle="Toronto · 2 days ago" trailing={<View style={{ width: 90 }}><Button label="Remove" variant="secondary" /></View>} />
      </Card>
      <Button label="Lock my account now" variant="danger" />
    </Screen>
  );
}

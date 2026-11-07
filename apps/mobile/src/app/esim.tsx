import { Text, View } from 'react-native';

import { Body, Button, Card, Field, Screen } from '@/components/ui';
import { sampleEsims } from '@/lib/sample';
import { colors } from '@/lib/theme';

export default function Esim() {
  return (
    <Screen title="eSIM data" back>
      <Body muted>Stay connected in 190+ countries. Install in the app, no physical SIM.</Body>
      <Field label="Destination" placeholder="Where are you going?" />
      {sampleEsims.map((e) => (
        <Card key={e.id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ gap: 2, flex: 1 }}>
            <Text style={{ fontSize: 15, fontWeight: '600', color: colors.ink }}>{e.name}</Text>
            <Text style={{ fontSize: 12, color: colors.muted }}>{e.plan}</Text>
          </View>
          <Button label={e.price} />
        </Card>
      ))}
      <Body muted>Sample prices.</Body>
    </Screen>
  );
}

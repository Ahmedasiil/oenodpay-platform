import { Text, View } from 'react-native';

import { Body, Button, Card, Field, Screen } from '@/components/ui';
import { sampleEsims } from '@/lib/sample';
import { useT } from '@/lib/i18n';
import { colors } from '@/lib/theme';

export default function Esim() {
  const t = useT();
  return (
    <Screen title={t('eSIM data')} back>
      <Body muted>{t('Stay connected in 190+ countries. Install in the app, no physical SIM.')}</Body>
      <Field label={t('Destination')} placeholder={t('Where are you going?')} />
      {sampleEsims.map((e) => (
        <Card key={e.id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ gap: 2, flex: 1 }}>
            <Text style={{ fontSize: 15, fontWeight: '600', color: colors.ink }}>{t(e.name)}</Text>
            <Text style={{ fontSize: 12, color: colors.muted }}>{t('{gb} GB · {days} days', { gb: e.gb, days: e.days })}</Text>
          </View>
          <Button label={e.price} />
        </Card>
      ))}
      <Body muted>{t('Sample prices.')}</Body>
    </Screen>
  );
}

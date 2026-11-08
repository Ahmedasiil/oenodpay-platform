import { useState } from 'react';
import { Text, View } from 'react-native';

import { Body, Card, Field, Screen, Segmented } from '@/components/ui';
import { sampleFlights, sampleHotels } from '@/lib/sample';
import { useT } from '@/lib/i18n';
import { colors } from '@/lib/theme';

export default function Travel() {
  const t = useT();
  const [tab, setTab] = useState<'flights' | 'hotels'>('flights');
  return (
    <Screen title={t('Travel')} back>
      <Segmented options={[{ id: 'flights', label: t('Flights') }, { id: 'hotels', label: t('Hotels') }]} value={tab} onChange={setTab} />
      {tab === 'flights' ? (
        <>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <View style={{ flex: 1 }}><Field label={t('From')} defaultValue={t('Toronto (YYZ)')} /></View>
            <View style={{ flex: 1 }}><Field label={t('To')} defaultValue={t('Dubai (DXB)')} /></View>
          </View>
          {sampleFlights.map((f) => (
            <Card key={f.id} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ gap: 2 }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: colors.ink }}>{f.times}</Text>
                <Text style={{ fontSize: 12, color: colors.muted }}>{t(f.meta)} · {f.duration}</Text>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 2 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: colors.ink }}>{f.price}</Text>
                <Text style={{ fontSize: 12, fontWeight: '600', color: colors.positive }}>{t('Earn {points} pts', { points: f.points })}</Text>
              </View>
            </Card>
          ))}
        </>
      ) : (
        <>
          <Field label={t('Where')} defaultValue={t('Dubai, United Arab Emirates')} />
          {sampleHotels.map((h) => (
            <Card key={h.id} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ gap: 2, flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: colors.ink }}>{t(h.name)}</Text>
                <Text style={{ fontSize: 12, color: colors.muted }}>{t(h.meta)}</Text>
              </View>
              <Text style={{ fontSize: 16, fontWeight: '700', color: colors.ink }}>{h.price}</Text>
            </Card>
          ))}
        </>
      )}
      <Body muted>{t('Sample prices. Pay with your wallet, card or points.')}</Body>
    </Screen>
  );
}

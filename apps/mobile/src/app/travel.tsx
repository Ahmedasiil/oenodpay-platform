import { useState } from 'react';
import { Text, View } from 'react-native';

import { Body, Card, Field, Screen, Segmented } from '@/components/ui';
import { sampleFlights, sampleHotels } from '@/lib/sample';
import { colors } from '@/lib/theme';

export default function Travel() {
  const [tab, setTab] = useState<'flights' | 'hotels'>('flights');
  return (
    <Screen title="Travel" back>
      <Segmented options={[{ id: 'flights', label: 'Flights' }, { id: 'hotels', label: 'Hotels' }]} value={tab} onChange={setTab} />
      {tab === 'flights' ? (
        <>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <View style={{ flex: 1 }}><Field label="From" defaultValue="Toronto (YYZ)" /></View>
            <View style={{ flex: 1 }}><Field label="To" defaultValue="Dubai (DXB)" /></View>
          </View>
          {sampleFlights.map((f) => (
            <Card key={f.id} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ gap: 2 }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: colors.ink }}>{f.times}</Text>
                <Text style={{ fontSize: 12, color: colors.muted }}>{f.meta}</Text>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 2 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: colors.ink }}>{f.price}</Text>
                <Text style={{ fontSize: 12, fontWeight: '600', color: colors.positive }}>{f.points}</Text>
              </View>
            </Card>
          ))}
        </>
      ) : (
        <>
          <Field label="Where" defaultValue="Dubai, United Arab Emirates" />
          {sampleHotels.map((h) => (
            <Card key={h.id} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ gap: 2, flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: colors.ink }}>{h.name}</Text>
                <Text style={{ fontSize: 12, color: colors.muted }}>{h.meta}</Text>
              </View>
              <Text style={{ fontSize: 16, fontWeight: '700', color: colors.ink }}>{h.price}</Text>
            </Card>
          ))}
        </>
      )}
      <Body muted>Sample prices. Pay with your wallet, card or points.</Body>
    </Screen>
  );
}

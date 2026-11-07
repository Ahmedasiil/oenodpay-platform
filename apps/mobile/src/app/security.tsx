import { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { router } from 'expo-router';

import { Body, Button, Card, Heading, ListRow, Screen } from '@/components/ui';
import { api, clearSession, hasSession } from '@/lib/api';
import { colors } from '@/lib/theme';

const protections = [
  { name: 'Passkey sign-in', desc: 'No password to steal or phish' },
  { name: 'Face ID for every payment', desc: 'Required for transfers, new payees and card details' },
  { name: 'Trusted device', desc: 'New phones need approval from this one' },
  { name: 'SIM-swap protection', desc: 'SMS codes blocked if your number moves' },
  { name: 'Scam alerts', desc: 'Warnings before risky transfers' },
];

interface Device { id: string; deviceName: string; lastUsedAt: string; current: boolean }

const OnBadge = () => (
  <Text style={{ fontSize: 12, fontWeight: '600', color: colors.positive, backgroundColor: colors.positiveSoft, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999, overflow: 'hidden' }}>On</Text>
);

const sampleDevices: Device[] = [
  { id: 'a', deviceName: 'iPhone', lastUsedAt: new Date().toISOString(), current: true },
  { id: 'b', deviceName: 'Chrome on Windows', lastUsedAt: new Date(Date.now() - 2 * 864e5).toISOString(), current: false },
];

function ago(iso: string) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 2) return 'active now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  return hours < 48 ? `${hours} h ago` : `${Math.round(hours / 24)} days ago`;
}

export default function Security() {
  const [live, setLive] = useState(false);
  const [devices, setDevices] = useState<Device[]>(sampleDevices);

  const load = useCallback(async () => {
    if (!(await hasSession())) return;
    try {
      const res = await api<{ sessions: Device[] }>('/v1/sessions');
      setDevices(res.sessions);
      setLive(true);
    } catch {
      setLive(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const remove = async (id: string) => {
    if (!live) return;
    await api(`/v1/sessions/${id}`, { method: 'DELETE' });
    await load();
  };

  const signOut = async () => {
    if (live) await api('/v1/auth/logout', { method: 'POST' }).catch(() => {});
    await clearSession();
    router.replace('/welcome');
  };

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
        {devices.map((d) => (
          <ListRow
            key={d.id}
            title={d.current ? `${d.deviceName} · this device` : d.deviceName}
            subtitle={ago(d.lastUsedAt)}
            trailing={d.current ? undefined : (
              <View style={{ width: 112 }}><Button label="Sign out" variant="secondary" onPress={() => remove(d.id)} /></View>
            )}
          />
        ))}
        {!live ? <Text style={{ fontSize: 12, color: colors.muted }}>Sample devices. Sign in to see yours.</Text> : null}
      </Card>
      {live ? <Button label="Sign out of this device" variant="secondary" onPress={signOut} /> : null}
      <Button label="Lock my account now" variant="danger" />
    </Screen>
  );
}

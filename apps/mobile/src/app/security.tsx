import { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { router } from 'expo-router';

import { Body, Button, Card, Chip, Heading, ListRow, Screen } from '@/components/ui';
import { api, clearSession, hasSession } from '@/lib/api';
import { LANGS, m, useLang, type T } from '@/lib/i18n';
import { colors } from '@/lib/theme';

const protections = [
  { name: m('Passkey sign-in'), desc: m('No password to steal or phish') },
  { name: m('Face ID for every payment'), desc: m('Required for transfers, new payees and card details') },
  { name: m('Trusted device'), desc: m('New phones need approval from this one') },
  { name: m('SIM-swap protection'), desc: m('SMS codes blocked if your number moves') },
  { name: m('Scam alerts'), desc: m('Warnings before risky transfers') },
];

interface Device { id: string; deviceName: string; lastUsedAt: string; current: boolean }

const OnBadge = ({ t }: { t: T }) => (
  <Text style={{ fontSize: 12, fontWeight: '600', color: colors.positive, backgroundColor: colors.positiveSoft, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999, overflow: 'hidden' }}>{t('On')}</Text>
);

const sampleDevices: Device[] = [
  { id: 'a', deviceName: 'iPhone', lastUsedAt: new Date().toISOString(), current: true },
  { id: 'b', deviceName: m('Chrome on Windows'), lastUsedAt: new Date(Date.now() - 2 * 864e5).toISOString(), current: false },
];

function ago(iso: string, t: T) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 2) return t('active now');
  if (mins < 60) return t('{n} min ago', { n: mins });
  const hours = Math.round(mins / 60);
  return hours < 48 ? t('{n} h ago', { n: hours }) : t('{n} days ago', { n: Math.round(hours / 24) });
}

export default function Security() {
  const { t, lang, setLang } = useLang();
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
    <Screen title={t('Security center')} back>
      <Card dark>
        <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>{t('Your account is protected')}</Text>
        <Body light>{t('All {n} protections are on', { n: protections.length })}</Body>
      </Card>
      <Card>
        {protections.map((p) => (
          <ListRow key={p.name} title={t(p.name)} subtitle={t(p.desc)} trailing={<OnBadge t={t} />} />
        ))}
      </Card>
      <Heading>{t('Signed-in devices')}</Heading>
      <Card>
        {devices.map((d) => (
          <ListRow
            key={d.id}
            title={d.current ? t('{device} · this device', { device: t(d.deviceName) }) : t(d.deviceName)}
            subtitle={ago(d.lastUsedAt, t)}
            trailing={d.current ? undefined : (
              <View style={{ width: 112 }}><Button label={t('Sign out')} variant="secondary" onPress={() => remove(d.id)} /></View>
            )}
          />
        ))}
        {!live ? <Text style={{ fontSize: 12, color: colors.muted }}>{t('Sample devices. Sign in to see yours.')}</Text> : null}
      </Card>
      {live ? <Button label={t('Sign out of this device')} variant="secondary" onPress={signOut} /> : null}
      <Button label={t('Lock my account now')} variant="danger" />
      <Heading>{t('Language')}</Heading>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {LANGS.map((l) => (
          <Chip key={l.id} label={l.name} selected={l.id === lang} onPress={() => setLang(l.id)} />
        ))}
      </View>
    </Screen>
  );
}

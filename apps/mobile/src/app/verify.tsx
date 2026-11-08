import { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { router } from 'expo-router';

import { Body, Button, Card, Heading, Screen } from '@/components/ui';
import { ApiError, api, hasSession } from '@/lib/api';
import { m, useT } from '@/lib/i18n';
import { colors } from '@/lib/theme';

interface Status {
  kycStatus: 'pending' | 'verified' | 'rejected';
  sandbox: boolean;
  latestCheck: { id: string; status: 'started' | 'verified' | 'rejected'; reason: string | null } | null;
}

const steps = [
  { n: '1', title: m('Photo of your ID'), desc: m('Driver’s licence, passport or provincial ID card') },
  { n: '2', title: m('Quick selfie video'), desc: m('Proves it’s really you holding the phone') },
  { n: '3', title: m('Done in about 2 minutes'), desc: m('Most people are approved right away') },
];

export default function Verify() {
  const t = useT();
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [status, setStatus] = useState<Status | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const ok = await hasSession();
    setSignedIn(ok);
    if (ok) setStatus(await api<Status>('/v1/kyc/status').catch(() => null));
  }, []);

  useEffect(() => { void load(); }, [load]);

  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
      await load();
    } catch (e) {
      setError(e instanceof ApiError && e.code === 'already_verified' ? t('You’re already verified.') : t('That didn’t work. Try again.'));
    } finally {
      setBusy(false);
    }
  };

  const start = () => run(async () => {
    // A real vendor opens its secure capture screen at verificationUrl (ID photo + selfie).
    // The sandbox used in development lets you pick the result instead.
    await api<{ verificationUrl: string }>('/v1/kyc/sessions', { method: 'POST' });
  });

  const decide = (decision: 'verified' | 'rejected') =>
    run(() => api('/v1/kyc/sandbox/decide', { method: 'POST', body: { decision } }));

  const state = status?.kycStatus === 'verified' ? 'verified'
    : status?.latestCheck?.status === 'started' ? 'in_progress'
    : status?.kycStatus === 'rejected' ? 'rejected' : 'not_started';

  return (
    <Screen title={t('Verify your identity')} back>
      {state === 'verified' ? (
        <Card dark>
          <Text style={{ color: colors.mint, fontSize: 13, fontWeight: '700' }}>{t('VERIFIED')}</Text>
          <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: '700' }}>{t('You’re all set')}</Text>
          <Body light>{t('You can now send money, pay bills and order your card.')}</Body>
          <Button label={t('Go to my wallet')} variant="soft" onPress={() => router.replace('/')} />
        </Card>
      ) : (
        <>
          <Body muted>
            {t('Canadian law requires us to confirm who you are before you can send money. It keeps your account, and everyone else’s, safe from fraud.')}
          </Body>
          <Card>
            {steps.map((s) => (
              <View key={s.n} style={{ flexDirection: 'row', gap: 12, alignItems: 'center', paddingVertical: 6 }}>
                <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: colors.primary, fontWeight: '700' }}>{s.n}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: colors.ink }}>{t(s.title)}</Text>
                  <Text style={{ fontSize: 12, color: colors.muted }}>{t(s.desc)}</Text>
                </View>
              </View>
            ))}
          </Card>

          {state === 'rejected' ? (
            <Card>
              <Heading>{t('We couldn’t verify you')}</Heading>
              <Body muted>{t('This happens with blurry photos or glare. You can try again with your ID on a dark, flat surface.')}</Body>
            </Card>
          ) : null}

          {signedIn === false ? (
            <Button label={t('Create an account to start')} onPress={() => router.push('/welcome')} />
          ) : state === 'in_progress' ? (
            <Card>
              <Heading>{t('Checking your documents…')}</Heading>
              <Body muted>{t('We’ll let you know as soon as it’s done. This usually takes under a minute.')}</Body>
              {status?.sandbox ? (
                <View style={{ gap: 8 }}>
                  <Text style={{ fontSize: 12, color: colors.muted }}>{t('Test mode: choose the result')}</Text>
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <View style={{ flex: 1 }}><Button label={t('Approve')} onPress={() => decide('verified')} disabled={busy} /></View>
                    <View style={{ flex: 1 }}><Button label={t('Reject')} variant="secondary" onPress={() => decide('rejected')} disabled={busy} /></View>
                  </View>
                </View>
              ) : null}
            </Card>
          ) : (
            <Button label={busy ? t('Starting…') : state === 'rejected' ? t('Try again') : t('Start verification')} onPress={start} disabled={busy || signedIn === null} />
          )}
          {error ? <Text accessibilityRole="alert" style={{ color: colors.danger, fontSize: 13 }}>{error}</Text> : null}

          <Card>
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.ink }}>{t('Your privacy')}</Text>
            <Body muted>
              {t('Your ID photos and selfie go straight to our certified verification partner over an encrypted connection. oenodPay keeps only the result, never the images.')}
            </Body>
          </Card>
        </>
      )}
    </Screen>
  );
}

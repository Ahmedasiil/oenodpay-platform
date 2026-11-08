import { useState } from 'react';
import { Image, Pressable, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { Body, Button, Card, Field, Screen, Segmented } from '@/components/ui';
import { ApiError, api, deviceName, saveSession, type SignedIn } from '@/lib/api';
import { m, useT } from '@/lib/i18n';
import { colors } from '@/lib/theme';

const messages: Record<string, string> = {
  invalid_credentials: m('That email and password don’t match.'),
  email_taken: m('An account with this email already exists. Sign in instead.'),
  invalid_request: m('Check the details and try again. Passwords need at least 12 characters.'),
  too_many_requests: m('Too many tries. Wait a minute and try again.'),
};

export default function Welcome() {
  const t = useT();
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [intro, setIntro] = useState(true);
  const { width } = useWindowDimensions();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      const body = mode === 'signup' ? { fullName, email, password, deviceName: deviceName() } : { email, password, deviceName: deviceName() };
      const res = await api<SignedIn>(mode === 'signup' ? '/v1/auth/register' : '/v1/auth/login', { method: 'POST', body }, false);
      await saveSession(res);
      router.replace(res.user.kycStatus === 'verified' ? '/' : '/verify');
    } catch (e) {
      setError(e instanceof ApiError ? t(messages[e.code] ?? 'Something went wrong. Try again.') : t('Can’t reach oenodPay. Check your connection.'));
    } finally {
      setBusy(false);
    }
  };

  if (intro) {
    const w = Math.min(width, 520);
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['bottom']}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Image source={require('@/assets/ui/welcome-hero.png')} style={{ width: w, height: w * (800 / 780), marginTop: -20 }} resizeMode="cover" accessibilityIgnoresInvertColors />
          <SafeAreaView edges={['top']} style={{ position: 'absolute', top: 0, left: 0, right: 0, alignItems: 'center' }}>
            <Image source={require('@/assets/brand/oenodpay-logo-white-2000.png')} accessibilityLabel="OENODPAY" style={{ marginTop: 14, width: 123, height: 20 }} resizeMode="contain" />
          </SafeAreaView>
        </View>
        <View style={{ paddingHorizontal: 28, paddingBottom: 24, gap: 14, maxWidth: 520, width: '100%', alignSelf: 'center' }}>
          <Text style={{ fontSize: 40, lineHeight: 46, fontWeight: '500', color: colors.ink, letterSpacing: -1.2 }}>{t('All your money, beautifully simple.')}</Text>
          <Text style={{ fontSize: 16, lineHeight: 23, color: colors.muted }}>{t('Send, pay, travel and grow your money. One secure app.')}</Text>
          <View style={{ height: 10 }} />
          <Button label={t('Create an account')} onPress={() => { setMode('signup'); setIntro(false); }} />
          <Pressable accessibilityRole="button" onPress={() => { setMode('signin'); setIntro(false); }} style={{ minHeight: 44, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 15, color: colors.ink }}>{t('I already have an account')}</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={() => router.replace('/')} style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 13, color: colors.muted }}>{t('Explore the demo first')}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <Screen>
      <View style={{ alignItems: 'center', gap: 10, paddingTop: 24, paddingBottom: 8 }}>
        <Image
          source={require('@/assets/brand/oenodpay-logo-white-2000.png')}
          accessibilityLabel="OENODPAY"
          style={{ width: 210, height: 34 }}
          resizeMode="contain"
        />
        <Text style={{ fontSize: 15, color: colors.muted, textAlign: 'center' }}>{t('Send, pay, travel and grow your money. One secure app.')}</Text>
      </View>

      <Segmented
        options={[{ id: 'signup', label: t('Create account') }, { id: 'signin', label: t('Sign in') }]}
        value={mode}
        onChange={(m) => { setMode(m); setError(null); }}
      />

      <Card>
        {mode === 'signup' ? (
          <Field label={t('Full legal name')} value={fullName} onChangeText={setFullName} autoComplete="name" textContentType="name" placeholder={t('As shown on your ID')} />
        ) : null}
        <Field label={t('Email')} value={email} onChangeText={setEmail} autoCapitalize="none" autoComplete="email" keyboardType="email-address" textContentType="emailAddress" />
        <Field
          label={t('Password')}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
          textContentType={mode === 'signup' ? 'newPassword' : 'password'}
          placeholder={mode === 'signup' ? t('At least 12 characters') : undefined}
        />
        {error ? <Text accessibilityRole="alert" style={{ color: colors.danger, fontSize: 13 }}>{error}</Text> : null}
        <Button label={busy ? t('Please wait…') : mode === 'signup' ? t('Create account') : t('Sign in')} onPress={submit} disabled={busy} />
      </Card>

      <Card>
        <Text style={{ fontSize: 14, fontWeight: '600', color: colors.ink }}>{t('Face ID sign-in comes next')}</Text>
        <Body muted>{t('After you sign in, you can add a passkey so you never need this password again.')}</Body>
      </Card>

      <Button label={t('Explore the demo first')} variant="secondary" onPress={() => router.replace('/')} />
      <Text style={{ fontSize: 12, color: colors.muted, textAlign: 'center' }}>
        {t('Protected with passkeys, device-bound sessions and bank-grade encryption.')}
      </Text>
    </Screen>
  );
}

import { useState } from 'react';
import { Text, View } from 'react-native';

import { Body, Button, Card, Chip, Heading, Screen, Segmented } from '@/components/ui';
import { m, useT } from '@/lib/i18n';
import { colors } from '@/lib/theme';

const offers = [
  { name: m('Credit builder'), tag: m('New to Canada'), desc: m('Build your credit history with small monthly payments reported to the credit bureaus.'), cta: m('Start building') },
  { name: m('Personal loan'), tag: m('$1,000 to $35,000'), desc: m('Fixed monthly payments. See your rate in 2 minutes without affecting your score.'), cta: m('Check my rate') },
  { name: m('Pay in 4'), tag: m('0% interest'), desc: m('Split travel, eSIM and card purchases into 4 payments every two weeks.'), cta: m('See eligible purchases') },
];

export default function Loans() {
  const t = useT();
  const [tab, setTab] = useState<'borrow' | 'lend'>('borrow');
  const [plan, setPlan] = useState<'basic' | 'plus'>('plus');
  const [risk, setRisk] = useState<'lower' | 'balanced' | 'higher'>('balanced');

  return (
    <Screen title={t('Loans')}>
      <Segmented options={[{ id: 'borrow', label: t('Borrow') }, { id: 'lend', label: t('Lend and earn') }]} value={tab} onChange={setTab} />
      {tab === 'borrow' ? (
        <>
          <Card dark style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <View style={{ width: 84, height: 84, borderRadius: 42, borderWidth: 8, borderColor: colors.mint, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#FFFFFF', fontSize: 24, fontWeight: '700' }}>712</Text>
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '600' }}>{t('Credit score: Good')}</Text>
              <Body light>{t('Checking offers never lowers your score')}</Body>
            </View>
          </Card>
          {offers.map((o) => (
            <Card key={o.name}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: colors.ink }}>{t(o.name)}</Text>
                <Text style={{ fontSize: 13, fontWeight: '600', color: colors.primary }}>{t(o.tag)}</Text>
              </View>
              <Body muted>{t(o.desc)}</Body>
              <Button label={t(o.cta)} variant="soft" />
            </Card>
          ))}
        </>
      ) : (
        <>
          <Card dark>
            <Body light>oenodPay Lend</Body>
            <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: '700' }}>{t('Put your money to work by funding loans')}</Text>
            <Body light>{t('Your money is spread across many small loans. Repayments and interest come back to your wallet every month.')}</Body>
          </Card>
          <Chip label={t('Lend Basic · Free · standard fees, manual reinvesting')} selected={plan === 'basic'} onPress={() => setPlan('basic')} />
          <Chip label={t('Lend Plus · monthly plan · lower fees, auto-reinvest')} selected={plan === 'plus'} onPress={() => setPlan('plus')} />
          <Heading>{t('Choose your risk')}</Heading>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {([['lower', m('Lower')], ['balanced', m('Balanced')], ['higher', m('Higher')]] as const).map(([r, label]) => (
              <View key={r} style={{ flex: 1 }}>
                <Chip label={t(label)} selected={risk === r} onPress={() => setRisk(r)} />
              </View>
            ))}
          </View>
          <Button label={t('Start lending')} />
          <Body muted>{t('Lending carries risk: borrowers can pay late or default, and money in Lend is not CDIC insured. Expected returns are shown after a suitability check.')}</Body>
        </>
      )}
    </Screen>
  );
}

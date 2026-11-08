import { useState } from 'react';
import { formatMoney } from '@oenodpay/shared';

import { Button, Card, Field, Heading, ListRow, Screen } from '@/components/ui';
import { useT } from '@/lib/i18n';
import { sampleBills } from '@/lib/sample';

export default function Bills() {
  const t = useT();
  const [query, setQuery] = useState('');
  const bills = sampleBills.filter((b) => t(b.name).toLowerCase().includes(query.toLowerCase()));
  return (
    <Screen title={t('Pay bills')} back>
      <Field label={t('Find a biller')} placeholder={t('Hydro, phone, internet, taxes…')} value={query} onChangeText={setQuery} />
      <Heading>{t('Coming up')}</Heading>
      <Card>
        {bills.map((b) => (
          <ListRow key={b.id} title={t(b.name)} subtitle={t(b.due)} trailing={formatMoney({ minor: b.amountMinor, currency: 'CAD' })} />
        ))}
      </Card>
      <Button label={t('Add a new biller')} variant="secondary" />
    </Screen>
  );
}

import { useState } from 'react';
import { formatMoney } from '@oenodpay/shared';

import { Button, Card, Field, Heading, ListRow, Screen } from '@/components/ui';
import { sampleBills } from '@/lib/sample';

export default function Bills() {
  const [query, setQuery] = useState('');
  const bills = sampleBills.filter((b) => b.name.toLowerCase().includes(query.toLowerCase()));
  return (
    <Screen title="Pay bills" back>
      <Field label="Find a biller" placeholder="Hydro, phone, internet, taxes…" value={query} onChangeText={setQuery} />
      <Heading>Coming up</Heading>
      <Card>
        {bills.map((b) => (
          <ListRow key={b.id} title={b.name} subtitle={b.due} trailing={formatMoney({ minor: b.amountMinor, currency: 'CAD' })} />
        ))}
      </Card>
      <Button label="Add a new biller" variant="secondary" />
    </Screen>
  );
}

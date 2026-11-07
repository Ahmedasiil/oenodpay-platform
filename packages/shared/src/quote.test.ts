import { describe, expect, it } from 'vitest';
import { quoteTransfer, QuoteError } from './quote';
import { formatMoney, fromMajor } from './money';

describe('quoteTransfer', () => {
  it('subtracts the fee before converting', () => {
    const q = quoteTransfer('PH', 'ph-wallet', 50_000);
    expect(q.fee.minor).toBe(299);
    expect(q.receive.minor).toBe(Math.floor((50_000 - 299) * 41.5));
    expect(q.receive.currency).toBe('PHP');
  });

  it('rejects unknown countries and methods', () => {
    expect(() => quoteTransfer('ZZ', 'x', 10_000)).toThrow(QuoteError);
    expect(() => quoteTransfer('PH', 'in-upi', 10_000)).toThrow(QuoteError);
  });

  it('rejects amounts at or below the fee', () => {
    expect(() => quoteTransfer('GB', 'gb-fps', 199)).toThrow(QuoteError);
  });
});

describe('money', () => {
  it('rounds major units to whole cents', () => {
    expect(fromMajor(10.005, 'CAD').minor).toBe(1001);
    expect(formatMoney({ minor: 248050, currency: 'CAD' })).toBe('$2,480.50');
  });
});

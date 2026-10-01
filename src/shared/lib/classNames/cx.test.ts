import { describe, expect, it } from 'vitest';

import { cx } from './cx';

describe('cx', () => {
  it('falsy 값을 빼고 공백으로 잇는다', () => {
    expect(cx('a', false, null, undefined, '', 'b')).toBe('a b');
  });

  it('모두 falsy면 빈 문자열을 반환한다', () => {
    expect(cx(false, undefined)).toBe('');
  });
});

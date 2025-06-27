import { describe, expect, it, vi } from 'vitest';
import { randSymmetricInt } from './math';

describe('randSymmetricInt', () => {
  it('Resolves random values correctly', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.3)
      .mockReturnValueOnce(0.8)
    const spreadRange = 5;

    const result1 = randSymmetricInt(spreadRange);
    const result2 = randSymmetricInt(spreadRange);

    expect(result1).toBe(-2);
    expect(result2).toBe(3);
  })
})
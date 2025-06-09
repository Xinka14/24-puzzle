import { describe, expect, test } from 'vitest';

import solve from './solver.js';

describe('バリデーション', () => {
  test.concurrent('parameter array', async () => {
    expect(() => solve([1, 2, 3])).toThrowError(/array/);
    expect(() => solve([1, 2, 3, 4, 5])).toThrowError(/array/);
  });

  test.concurrent('parameter number', async () => {
    expect(() => solve([1, 2, 3, 20])).toThrowError(/number/);
    expect(() => solve([1, -2, 3, 4])).toThrowError(/number/);
    expect(() => solve([1.5, 2, 3, 4])).toThrowError(/number/);
    expect(() => solve(['a', 2, 3, 4])).toThrowError(/number/);
  });
});

describe('ロジック', () => {
  test.concurrent('簡単', async () => {
    expect(solve([1, 2, 3, 4])).toContainEqual('(1 + 2 + 3) * 4');
    expect(solve([3, 3, 3, 3])).toContainEqual('3 * 3 * 3 - 3');
    expect(solve([4, 4, 4, 4])).toContainEqual('4 + 4 + 4 * 4');
    expect(solve([5, 5, 5, 5])).toContainEqual('5 * 5 - 5 / 5');
    expect(solve([6, 6, 6, 6])).toContainEqual('6 + 6 + 6 + 6');
    expect(solve([7, 8, 9, 10])).toContainEqual('8 * 9 / (10 - 7)');
  });
  test.concurrent('大きい数', async () => {
    expect(solve([1, 10, 3, 9])).toContainEqual('(1 + 10) * 3 - 9');
    expect(solve([3, 10, 8, 8])).toContainEqual('(8 * 10 - 8) / 3');
    expect(solve([7, 10, 8, 8])).toContainEqual('8 * 10 - 7 * 8');
    expect(solve([7, 1, 2, 7])).toContainEqual('(7 * 7 - 1) / 2');
  });
  test.concurrent('分数', async () => {
    expect(solve([1, 5, 5, 5])).toContainEqual('(5 - 1 / 5) * 5');
    expect(solve([3, 3, 8, 8])).toContainEqual('8 / (3 - 8 / 3)');
    expect(solve([2, 4, 10, 10])).toContainEqual('(2 + 4 / 10) * 10');
    expect(solve([2, 7, 7, 10])).toContainEqual('(2 + 10 / 7) * 7');
    expect(solve([4, 4, 7, 7])).toContainEqual('(4 - 4 / 7) * 7');
    expect(solve([2, 5, 10, 5])).toContainEqual('(5 - 2 / 10) * 5');
    expect(solve([3, 3, 7, 7])).toContainEqual('(3 + 3 / 7) * 7');
    expect(solve([1, 3, 4, 6])).toContainEqual('6 / (1 - 3 / 4)');
  });
  test.concurrent('複雑', async () => {
    expect(solve([1, 4, 5, 6])).toContainEqual('4 / (1 - 5 / 6)');
    expect(solve([1, 6, 6, 8])).toContainEqual('6 / (1 - 6 / 8)');
    expect(solve([3, 5, 10, 10])).toContainEqual('3 * (10 - 10 / 5)');
    expect(solve([4, 4, 10, 10])).toContainEqual('(10 * 10 - 4) / 4');
    expect(solve([2, 2, 7, 10])).toContainEqual('2 * (7 + 10 / 2)');
    expect(solve([3, 3, 6, 6])).toContainEqual('3 * (6 / 3 + 6)');
    expect(solve([2, 4, 10, 10])).toContainEqual('(2 + 4 / 10) * 10');
  });
  test.concurrent('解なし', async () => {
    expect(solve([2, 9, 9, 10])).toStrictEqual([]);
    expect(solve([5, 5, 5, 7])).toStrictEqual([]);
    expect(solve([2, 5, 5, 6])).toStrictEqual([]);
    expect(solve([3, 3, 4, 10])).toStrictEqual([]);
    expect(solve([2, 3, 3, 4])).toStrictEqual([]);
  });
});

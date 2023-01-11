/**
 * 中身をシャッフルした新しい配列を返す
 * @param array
 */
export const shuffleArray = <T>(array: readonly T[]): T[] => {
  const ary = array.slice();

  for (let i = ary.length - 1; i >= 0; i--) {
    const j = randomInt(i + 1);
    [ary[i], ary[j]] = [ary[j], ary[i]];
  }

  return ary;
};

/**
 * 0以上max未満の整数の乱数を返す
 */
export const randomInt = (max: number): number => Math.floor(g.game.random.generate() * max);

/**
 * `min`以上`max`未満の範囲の整数の配列を返す
 * @param min 最小の数値
 * @param max 最大+1の数値
 * @returns 数値の配列
 */
export const range = (min: number, max: number): number[] => {
  const res: number[] = [];
  for (let num = min; num < max; num++) {
    res.push(num);
  }
  return res;
};

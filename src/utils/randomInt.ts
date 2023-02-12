/**
 * 0以上max未満の整数の乱数を返す
 */
export const randomInt = (max: number): number => Math.floor(g.game.random.generate() * max);

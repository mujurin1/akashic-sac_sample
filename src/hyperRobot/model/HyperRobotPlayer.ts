export interface HyperRobotPlayer {
  readonly id: string;
  readonly score: number;
  /** 何手でゴール出来るか宣言した値 */
  readonly declareCount: number | undefined;
  /** 操作する順番 */
  readonly moveOrder: number | undefined;
}

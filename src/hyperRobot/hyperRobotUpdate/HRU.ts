/**
 * `HyperRobot`から通知されるデータの形式
 *
 * メイン用途は画面の更新
 */
export interface HRU {
  /**
   * 更新通知の種類
   */
  readonly name: string;
}

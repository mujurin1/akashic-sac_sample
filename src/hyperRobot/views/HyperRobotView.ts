import { Dir, StandardColor } from "../type";

export interface HyperRobotView {
  readonly display: g.E;
  update(): void;
}

export interface CreateHyperRobotViewParam {
  /**
   * ピースを動かす操作を受け取ったら呼ばれる
   * @param [動かすピース, 方向]
   */
  movePiece(color: StandardColor, dir: Dir): void;
  /**
   * 何手でゴールできるか回答されたら呼ばれる
   * @param count 手数
   */
  anserMove(count: number): void;
}

export type CreateHyperRobotView = (param: CreateHyperRobotViewParam) => HyperRobotView;

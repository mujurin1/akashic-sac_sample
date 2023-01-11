import { Board } from "./Board";
import { Mark } from "./Mark";
import { Piece } from "./Piece";
import { Dir, StandardColor } from "../type";

export interface HyperRobot {
  readonly board: Board;

  /**
   * 残っている目標のマークの配列\
   * (今目標になっているコインを含む)
   */
  getRemainingTargets(): readonly Mark[];

  /**
   * 全ての駒の配列
   */
  getAllPiece(): readonly Piece[];

  /**
   * 今目標に設定されているマーク
   * @returns マーク
   */
  getTarget(): Mark;

  /**
   * 駒の移動可能な方向を計算する
   * @param color 移動する駒の色
   * @returns 移動可能な方向の配列
   */
  calcPieceMoveDirs(color: StandardColor): readonly Dir[];

  /**
   * ゴールしているかチェックする
   * @returns true:ゴールしている
   */
  checkGoal(): boolean;

  /**
   * マークを取り除く\
   * 取り除いたマークは以降目標にならない
   * @param mark 取り除くマーク
   */
  removeTarget(mark: Mark): void;

  /**
   * 目標のマークを変更する
   */
  changeTarget(): void;

  /**
   * 駒を動かす
   * @param color 動かす駒の色
   * @param dir 動かす方向
   * @returns 駒が動いたか
   */
  movePiece(color: StandardColor, dir: Dir): boolean;

  /**
   * 全ての駒を開始位置に戻す
   */
  resetAllPiecePoint(): void;
}

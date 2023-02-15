import { CellContainer } from "../impl/CellContainer";
import { StateType, ManipulateType, UpdateType } from "../impl/HyperRobotStateType";
import { Dir, Point, StandardColor } from "../type";
import { Cell } from "./Cell";
import { HyperRobotPlayer } from "./HyperRobotPlayer";
import { Mark } from "./Mark";
import { Piece } from "./Piece";

export interface IHyperRobotState {
  /** ゲームの進行状況 */
  readonly state: StateType;
  readonly players: readonly HyperRobotPlayer[];

  readonly cellContainer: CellContainer;
  readonly cells: readonly Cell[];
  readonly pieces: readonly Piece[];

  /** 現在目標のゴールのマーク */
  readonly target: Mark;
  /** ゴールしていないマーク */
  readonly remaindMarks: readonly Mark[];

  /** 現在操作しているプレイヤーID. `0`は操作プレイヤー無し */
  readonly movePlayerId: string | 0;
  /** 何手操作したか */
  readonly movedCount: number;

  getCell(x: number, y: number): Cell;
  getPiece(color: StandardColor): Piece;
  getMarkedCell(mark: Mark): Cell;
  getAllMarkedCells(): Cell[];

  /**
   * 操作する順に並んだプレイヤー配列を返します\
   * 宣言していないプレイヤーは除きます
   */
  getDeclaredPlayers(): HyperRobotPlayer[];

  /**
   * 駒の移動可能な方向を計算する
   * @param color 移動する駒の色
   * @returns 移動可能な方向の配列
   */
  calcPieceMoveDirs(color: StandardColor): Dir[];

  /**
   * 駒を動かした後の座標を返す
   * @param color 動かす駒
   * @param dir 動かす方向
   * @returns 移動後の座標
   */
  calcPieceMovedPoint(color: StandardColor, dir: Dir): Point;

  /**
   * 駒が移動した場合にゴールしているかチェックする
   * @param color 移動する駒
   * @param point 移動先
   * @returns true:ゴールしている
   */
  checkGoal(color: StandardColor, point: Point): boolean;

  /**
   * デバッグ用\
   * 操作から新しい状態を返す
   * @param args
   */
  MAN_UPD(args: ManipulateType): IHyperRobotState;

  /**
   * ユーザーの操作, ゲーム自身の動作(時間経過による状態の変化など)
   * を引数で渡して、自身の状態を変化するための情報を返す
   *
   * 検証や計算はこのメソッドが担当する
   * @param args
   * @returns 状態を変更するための情報
   */
  MANIPUlATE_(args: ManipulateType): UpdateType[];

  /**
   * [状態を変更する情報] を元に現在の状態を変更した新しい状態を返す
   *
   * [状態を変更する情報] は検証済みなので、100%信頼する
   * @param args 状態を変更するための情報
   * @returns 新しい`IHyperRobotState`
   */
  UPDATE_(args: UpdateType): IHyperRobotState;
}

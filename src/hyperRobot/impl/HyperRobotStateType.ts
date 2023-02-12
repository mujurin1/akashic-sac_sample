import { Mark } from "../model/Mark";
import { StandardColor, Dir, Point } from "../type";

/** ゲームの状態 */
export type StateType =
  | "STA_THINKING"
  | "STA_ANSWER"
  //
  | "STA_WAIT"
  | "STA_GAMEOVER";

/** ユーザーの操作状態の形式 */
export type ManipulateType =
  // 状態に関係なく処理するべき情報
  | { type: "MAN_JOIN"; data: { playerId: string } }
  // 宣言タイム
  | { type: "MAN_DECLARE"; data: { playerId: string; count: number } }
  | { type: "MAN_DECLARE_END"; data: {} }
  // 回答タイム
  | { type: "MAN_MOVE"; data: { color: StandardColor; dir: Dir } }
  | { type: "MAN_GIVE_UP"; data: {} }
  // 次のターンを始めるまでの間
  | { type: "MAN_NEXT_TURN"; data: { nextTarget: Mark } };

/** ゲームの状態を更新するための情報 */
export type UpdateType =
  // 状態に関係なく処理するべき情報
  | { type: "UPD_JOIN"; data: { playerId: string } }
  // 宣言タイム
  | { type: "UPD_DECLARE"; data: { playerId: string; count: number; order: number } }
  | { type: "UPD_TRANSITION_ANSWER"; data: {} }
  // 回答タイム
  // | { type: "UPD_ANSWER_CHANGE"; data: { playerId: string } }
  | { type: "UPD_MOVE_PIECE"; data: { color: StandardColor; point: Point } }
  | { type: "UPD_GOALED"; data: {} }
  | { type: "UPD_FAILED"; data: { nextMoverId: string | 0 } }
  | { type: "UPD_TRANSITION_WAIT"; data: {} }
  // 次のターンを始めるまでの間
  | { type: "UPD_TRANSITION_THINKING"; data: { nextTarget: Mark } }
  | { type: "UPD_TRANSITION_GAMEOVER"; data: {} };

import { MutableBoard } from "./model/MutableBoard";
import { Point } from "./type";

/**
 * ボードの配置が問題があるか検証する
 *
 * ### ルール
 * * ゴールの周囲8マスにゴールが無い
 * @param mutableBoard
 * @returns チェックに合格すれば`true`
 */
export const mutableBoardCheck = (mutableBoard: MutableBoard): boolean => {
  const goals = mutableBoard.getGoals();

  // ゴールの周囲8マスに別のゴールが無いかチェック
  for (let i = goals.length - 1; i >= 0; i--) {
    const goal = goals[i];

    for (let j = i + 1; j < goals.length; j++) {
      const checkGoal = goals[j];
      if (Math.abs(goal.x - checkGoal.x) <= 1 && Math.abs(goal.y - checkGoal.y) <= 1) {
        return false;
      }
    }
  }

  return true;
};

/**
 * 指定座標の周囲8マスにゴールが有るかチェックする
 * @returns `true`:周囲8マスにゴールが無い
 */
export const aroundIsNotGoal = (board: MutableBoard, point: Point): boolean => {
  const goals = board.getGoals();
  for (let i = 0; i < goals.length; i++) {
    const goal = goals[i];
    if (Math.abs(point.x - goal.x) <= 1 && Math.abs(point.y - goal.y) <= 1) {
      return false;
    }
  }
  return true;
};

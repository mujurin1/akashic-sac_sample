import { Goal } from "./model/Goal";
import { MutableBoard } from "./model/MutableBoard";
import { aroundIsNotGoal } from "./mutableBoardCheck";
import { Point } from "./type";

export const boardPieceWidth = 8;
export const boardPieceHeight = 8;
export const boardWidth = boardPieceWidth * 2;
export const boardHeight = boardPieceHeight * 2;

export const createMutableBoard = (): MutableBoard => {
  const mutableBoard = new MutableBoard();

  for (const angle of [0, 90, 180, 270] as const) {
    const boardId = angle / 90;
    const board = cerateMutableBoardPiece([
      Goal.nomals[boardId * 4],
      Goal.nomals[boardId * 4 + 1],
      Goal.nomals[boardId * 4 + 2],
      Goal.nomals[boardId * 4 + 3]
    ]).rotate(angle, boardPieceWidth, boardPieceHeight);
    mutableBoard.merge(board);
  }

  addWildGoal(mutableBoard);

  return mutableBoard;
};

/**
 * ワイルドゴールを配置する
 * @param board
 */
const addWildGoal = (board: MutableBoard): void => {
  const goalXs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  const goalYs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  let goalPoints: Point[] = goalXs.flatMap(x => {
    return goalYs.map(y => ({ x, y }));
  });

  goalPoints = goalPoints.filter(point => point.x < 6 || 9 < point.x || point.y < 6 || 9 < point.y);

  let pointIndex = randomInt(goalPoints.length);
  let point = goalPoints[pointIndex];
  while (!aroundIsNotGoal(board, point)) {
    goalPoints.splice(pointIndex, 1);
    pointIndex = randomInt(goalPoints.length);
    point = goalPoints[pointIndex];
  }

  board.addGoal(point.x, point.y, Goal.wild);

  board.addWall(point.x, point.y, point.x < boardPieceWidth ? "right" : "left");
  board.addWall(point.x, point.y, point.y < boardPieceHeight ? "bottom" : "top");
};

/**
 * ボードの左上相当の一片を作成して返す
 * @param goals ボードに配置する４つのゴール
 */
const cerateMutableBoardPiece = (goals: readonly [Goal, Goal, Goal, Goal]): MutableBoard => {
  const shuffledGoalds = shuffleArray(goals);
  const mutableBoard = new MutableBoard();

  // 左・上のボード端の壁を配置
  for (let x = 0; x < boardPieceWidth; x++) {
    mutableBoard.addWall(x, 0, "top");
  }
  for (let y = 0; y < boardPieceHeight; y++) {
    mutableBoard.addWall(0, y, "left");
  }

  // 中央にあたる壁を配置
  mutableBoard.addWall(7, 7, "left");
  mutableBoard.addWall(7, 7, "top");

  // ゴールとゴール壁を配置
  const goalPoints = generateGoalPoints();

  mutableBoard.addGoalAndWall(goalPoints[0].x, goalPoints[0].y, shuffledGoalds[0], [
    "top",
    "right"
  ]);
  mutableBoard.addGoalAndWall(goalPoints[1].x, goalPoints[1].y, shuffledGoalds[1], [
    "right",
    "bottom"
  ]);
  mutableBoard.addGoalAndWall(goalPoints[2].x, goalPoints[2].y, shuffledGoalds[2], [
    "bottom",
    "left"
  ]);
  mutableBoard.addGoalAndWall(goalPoints[3].x, goalPoints[3].y, shuffledGoalds[3], ["left", "top"]);

  // 左・上から生える壁を配置
  const addWallX = shuffleArray([1, 2, 3, 4, 5, 6]).filter(x => {
    const bottomCell = mutableBoard.getCell(x, 1);
    const rightBottomCell = mutableBoard.getCell(x + 1, 1);
    return !bottomCell.isTopWall && !bottomCell.isRightWall && !rightBottomCell.isTopWall;
  })[0];
  mutableBoard.addWall(addWallX, 0, "right");

  const addWallY = shuffleArray([1, 2, 3, 4, 5, 6]).filter(y => {
    const rightCell = mutableBoard.getCell(1, y);
    const rightBottomCell = mutableBoard.getCell(1, y + 1);
    return !rightCell.isLeftWall && !rightCell.isBottomWall && !rightBottomCell.isLeftWall;
  })[0];
  mutableBoard.addWall(0, addWallY, "bottom");

  return mutableBoard;
};

/**
 * ゴールの座標を４つ生成する\
 * ### ルール
 * * 座標の縦横が被らない
 * * X,Y軸は１～７
 * * (6,6),(6,7),(7,7)の位置のゴールはダメ
 * * ゴールの周囲８マスに他のゴールは存在してはダメ
 * @returns [ {X,Y}, ...計4つ ]
 */
const generateGoalPoints = (): [Point, Point, Point, Point] => {
  const goalXs = [1, 2, 3, 4, 5, 6, 7];
  const goalYs = [1, 2, 3, 4, 5, 6, 7];
  let goalPoints: Point[] = goalXs.flatMap(x => {
    return goalYs.map(y => ({ x, y }));
  });

  goalPoints = goalPoints.filter(point => point.x < 6 || point.y < 6);

  const result: Point[] = [];

  for (let goalId = 0; goalId < 4; goalId++) {
    const goalPoint = goalPoints[randomInt(goalPoints.length)];
    result.push(goalPoint);

    // X,Y 軸が同じ座標を取り除く
    goalPoints = goalPoints.filter(point => point.x !== goalPoint.x && point.y !== goalPoint.y);
    // 周囲８マスを取り除く (上下左右は上のフィルターですでに除外済み)
    goalPoints = goalPoints.filter(
      point =>
        !(
          (point.x === goalPoint.x - 1 && point.y === goalPoint.y - 1) ||
          (point.x === goalPoint.x - 1 && point.y === goalPoint.y + 1) ||
          (point.x === goalPoint.x + 1 && point.y === goalPoint.y - 1) ||
          (point.x === goalPoint.x + 1 && point.y === goalPoint.y + 1)
        )
    );
  }

  return result as [Point, Point, Point, Point];
};

/**
 * 中身をシャッフルした新しい配列を返す
 * @param array
 */
const shuffleArray = <T>(array: readonly T[]): T[] => {
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
const randomInt = (max: number): number => Math.floor(g.game.random.generate() * max);

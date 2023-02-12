import { shuffleArray } from "../../utils/funcs";
import { randomInt } from "../../utils/randomInt";
import { Cell } from "../model/Cell";
import { Mark, StandardMarks, WildMark } from "../model/Mark";
import { MutableCellContainer } from "./MutableCellContainer";
import { Point } from "../type";
import { BOARD_SIZE } from "../const";

/**
 * ルールに則って配置されたセルの配列を返す\
 * ルールは`createRuledCellContainer.test.ts`を参照
 * @returns 16x16個のセルを格納された配列 (左上から右下へZ進行)
 */
export const createRuledCellArray = (): readonly Cell[] => {
  let container = createMutableCellContainer();

  let check = container.markedCellSpaceCheck();
  while (!check) {
    container = createMutableCellContainer();
    check = container.markedCellSpaceCheck();
  }

  const cells: Cell[] = [];

  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      cells.push(container.getCell(x, y));
    }
  }

  return cells;
};

// const toCellContainer = (
//   board: MutableCellContainer,
//   width: number,
//   height: number
// ): CellContainer => {
//   const cells: Cell[][] = [];
//   const markedCells: Cell[] = [];

//   for (let y = 0; y < height; y++) {
//     cells.push([]);
//     for (let x = 0; x < width; x++) {
//       const cell = board.getCell(x, y);
//       cells[y][x] = cell;
//       if (cell.mark != null) markedCells.push(cell);
//     }
//   }

//   return {
//     width,
//     height,
//     getCell(x, y) {
//       return cells[y][x];
//     },
//     getMarkedCell(mark) {
//       const cell = markedCells.find(cell => cell.mark === mark);

//       if (cell == null)
//         throw new Error(`該当するマークのセルが存在しません.
// mark:${JSON.stringify(mark)}`);

//       return cell;
//     },
//     getAllMarkedCell() {
//       return markedCells;
//     }
//   };
// };

//#region MutableCellContainer
const createMutableCellContainer = (): MutableCellContainer => {
  const mutableCellConainer = new MutableCellContainer();

  for (const angle of [0, 90, 180, 270] as const) {
    const index = angle / 90;
    const panelContainer = ceratePanel([
      StandardMarks.circle[index],
      StandardMarks.square[(1 + index) % 4],
      StandardMarks.triangle[(2 + index) % 4],
      StandardMarks.star[(3 + index) % 4]
    ]).rotate(angle, 8, 8);
    mutableCellConainer.merge(panelContainer);
  }

  addWildGoal(mutableCellConainer);

  return mutableCellConainer;
};

/**
 * ワイルドゴールを配置する
 * @param mutableCellConatiner
 */
const addWildGoal = (mutableCellConatiner: MutableCellContainer): void => {
  // ワイルドゴールが外周から生える壁に接触しないように外周から２マス離す
  // const goalXs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  // const goalYs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  const goalXs = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  const goalYs = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  let goalPoints: Point[] = goalXs.flatMap(x => {
    return goalYs.map(y => ({ x, y }));
  });

  goalPoints = goalPoints.filter(point => point.x < 6 || 9 < point.x || point.y < 6 || 9 < point.y);

  let pointIndex = randomInt(goalPoints.length);
  let point = goalPoints[pointIndex];
  while (true) {
    if (mutableCellConatiner.aroundIsNotGoal(point)) {
      // TODO: 盤上の区画によってワイルドゴールの壁の方向が代わるので、外周から生える壁と接触しているかチェックする
      // 或いは外周から２マス以上離す (現在はこっち)
      if (true) {
        break;
      }
    }

    goalPoints.splice(pointIndex, 1);
    pointIndex = randomInt(goalPoints.length);
    point = goalPoints[pointIndex];
  }

  mutableCellConatiner.setMark(point.x, point.y, WildMark);

  mutableCellConatiner.addWall(point.x, point.y, point.x < 8 ? "right" : "left");
  mutableCellConatiner.addWall(point.x, point.y, point.y < 8 ? "bottom" : "top");
};

/**
 * ボードの左上相当の一片を作成して返す
 * @param marks ボードのセルに配置するマークの配列
 */
const ceratePanel = (marks: readonly [Mark, Mark, Mark, Mark]): MutableCellContainer => {
  const mutableCellConainer = new MutableCellContainer();

  // 左・上のボード端の壁を配置
  for (let x = 0; x < 8; x++) {
    mutableCellConainer.addWall(x, 0, "top");
  }
  for (let y = 0; y < 8; y++) {
    mutableCellConainer.addWall(0, y, "left");
  }

  // 中央にあたる壁を配置
  mutableCellConainer.addWall(7, 7, "left");
  mutableCellConainer.addWall(7, 7, "top");

  // ゴールとゴール壁を配置
  const goalPoints = generateGoalPoints();

  mutableCellConainer.addMarkAndWall(goalPoints[0].x, goalPoints[0].y, marks[0], ["top", "right"]);
  mutableCellConainer.addMarkAndWall(goalPoints[1].x, goalPoints[1].y, marks[1], [
    "right",
    "bottom"
  ]);
  mutableCellConainer.addMarkAndWall(goalPoints[2].x, goalPoints[2].y, marks[2], [
    "bottom",
    "left"
  ]);
  mutableCellConainer.addMarkAndWall(goalPoints[3].x, goalPoints[3].y, marks[3], ["left", "top"]);

  // 左・上から生える壁を配置
  const addWallX = shuffleArray([1, 2, 3, 4, 5, 6]).filter(x => {
    const bottomCell = mutableCellConainer.getCell(x, 1);
    const rightBottomCell = mutableCellConainer.getCell(x + 1, 1);
    return !bottomCell.walls["top"] && !bottomCell.walls["right"] && !rightBottomCell.walls["top"];
  })[0];
  mutableCellConainer.addWall(addWallX, 0, "right");

  const addWallY = shuffleArray([1, 2, 3, 4, 5, 6]).filter(y => {
    const rightCell = mutableCellConainer.getCell(1, y);
    const rightBottomCell = mutableCellConainer.getCell(1, y + 1);
    return !rightCell.walls["left"] && !rightCell.walls["bottom"] && !rightBottomCell.walls["left"];
  })[0];
  mutableCellConainer.addWall(0, addWallY, "bottom");

  return mutableCellConainer;
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

//#endregion MutableCellContainer

import { Dir, Point } from "../type";
import { Cell } from "../model/Cell";
import { Mark } from "../model/Mark";

type MarkedCell = { x: number; y: number; mark: Mark };
type WallCell = { x: number; y: number; dir: Dir };

/**
 * `CellContainer`を生成するために使用する
 */
export class MutableCellContainer {
  private readonly markedCells: MarkedCell[] = [];
  private readonly walls: WallCell[] = [];

  getMarkedCells(): readonly MarkedCell[] {
    return this.markedCells;
  }

  getCell(x: number, y: number): Cell {
    const walls = this.walls.filter(wall => wall.x === x && wall.y === y);
    const mark = this.markedCells.find(goal => goal.x === x && goal.y === y);

    return {
      x,
      y,
      walls: {
        top: walls.some(wall => wall.dir === "top"),
        right: walls.some(wall => wall.dir === "right"),
        bottom: walls.some(wall => wall.dir === "bottom"),
        left: walls.some(wall => wall.dir === "left")
      },
      mark: mark?.mark
    };
  }

  setMark(x: number, y: number, mark: Mark): void {
    this.markedCells.push({ x, y, mark });
  }

  addMarkAndWall(x: number, y: number, mark: Mark, wallDir: readonly [Dir, Dir]): void {
    this.setMark(x, y, mark);

    this.addWall(x, y, wallDir[0]);
    this.addWall(x, y, wallDir[1]);
  }

  addWall(x: number, y: number, dir: Dir): void {
    this.walls.push({ x, y, dir });

    // 逆方向の壁
    if (dir == "left") this.walls.push({ x: x - 1, y, dir: "right" });
    if (dir == "top") this.walls.push({ x, y: y - 1, dir: "bottom" });
    if (dir == "right") this.walls.push({ x: x + 1, y, dir: "left" });
    if (dir == "bottom") this.walls.push({ x, y: y + 1, dir: "top" });
  }

  /**
   * ボードの時計回りに回転する
   */
  rotate(angle: 0 | 90 | 180 | 270, cx: number, cy: number): MutableCellContainer {
    let board: MutableCellContainer = this;
    for (let i = 0; i < angle / 90; i++) {
      board = board.rotate90(cx, cy);
    }

    return board;
  }

  /**
   * ボードを時計回りに90度回転させる
   */
  rotate90(cx: number, cy: number): MutableCellContainer {
    const newBoard = new MutableCellContainer();

    this.walls.forEach(wall => {
      const { x, y } = rotateXY(wall.x, wall.y, cx, cy);
      newBoard.walls.push({ x, y, dir: rotateDir(wall.dir) });
    });

    this.markedCells.forEach(mark => {
      const { x, y } = rotateXY(mark.x, mark.y, cx, cy);
      newBoard.markedCells.push({ x, y, mark: mark.mark });
    });

    return newBoard;
  }

  /**
   * 別のボードのゴール・壁を結合する (破壊的)
   * @param board
   */
  merge(board: MutableCellContainer): void {
    this.walls.push(...board.walls);
    this.markedCells.push(...board.markedCells);
  }

  /**
   * 指定座標の周囲8マスにゴールが無いかチェックする
   * @returns `true`:周囲8マスにゴールが無い
   */
  aroundIsNotGoal(point: Point): boolean {
    const goals = this.getMarkedCells();
    for (let i = 0; i < goals.length; i++) {
      const goal = goals[i];
      if (Math.abs(point.x - goal.x) <= 1 && Math.abs(point.y - goal.y) <= 1) {
        return false;
      }
    }
    return true;
  }

  /**
   * ゴール同士が１マス以上間隔を空けているかチェックする
   * @returns チェックに合格すれば`true`
   */
  markedCellSpaceCheck(): boolean {
    const goals = this.getMarkedCells();

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
  }
}

const rotateDir = (dir: Dir): Dir => {
  if (dir === "top") return "right";
  if (dir === "right") return "bottom";
  if (dir === "bottom") return "left";
  return "top";
};

const rotateXY = (x: number, y: number, cx: number, cy: number): { x: number; y: number } => {
  return {
    x: -y + cy + cx - 1,
    y: x - cx + cy
  };
};

import { Dir } from "../type";
import { Cell } from "./Cell";
import { Mark } from "./Mark";

type MarkedCell = { x: number; y: number; mark: Mark };
type WallCell = { x: number; y: number; dir: Dir };

export class MutableBoard {
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
  rotate(angle: 0 | 90 | 180 | 270, cx: number, cy: number): MutableBoard {
    let board: MutableBoard = this;
    for (let i = 0; i < angle / 90; i++) {
      board = board.rotate90(cx, cy);
    }

    return board;
  }

  /**
   * ボードを時計回りに90度回転させる
   */
  rotate90(cx: number, cy: number): MutableBoard {
    const newBoard = new MutableBoard();

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
  merge(board: MutableBoard): void {
    this.walls.push(...board.walls);
    this.markedCells.push(...board.markedCells);
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

import { Cell } from "./Cell";
import { Goal } from "./Goal";

export type Dir = "top" | "bottom" | "left" | "right";

export type GoalCell = { x: number; y: number; type: Goal };
export type WallCell = { x: number; y: number; dir: Dir };

export class MutableBoard {
  private readonly goals: GoalCell[] = [];
  private readonly walls: WallCell[] = [];

  getGoals(): readonly GoalCell[] {
    return this.goals;
  }

  getCell(x: number, y: number): Cell {
    const walls = this.walls.filter(wall => wall.x === x && wall.y === y);
    const goal = this.goals.find(goal => goal.x === x && goal.y === y);

    return {
      isLeftWall: walls.some(wall => wall.dir === "left"),
      isTopWall: walls.some(wall => wall.dir === "top"),
      isRightWall: walls.some(wall => wall.dir === "right"),
      isBottomWall: walls.some(wall => wall.dir === "bottom"),
      goal: goal?.type ?? undefined
    };
  }

  addGoal(x: number, y: number, type: Goal): void {
    this.goals.push({ x, y, type });
  }

  addGoalAndWall(x: number, y: number, type: Goal, wallDir: readonly [Dir, Dir]): void {
    this.goals.push({ x, y, type });

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

    this.goals.forEach(goal => {
      const { x, y } = rotateXY(goal.x, goal.y, cx, cy);
      newBoard.goals.push({ x, y, type: goal.type });
    });

    return newBoard;
  }

  /**
   * 別のボードのゴール・壁を結合する (破壊的)
   * @param board
   */
  merge(board: MutableBoard): void {
    this.walls.push(...board.walls);
    this.goals.push(...board.goals);
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

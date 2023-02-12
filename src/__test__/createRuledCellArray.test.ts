import { StandardMarks, WildMark } from "../hyperRobot/model/Mark";
import { Dir, StandardColors, StandardShapes } from "../hyperRobot/type";
import { createRuledCellArray } from "../hyperRobot/impl/createRuledCellArray";
import { BOARD_SIZE } from "../hyperRobot/const";
import { CellContainer } from "../hyperRobot/impl/CellContainer";

jest.mock("../utils/randomInt", () => {
  return {
    __esModule: true,
    randomInt: (max: number): number => Math.floor(Math.random() * max)
  };
});

describe("createRuledCellArray", () => {
  describe("壁", () => {
    test("外周が全て壁で囲われている", () => {
      const cellContainer = new CellContainer(createRuledCellArray());
      for (let x = 0; x < BOARD_SIZE; x++) {
        expect(cellContainer.getCell(x, 0).walls.top).toBe(true);
        expect(cellContainer.getCell(x, BOARD_SIZE - 1).walls.bottom).toBe(true);
      }
      for (let y = 0; y < BOARD_SIZE; y++) {
        expect(cellContainer.getCell(0, y).walls.left).toBe(true);
        expect(cellContainer.getCell(BOARD_SIZE - 1, y).walls.right).toBe(true);
      }
    });
    test("中央2x2マスは壁で囲われている", () => {
      const cellContainer = new CellContainer(createRuledCellArray());
      const centerX = BOARD_SIZE / 2;
      const centerY = BOARD_SIZE / 2;
      expect(cellContainer.getCell(centerX - 1, centerY - 1).walls.left).toBe(true);
      expect(cellContainer.getCell(centerX - 1, centerY - 1).walls.top).toBe(true);
      expect(cellContainer.getCell(centerX, centerY - 1).walls.top).toBe(true);
      expect(cellContainer.getCell(centerX, centerY - 1).walls.right).toBe(true);
      expect(cellContainer.getCell(centerX, centerY).walls.right).toBe(true);
      expect(cellContainer.getCell(centerX, centerY).walls.bottom).toBe(true);
      expect(cellContainer.getCell(centerX - 1, centerY).walls.bottom).toBe(true);
      expect(cellContainer.getCell(centerX - 1, centerY).walls.left).toBe(true);
    });
    test("ゴールマスは壁が2枚ある（L字）", () => {
      const cellContainer = new CellContainer(createRuledCellArray());
      const marks = [
        StandardMarks.circle,
        StandardMarks.square,
        StandardMarks.star,
        StandardMarks.triangle,
        [WildMark]
      ].flat();

      marks.forEach(mark => {
        const goal = cellContainer.getMarkedCell(mark);
        const { top, right, bottom, left } = goal.walls;

        expect(
          (top && right && !bottom && !left) ||
            (!top && right && bottom && !left) ||
            (!top && !right && bottom && left) ||
            (top && !right && !bottom && left)
        ).toBe(true);
      });
    });
    test("１つのマスに壁は２枚以下（コの字はダメ）", () => {
      const cellContainer = new CellContainer(createRuledCellArray());
      for (let x = 0; x < BOARD_SIZE; x++) {
        for (let y = 0; y < BOARD_SIZE; y++) {
          const cell = cellContainer.getCell(x, y);
          let numWall = 0;

          if (cell.walls.top) numWall++;
          if (cell.walls.right) numWall++;
          if (cell.walls.bottom) numWall++;
          if (cell.walls.left) numWall++;

          expect(numWall === 0 || numWall === 1 || numWall === 2).toBe(true);
        }
      }
    });
    test("外周の各側面から２枚ずつ壁が伸びている", () => {
      const cellContainer = new CellContainer(createRuledCellArray());
      let numTop = 0;
      let numBottom = 0;
      let numLeft = 0;
      let numRight = 0;
      for (let x = 0; x < BOARD_SIZE - 1; x++) {
        if (cellContainer.getCell(x, 0).walls.right) numTop++;
        if (cellContainer.getCell(x, BOARD_SIZE - 1).walls.right) numBottom++;
      }
      for (let y = 0; y < BOARD_SIZE - 1; y++) {
        if (cellContainer.getCell(0, y).walls.bottom) numLeft++;
        if (cellContainer.getCell(BOARD_SIZE - 1, y).walls.bottom) numRight++;
      }
      expect(numTop).toBe(2);
      expect(numBottom).toBe(2);
      expect(numLeft).toBe(2);
      expect(numRight).toBe(2);
    });
    test("側面から生える壁は、側面毎に、端２列と中央２列を除いて左右に１枚ずつ", () => {
      const cellContainer = new CellContainer(createRuledCellArray());
      [0, BOARD_SIZE - 1].forEach(y => {
        {
          let numWallA = 0;
          let numWallB = 0;
          for (let i = 0; i < 6; i++) {
            if (cellContainer.getCell(1 + i, y).walls.right) numWallA++;
            if (cellContainer.getCell(8 + i, y).walls.right) numWallB++;
          }
          expect(numWallA).toBe(1);
          expect(numWallB).toBe(1);
        }
      });
      [0, BOARD_SIZE - 1].forEach(x => {
        {
          let numWallA = 0;
          let numWallB = 0;
          for (let i = 0; i < 6; i++) {
            if (cellContainer.getCell(x, 1 + i).walls.bottom) numWallA++;
            if (cellContainer.getCell(x, 8 + i).walls.bottom) numWallB++;
          }
          expect(numWallA).toBe(1);
          expect(numWallB).toBe(1);
        }
      });
    });
  });
  describe("ゴール", () => {
    describe("左上、右上、左下、右下の区画ごとのルール", () => {
      const sections = [
        { name: "左上", xRange: [0, 0.5], yRange: [0, 0.5] },
        { name: "右上", xRange: [0.5, 1], yRange: [0, 0.5] },
        { name: "右下", xRange: [0.5, 1], yRange: [0.5, 1] },
        { name: "左下", xRange: [0, 0.5], yRange: [0.5, 1] }
      ];

      for (const { name, xRange, yRange } of sections) {
        const minX = BOARD_SIZE * xRange[0];
        const maxX = BOARD_SIZE * xRange[1];
        const minY = BOARD_SIZE * yRange[0];
        const maxY = BOARD_SIZE * yRange[1];

        test(`通常ゴールは4つ section:${name}`, () => {
          const cellContainer = new CellContainer(createRuledCellArray());
          const goals = cellContainer
            .getAllMarkedCells()
            .filter(cell => cell.mark !== WildMark)
            .filter(cell => minX <= cell.x && cell.x < maxX)
            .filter(cell => minY <= cell.y && cell.y < maxY);

          expect(goals.length).toBe(4);
        });
        test(`通常ゴールは全て違う色・形・壁の向き section:${name}`, () => {
          const cellContainer = new CellContainer(createRuledCellArray());
          const goals = cellContainer
            .getAllMarkedCells()
            .filter(cell => cell.mark !== WildMark)
            .filter(cell => minX <= cell.x && cell.x < maxX)
            .filter(cell => minY <= cell.y && cell.y < maxY);

          const colors = goals.map(goal => goal.mark!.color);
          expect(colors).toEqual(expect.arrayContaining(StandardColors.slice(0)));

          const shapes = goals.map(goal => goal.mark!.shape);
          expect(shapes).toEqual(expect.arrayContaining(StandardShapes.slice(0)));

          const wallDirs = goals.map(goal => goal.walls);
          expect(wallDirs).toEqual(
            expect.arrayContaining([
              { top: true, right: true, bottom: false, left: false },
              { top: false, right: true, bottom: true, left: false },
              { top: false, right: false, bottom: true, left: true },
              { top: true, right: false, bottom: false, left: true }
            ] satisfies Record<Dir, boolean>[])
          );
        });
      }
    });
    test("ワイルドゴールの壁の向きは中央", () => {
      const cellContainer = new CellContainer(createRuledCellArray());
      const { x, y, walls } = cellContainer.getMarkedCell(WildMark);

      if (x < BOARD_SIZE / 2) {
        expect(!walls.left && walls.right).toBe(true);
      } else {
        expect(walls.left && !walls.right).toBe(true);
      }
      if (y < BOARD_SIZE / 2) {
        expect(!walls.top && walls.bottom).toBe(true);
      } else {
        expect(walls.top && !walls.bottom).toBe(true);
      }
    });
    test("ゴールは外周と中央4x4を除いた場所に存在する", () => {
      const cellContainer = new CellContainer(createRuledCellArray());
      for (const { x, y, mark } of cellContainer.getAllMarkedCells()) {
        expect(mark).toBeDefined();
        expect(0 < x && x < BOARD_SIZE).toBe(true);
        expect(0 < y && y < BOARD_SIZE).toBe(true);
        expect(6 <= x && x <= 9 && 6 <= y && y <= 9).toBe(false);
      }
    });
    test("ゴールの周囲８マスにゴールは存在してはダメ", () => {
      const cellContainer = new CellContainer(createRuledCellArray());
      for (const goal of cellContainer.getAllMarkedCells()) {
        expect(cellContainer.getCell(goal.x - 1, goal.y - 1).mark).toBeUndefined();
        expect(cellContainer.getCell(goal.x - 1, goal.y).mark).toBeUndefined();
        expect(cellContainer.getCell(goal.x - 1, goal.y + 1).mark).toBeUndefined();
        expect(cellContainer.getCell(goal.x, goal.y - 1).mark).toBeUndefined();
        expect(cellContainer.getCell(goal.x, goal.y + 1).mark).toBeUndefined();
        expect(cellContainer.getCell(goal.x + 1, goal.y - 1).mark).toBeUndefined();
        expect(cellContainer.getCell(goal.x + 1, goal.y).mark).toBeUndefined();
        expect(cellContainer.getCell(goal.x + 1, goal.y + 1).mark).toBeUndefined();
      }
    });
    test("ゴールの壁と上下左右のマスの壁がくっつかない", () => {
      const cellContainer = new CellContainer(createRuledCellArray());
      for (const goal of cellContainer.getAllMarkedCells()) {
        const top = cellContainer.getCell(goal.x, goal.y - 1);
        const right = cellContainer.getCell(goal.x + 1, goal.y);
        const bottom = cellContainer.getCell(goal.x, goal.y + 1);
        const left = cellContainer.getCell(goal.x - 1, goal.y);
        if (goal.walls.top) {
          expect(!top.walls.left && !top.walls.right).toBe(true);
          expect(!left.walls.top).toBe(true);
          expect(!right.walls.top).toBe(true);
        }
        if (goal.walls.right) {
          expect(!right.walls.top && !right.walls.bottom).toBe(true);
          expect(!top.walls.right).toBe(true);
          expect(!bottom.walls.right).toBe(true);
        }
        if (goal.walls.bottom) {
          expect(!bottom.walls.left && !bottom.walls.right).toBe(true);
          expect(!left.walls.bottom).toBe(true);
          expect(!right.walls.bottom).toBe(true);
        }
        if (goal.walls.left) {
          expect(!left.walls.top && !left.walls.bottom).toBe(true);
          expect(!top.walls.left).toBe(true);
          expect(!bottom.walls.left).toBe(true);
        }
      }
    });
  });
});

/*
Board
* 壁
  * 外周が全て壁で囲われている
  * 中央2x2マスは壁で囲われている
  * ゴールマスは壁が２枚ある（L字）
  * １つのマスに壁は２枚以下（コの字はダメ）
  * 外周の各側面から２枚ずつ壁が伸びている
  * 側面毎に、端２列と中央２列を除いて左右に１枚ずつ
* ゴール
  * 通常のマークのゴールは盤面を4つの正方形で区切ったエリアに各4つずつ
    * １区画内で色は全て別
    * １区画内でマークは全て別
    * 壁の向き（L字の角度）は全て別
  * ワイルドゴールは１つ
  * ワイルドゴールが左上の区画にある時
    * 右側と下側に壁がある
  * ワイルドゴールが右上の区画にある時
    * 下側と左側に壁がある
  * ワイルドゴールが右下の区画にある時
    * 左側と上側に壁がある
  * ワイルドゴールが左下の区画にある時
    * 上側と右側に壁がある
  * ゴールの周囲８マスにゴールは存在してはダメ
  * ゴールマスの上側に壁がある時
    * 上のマスは左右の壁を持っていてはダメ
    * 左右のマスは上の壁を持っていてはダメ
  * ゴールマスの右側に壁がある時
    * 右のマスは上下の壁を持っていてはダメ
    * 上下のマスは右の壁を持っていてはダメ
  * ゴールマスの下側に壁がある時
    * 下のマスは左右に壁を持っていてはダメ
    * 左右のマスは下に壁を持っていてはダメ
  * ゴールマスの左側に壁がある時
    * 左のマスは上下に壁を持っていてはダメ
    * 上下のマスは左に壁を持っていてはダメ
*/

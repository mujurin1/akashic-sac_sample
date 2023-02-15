import { MutableCellContainer } from "../hyperRobot/impl/MutableCellContainer";

describe("HyperRobotState", () => {
  describe("壁", () => {
    test("外周が全て壁で囲われている", () => {
      expect(1 + 2).toBe(2);
    });
  });
});

/**
 * 外周が囲われたセルコンテナを生成する
 */
const createSurroundedCellContainer = (): MutableCellContainer => {
  const cellContainer = new MutableCellContainer();

  for (let x = 0; x < 16; x++) {
    for (let y = 0; y < 16; y++) {
      if (x === 0) cellContainer.addWall(x, y, "left");
      else if (x === 15) cellContainer.addWall(x, y, "right");
      if (y === 0) cellContainer.addWall(x, y, "top");
      else if (y === 15) cellContainer.addWall(x, y, "bottom");
    }
  }

  return cellContainer;
};

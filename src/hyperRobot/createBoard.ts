import { createMutableBoard } from "./createMutableBoard";
import { Board } from "./model/Board";
import { Cell } from "./model/Cell";
import { MutableBoard } from "./model/MutableBoard";
import { mutableBoardCheck } from "./mutableBoardCheck";

export const createBoard = (width: number, height: number): Board => {
  let mutableBoard = createMutableBoard();

  let check = mutableBoardCheck(mutableBoard);
  while (!check) {
    mutableBoard = createMutableBoard();
    check = mutableBoardCheck(mutableBoard);
  }
  return toBoard(mutableBoard, width, height);
};

export const toBoard = (board: MutableBoard, width: number, height: number): Board => {
  const cells: Cell[][] = [];
  const markedCells: Cell[] = [];

  for (let y = 0; y < height; y++) {
    cells.push([]);
    for (let x = 0; x < width; x++) {
      const cell = board.getCell(x, y);
      cells[y][x] = cell;
      if (cell.mark != null) markedCells.push(cell);
    }
  }

  return {
    width,
    height,
    getCell(x, y) {
      if (cells[y][x] == null) {
        debugger;
      }

      return cells[y][x];
    },
    getMarkedCell(mark) {
      const cell = markedCells.find(cell => cell.mark === mark);

      if (cell == null)
        throw new Error(`該当するマークのセルが存在しません.
mark:${JSON.stringify(mark)}`);

      return cell;
    }
  };
};

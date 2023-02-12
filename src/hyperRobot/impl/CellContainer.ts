import { BOARD_SIZE } from "../const";
import { Cell } from "../model/Cell";
import { Mark } from "../model/Mark";

export class CellContainer {
  public constructor(
    /** 16x16個のセルを格納された配列 (左上から右下へZ進行) */
    public readonly cells: readonly Cell[]
  ) {}

  public getCell(x: number, y: number): Cell {
    return this.cells[y * BOARD_SIZE + x];
  }

  public getMarkedCell(mark: Mark): Cell {
    return this.cells.find(cell => cell.mark === mark)!;
  }

  public getAllMarkedCells(): Cell[] {
    return this.cells.filter(cell => cell.mark != null);
  }
}

import { Cell } from "./Cell";
import { Mark } from "./Mark";

export interface Board {
  readonly width: number;
  readonly height: number;

  getCell(x: number, y: number): Cell;

  getMarkedCell(mark: Mark): Cell;
}

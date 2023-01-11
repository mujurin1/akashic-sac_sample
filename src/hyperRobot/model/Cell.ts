import { Dir } from "../type";
import { Mark } from "./Mark";

export interface Cell {
  readonly x: number;
  readonly y: number;

  readonly walls: Readonly<Record<Dir, boolean>>;

  readonly mark: Mark | undefined;
}

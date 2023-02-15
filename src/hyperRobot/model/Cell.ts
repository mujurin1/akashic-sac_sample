import { DirRecord } from "../type";
import { Mark } from "./Mark";

export interface Cell {
  readonly x: number;
  readonly y: number;

  /** { [dir]: 壁が存在するか } */
  readonly walls: Readonly<DirRecord>;

  readonly mark: Mark | undefined;
}

import { Cell } from "./Cell";

export interface Board {
  readonly width: number;
  readonly height: number;
  readonly cells: readonly (readonly Cell[])[];
}

import { StandardColor } from "../type";

export interface Piece {
  readonly color: StandardColor;

  readonly startX: number;
  readonly startY: number;
  readonly x: number;
  readonly y: number;
}

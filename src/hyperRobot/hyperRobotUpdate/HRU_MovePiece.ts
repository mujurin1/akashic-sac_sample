import { Point, StandardColor } from "../type";
import { HRU } from "./HRU";

/**
 * 駒が移動した
 */
export interface HRU_MovePiece extends HRU {
  readonly name: "movePiece";
  /**
   * 移動したピースの色
   */
  readonly color: StandardColor;
  /**
   * 移動先
   */
  readonly point: Point;
}

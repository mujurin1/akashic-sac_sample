import { Point } from "../type";
import { HRU } from "./HRU";

/**
 * 駒がゴールに到達した
 */
export interface HRU_Goal extends HRU {
  readonly name: "goal";

  /**
   * ゴールのセル座標
   */
  readonly goalPoint: Point;
}

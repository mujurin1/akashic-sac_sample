import { range } from "../../utils/funcs";
import { randomInt } from "../../utils/randomInt";
import { BOARD_SIZE } from "../const";
import { Piece } from "../model/Piece";
import { Point, StandardColors, StandardColor } from "../type";
import { CellContainer } from "./CellContainer";
import { HyperRobotState } from "./HyperRobotState";

/**
 * ボードの初期配置の駒を返す
 * ### ルール
 * * ゴールの上はダメ
 * * 中央４マスはダメ
 * @returns 駒配列 (サイズ4固定)
 */
export const createRuledPieces = (cellContainer: CellContainer): readonly Piece[] => {
  const xs = range(0, BOARD_SIZE);
  const ys = range(0, BOARD_SIZE);
  let piecePoints: Point[] = xs.flatMap(x => {
    return ys.map(y => ({ x, y }));
  });

  piecePoints = piecePoints.filter(
    point => point.x < 7 || 8 < point.x || point.y < 7 || 8 < point.y
  );

  piecePoints = piecePoints.filter(point => cellContainer.getCell(point.x, point.y).mark == null);

  return StandardColors.map(color => {
    const index = randomInt(piecePoints.length);
    const point = piecePoints.splice(index, 1)[0];

    return {
      color,
      startX: point.x,
      startY: point.y,
      x: point.x,
      y: point.y
    };
  });
};

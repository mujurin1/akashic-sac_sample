import { createBoard } from "./createBoard";
import { boardWidth, boardHeight } from "./createMutableBoard";
import { range, randomInt } from "../utils/funcs";
import { Board } from "./model/Board";
import { Mark, StandardMarks, WildMark } from "./model/Mark";
import { StandardColors, Dir, Dirs, Point, StandardColor } from "./type";
import { HyperRobot } from "./model/HyperRobot";

export const createHyperRobot = (): HyperRobot => {
  const board = createBoard(boardWidth, boardHeight);
  const pieceRecored = createInitPieces(board);
  const pieces = StandardColors.map(color => pieceRecored[color]);

  let remainedMarks = [
    ...StandardMarks.circle,
    ...StandardMarks.square,
    ...StandardMarks.triangle,
    ...StandardMarks.star,
    WildMark
  ];

  let targetMark: Mark = WildMark;

  const existPiece = (x: number, y: number): boolean =>
    pieces.some(_piece => _piece.x === x && _piece.y === y);

  const game: HyperRobot = {
    board,
    getRemainingTargets() {
      return remainedMarks;
    },
    getAllPiece() {
      return pieces;
    },
    calcPieceMoveDirs(color) {
      const piece = pieceRecored[color];
      const cell = board.getCell(piece.x, piece.y);

      let dirs = Dirs.filter(dir => !cell.walls[dir]);
      dirs = dirs.filter(dir => {
        const dirPoint = Dir.toPoint(dir);
        return !existPiece(piece.x + dirPoint.x, piece.y + dirPoint.y);
      });

      return dirs;
    },
    getTarget() {
      return targetMark;
    },
    removeTarget(target) {
      remainedMarks = remainedMarks.filter(mark => mark !== target);
    },
    changeTarget() {
      targetMark = remainedMarks[randomInt(remainedMarks.length - 1)];
    },
    movePiece(color, dir) {
      const piece = pieceRecored[color];
      const dirPoint = Dir.toPoint(dir);
      let x = piece.x;
      let y = piece.y;

      let cell = board.getCell(x, y);

      while (!cell.walls[dir] && !existPiece(x + dirPoint.x, y + dirPoint.y)) {
        x += dirPoint.x;
        y += dirPoint.y;
        cell = board.getCell(x, y);
      }

      if (piece.x === y && piece.y === y) return false;

      piece.x = x;
      piece.y = y;

      return true;
    },
    resetAllPiecePoint() {
      pieces.forEach(piece => {
        piece.x = piece.startX;
        piece.y = piece.startY;
      });
    },
    checkGoal() {
      const cell = board.getMarkedCell(targetMark);

      if (cell.mark == null)
        throw new Error(`目標のマークのセルにマークがありません
targetMark:${JSON.stringify(cell)}
mark:${JSON.stringify(targetMark)}`);

      const piece = pieces.find(piece => piece.x === cell.x && piece.y === cell.y);

      if (piece == null) return false;

      return piece.color === cell.mark.color || cell.mark === WildMark;
    }
  };

  return game;
};

interface MutablePiece {
  color: StandardColor;

  startX: number;
  startY: number;
  x: number;
  y: number;
}

/**
 * ボードの初期配置の駒を返す
 * ### ルール
 * * ゴールの上はダメ
 * * 中央４マスはダメ
 */
const createInitPieces = (board: Board): Record<StandardColor, MutablePiece> => {
  const xs = range(0, board.width);
  const ys = range(0, board.height);
  let piecePoints: Point[] = xs.flatMap(x => {
    return ys.map(y => ({ x, y }));
  });

  piecePoints = piecePoints.filter(
    point => point.x < 7 || 8 < point.x || point.y < 7 || 8 < point.y
  );

  piecePoints = piecePoints.filter(point => board.getCell(point.x, point.y).mark == null);

  return StandardColors.reduce((record, color) => {
    const index = randomInt(piecePoints.length);
    const point = piecePoints.splice(index, 1)[0];

    return {
      ...record,
      [color]: {
        color,
        startX: point.x,
        startY: point.y,
        x: point.x,
        y: point.y
      } satisfies MutablePiece
    };
  }, {} as Record<StandardColor, MutablePiece>);
};

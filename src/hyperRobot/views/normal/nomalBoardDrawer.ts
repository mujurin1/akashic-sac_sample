import { CanvasEntity } from "../../../CanvasEntity";
import { HyperRobot } from "../../model/HyperRobot";
import { Board } from "../../model/Board";
import { Cell } from "../../model/Cell";
import { Piece } from "../../model/Piece";
import { StandardShape, WildShape } from "../../type";
import {
  cellOuterColor,
  cellOuterWidth,
  cellPointToPxPoint,
  cellSize,
  centerColor,
  cornerSize,
  cornerColor,
  floorColor,
  middleColor,
  cellCenter,
  pieceColor,
  pieceRadius,
  pieceStartSize,
  wallColor,
  wallHeight,
  wallPaddingX,
  wallPaddingYFromCorner,
  wallWidth,
  cellOuterMargine,
  middleFloorX,
  middleFloorSize,
  centerFloorSize,
  centerFloorX,
  pieceStartX,
  goalColor
} from "./constNormal";

export const createNomalBoardImage = (hyperRobot: HyperRobot): CanvasImageSource => {
  const board = hyperRobot.board;

  const cnv = document.createElement("canvas");
  cnv.width = cellSize * board.width + cornerSize;
  cnv.height = cellSize * board.height + cornerSize;
  const ctx = cnv.getContext("2d")!;

  ctx.fillStyle = floorColor;
  ctx.fillRect(0, 0, cnv.width, cnv.height);

  for (let x = 0; x < board.width; x++) {
    for (let y = 0; y < board.height; y++) {
      drawCell(ctx, board.getCell(x, y));
    }
  }

  drawOuter(ctx, board);

  return cnv;
};

export const drawPiece = (canvasEntity: CanvasEntity, piece: Piece): void => {
  const ctx = canvasEntity.context;

  ctx.save();

  const startPxPoint = cellPointToPxPoint(piece.startX, piece.startY);
  ctx.translate(startPxPoint.x, startPxPoint.y);
  ctx.fillStyle = pieceColor[piece.color].start;
  ctx.fillRect(pieceStartX, pieceStartX, pieceStartSize, pieceStartSize);
  ctx.restore();
  ctx.save();

  const pxPoint = cellPointToPxPoint(piece.x, piece.y);
  ctx.translate(pxPoint.x, pxPoint.y);
  ctx.fillStyle = pieceColor[piece.color].piece;
  ctx.beginPath();
  ctx.arc(cellCenter, cellCenter, pieceRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
};

const drawOuter = (ctx: CanvasRenderingContext2D, board: Board): void => {
  const allWallCell = {
    x: 0,
    y: 0,
    mark: undefined,
    walls: { top: true, right: true, bottom: true, left: true }
  } satisfies Cell;

  // 今の描画ロジックの場合、右と下の外周だけで良い
  for (let x = 0; x < board.width + 1; x++) {
    allWallCell.x = x;
    allWallCell.y = board.height;
    drawCell(ctx, allWallCell);
  }
  for (let y = 0; y < board.height + 1; y++) {
    allWallCell.x = board.width;
    allWallCell.y = y;
    drawCell(ctx, allWallCell);
  }
};

const drawCell = (ctx: CanvasRenderingContext2D, cell: Cell): void => {
  ctx.save();
  ctx.translate(cell.x * cellSize, cell.y * cellSize);

  // 外周
  ctx.fillStyle = cellOuterColor;
  ctx.fillRect(cellOuterMargine, cellOuterMargine, cellOuterWidth, cellSize);
  ctx.fillRect(cellOuterMargine, cellOuterMargine, cellSize, cellOuterWidth);

  // 床
  ctx.fillStyle = middleColor;
  ctx.fillRect(middleFloorX, middleFloorX, middleFloorSize, middleFloorSize);

  ctx.fillStyle = centerColor;
  ctx.fillRect(centerFloorX, centerFloorX, centerFloorSize, centerFloorSize);

  // ゴール
  drawGoal(ctx, cell);

  // 壁
  ctx.fillStyle = wallColor;
  if (cell.walls["left"]) {
    ctx.fillRect(wallPaddingX, cornerSize + wallPaddingYFromCorner, wallWidth, wallHeight);
  }
  if (cell.walls["top"]) {
    ctx.fillRect(cornerSize + wallPaddingYFromCorner, wallPaddingX, wallHeight, wallWidth);
  }

  // 角
  ctx.fillStyle = cornerColor;
  ctx.fillRect(0, 0, cornerSize, cornerSize);

  ctx.restore();
};

const drawGoal = (ctx: CanvasRenderingContext2D, cell: Cell): void => {
  const mark = cell.mark;
  if (mark == null) return;

  ctx.fillStyle = goalColor[mark.color].color;
  ctx.strokeStyle = goalColor[mark.color].color;
  ctx.lineWidth = 2;

  const center = cornerSize + cellCenter;

  // 円
  if (mark.shape === StandardShape.circle) {
    ctx.beginPath();
    ctx.arc(center, center, (centerFloorSize + 4) / 2, 0, Math.PI * 2);
    // ctx.arc(center, center, 11, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(center, center, (centerFloorSize - 2) / 2, 0, Math.PI * 2);
    // ctx.arc(center, center, 8, 0, Math.PI * 2);
    ctx.fill();
  }
  // 四角
  else if (mark.shape === StandardShape.square) {
    ctx.strokeRect(centerFloorX - 1, centerFloorX - 1, centerFloorSize + 2, centerFloorSize + 2);
    ctx.fillRect(centerFloorX + 2, centerFloorX + 2, centerFloorSize - 4, centerFloorSize - 4);
    // ctx.strokeRect(13, 13, 20, 20);
    // ctx.fillRect(16, 16, 14, 14);
  }
  // 三角
  else if (mark.shape === StandardShape.triangle) {
    ctx.beginPath();
    ctx.moveTo(22, 11);
    ctx.lineTo(33, 33);
    ctx.lineTo(11, 33);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(22, 18);
    ctx.lineTo(28, 30);
    ctx.lineTo(16, 30);
    ctx.closePath();
    ctx.fill();
  }
  // 星
  else if (mark.shape === StandardShape.star) {
    ctx.beginPath();
    //prettier-ignore
    {
      ctx.moveTo(23, 11); // 上
        ctx.lineTo(26, 20);
      ctx.lineTo(34, 20); // 右
        ctx.lineTo(28, 25);
      ctx.lineTo(30, 33); // 右下
        ctx.lineTo(23, 28);
      ctx.lineTo(16, 33); // 左下
        ctx.lineTo(18, 25);
      ctx.lineTo(12, 20); // 左
        ctx.lineTo(20, 20);
    }
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    //prettier-ignore
    {
      ctx.moveTo(23, 18); // 上
        ctx.lineTo(24, 22);
      ctx.lineTo(28, 22); // 右
        ctx.lineTo(25, 24);
      ctx.lineTo(26, 27); // 右下
        ctx.lineTo(24, 25);
      ctx.lineTo(20, 27); // 左下
        ctx.lineTo(21, 24);
      ctx.lineTo(18, 22); // 左
        ctx.lineTo(22, 22);
    }
    ctx.closePath();
    ctx.fill();
  }
  // WILD
  else if (mark.shape === WildShape) {
    ctx.beginPath();
    const gradient = ctx.createRadialGradient(
      center,
      center,
      2,
      center,
      center,
      (centerFloorSize + 2) / 2
    );
    gradient.addColorStop(0.0, "#ea3231");
    gradient.addColorStop(0.5, "#fcdc31");
    gradient.addColorStop(1.0, "#973abf");
    ctx.fillStyle = gradient;
    ctx.arc(center, center, (centerFloorSize + 4) / 2, 0, Math.PI * 2);
    ctx.fill();
  }
};

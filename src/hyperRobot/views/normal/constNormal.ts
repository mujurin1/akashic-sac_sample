import { StandardColor, Point } from "../../type";

/*
 * ピクセル座標・サイズ
 */
export const boardX = 0;
export const boardY = 0;

export const cellSize = 40;
const oddNumberGap = cellSize % 2;
const evenNumberGap = (cellSize + 1) % 2;

// 角を奇数にしたい場合は cellSize を奇数にすること

// 角
const _cornerSize = 6; // 絶対に偶数にすべき
export const cornerSize = _cornerSize + oddNumberGap;
export const cellCenter = (cellSize - oddNumberGap) / 2 - (_cornerSize / 2 + oddNumberGap);
// 外周
export const cellOuterMargine = _cornerSize / 2 - evenNumberGap;
const _cellOuterWidth = 1;
export const cellOuterWidth = _cellOuterWidth + evenNumberGap;
// 床
export const middleFloorMargineFromCorner = 2;
export const middleFloorX = cornerSize + middleFloorMargineFromCorner;
export const middleFloorSize = cellSize - (middleFloorX + middleFloorMargineFromCorner);
export const centerFloorMargineFromMiddle = 6;
export const centerFloorX = middleFloorX + centerFloorMargineFromMiddle;
export const centerFloorSize = middleFloorSize - centerFloorMargineFromMiddle * 2;

// 壁 (左の壁の位置)
export const wallPaddingX = 1;
export const wallPaddingYFromCorner = 1;
export const wallWidth = cornerSize - wallPaddingX * 2;
export const wallHeight = cellSize - (cornerSize + wallPaddingYFromCorner * 2);
// 駒の初期位置
export const pieceStartSize = centerFloorSize;
export const pieceStartX = cellCenter - pieceStartSize / 2;
export const pieceStartHalf = pieceStartSize / 2;
// 駒 (円
export const pieceSize = middleFloorSize;
export const pieceRadius = pieceSize / 2;

/**
 * 色
 */

// 角
export const cornerColor = "hsl(000, 00%, 00%)";
// 床
// export const floorColor = "hsl(225, 30%,  78%)";
// export const middleColor = "hsl(225, 30%, 75%)";
// export const centerColor = "hsl(225, 30%, 80%)";
export const floorColor = "hsl(225, 30%,  78%)";
export const middleColor = "hsl(225, 30%, 75%)";
export const centerColor = "hsl(225, 30%, 80%)";
// 外周
export const cellOuterColor = "rgba(0,0,0,0.3)";
// 壁
export const wallColor = "hsl(360, 30%, 10%)";
// 駒
export const pieceColor = {
  [StandardColor.red]: {
    piece: "hsl(360, 90%, 65%)",
    start: "hsl(360, 90%, 50%)"
  },
  [StandardColor.blue]: {
    piece: "hsl(240, 90%, 65%)",
    start: "hsl(240, 90%, 50%)"
  },
  [StandardColor.green]: {
    piece: "hsl(120, 80%, 65%)",
    start: "hsl(120, 85%, 50%)"
  },
  [StandardColor.yellow]: {
    piece: "hsl(60, 70%, 65%)",
    start: "hsl(60, 80%, 50%)"
  }
} as const;
// ゴール
export const goalColor = {
  [StandardColor.red]: {
    color: "hsl(360, 90%, 40%)"
    // start: "hsl(360, 90%, 50%)"
  },
  [StandardColor.blue]: {
    color: "hsl(240, 90%, 40%)"
    // start: "hsl(240, 90%, 50%)"
  },
  [StandardColor.green]: {
    color: "hsl(120, 80%, 40%)"
    // start: "hsl(120, 85%, 50%)"
  },
  [StandardColor.yellow]: {
    color: "hsl(60, 80%, 50%)"
    // start: "hsl(60, 80%, 50%)"
  },
  ["wild"]: {
    color: ""
  }
} as const;

/*
 * 以下関数定義
 */

export const cellPointToPxPoint = (x: number, y: number): Point => ({
  x: cornerSize + x * cellSize,
  y: cornerSize + y * cellSize
});

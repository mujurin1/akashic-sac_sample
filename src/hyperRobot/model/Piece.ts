import { Color } from "../type";

export interface Piece {
  readonly type: PieceType;

  startX: number;
  startY: number;
  x: number;
  y: number;
}

export const Piece = {
  new(type: PieceType, startX: number = 0, startY: number = 0): Piece {
    return {
      type,
      startX,
      startY,
      x: startX,
      y: startY
    };
  }
};

export interface PieceType {
  readonly color: Color;
  /** アセット画像のID */
  readonly src: string;
}

export const PieceType = {
  red: {
    color: "red",
    src: ""
  },
  blue: {
    color: "blue",
    src: ""
  },
  green: {
    color: "green",
    src: ""
  },
  yellow: {
    color: "yellow",
    src: ""
  }
} as const satisfies Record<Color, PieceType>;

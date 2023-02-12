/*
 * 方向
 */
export const Dir = {
  top: "top",
  bottom: "bottom",
  left: "left",
  right: "right"
} as const;
export type Dir = typeof Dir[keyof typeof Dir];
export const Dirs = [Dir.top, Dir.bottom, Dir.left, Dir.right] as const;

export const dirToPoint = (dir: Dir): Point => {
  switch (dir) {
    case "top":
      return { x: 0, y: -1 };
    case "right":
      return { x: 1, y: 0 };
    case "bottom":
      return { x: 0, y: 1 };
    case "left":
      return { x: -1, y: 0 };
  }
};

// export type Dir = "top" | "bottom" | "left" | "right";
// export const Dirs = ["top", "bottom", "left", "right"] as const;
// export const Dir = {
//   toPoint(dir: Dir): Point {
//     switch (dir) {
//       case "top":
//         return { x: 0, y: -1 };
//       case "right":
//         return { x: 1, y: 0 };
//       case "bottom":
//         return { x: 0, y: 1 };
//       case "left":
//         return { x: -1, y: 0 };
//     }
//   }
// };

export type DirRecord = {
  [Dir.top]: boolean;
  [Dir.right]: boolean;
  [Dir.bottom]: boolean;
  [Dir.left]: boolean;
};

export type Point = {
  x: number;
  y: number;
};

/**
 * 形
 */
export const StandardShape = {
  circle: "circle",
  square: "square",
  triangle: "triangle",
  star: "star"
} as const;
export type StandardShape = typeof StandardShape[keyof typeof StandardShape];
export const StandardShapes = ["circle", "square", "triangle", "star"] as const;

export const WildShape = "wild";
export type WildShape = typeof WildShape;

/**
 * 色
 */
export const StandardColor = {
  red: "red",
  blue: "blue",
  green: "green",
  yellow: "yellow"
} as const;
export const StandardColors = ["red", "blue", "green", "yellow"] as const;
export type StandardColor = typeof StandardColor[keyof typeof StandardColor];

export const WildColor = "wild";
export type WildColor = typeof WildColor;

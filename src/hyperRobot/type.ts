export const Color = {
  red: "red",
  blue: "blue",
  green: "green",
  yellow: "yellow"
} as const;
export const Colors = ["red", "blue", "green", "yellow"] as const;

export type Color = typeof Color[keyof typeof Color];

export type Point = {
  x: number;
  y: number;
};

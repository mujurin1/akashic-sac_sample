import { Color } from "../type";

export interface Goal {
  readonly color: Color | "wild";
  /** アセット画像のID */
  readonly src: string;
}

let a = [Color.red, Color.blue, Color.green, Color.yellow] as const;
a.reduce((prev, current) => {
  return {};
}, []);

const colorToGoal = (color: Color, fix: string): Goal => ({
  color,
  src: "goal_" + color + fix
});

export const Goal = {
  nomals: ["_1", "_2", "_3", "_4"].reduce((prev, current) => {
    prev.push(colorToGoal(Color.red, current));
    prev.push(colorToGoal(Color.blue, current));
    prev.push(colorToGoal(Color.green, current));
    prev.push(colorToGoal(Color.yellow, current));
    return prev;
  }, [] as Goal[]),
  wild: {
    color: "wild",
    src: "goal_wild"
  } satisfies Goal
} as const;

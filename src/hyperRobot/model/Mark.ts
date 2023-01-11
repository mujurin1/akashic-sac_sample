import { StandardColor, StandardColors, StandardShape, WildColor, WildShape } from "../type";

export type MarkColor = StandardColor | WildColor;
export const MarkColor = {
  ...StandardColor,
  WildColor
} as const;
export type MarkShape = StandardShape | WildShape;

export interface Mark {
  readonly color: MarkColor;
  readonly shape: MarkShape;
}

export const StandardMarks = {
  [StandardShape.circle]: StandardColors.map(color => ({
    shape: StandardShape.circle,
    color
  })) as Readonly<Mark[]>,
  [StandardShape.square]: StandardColors.map(color => ({
    shape: StandardShape.square,
    color
  })) as Readonly<Mark[]>,
  [StandardShape.triangle]: StandardColors.map(color => ({
    shape: StandardShape.triangle,
    color
  })) as Readonly<Mark[]>,
  [StandardShape.star]: StandardColors.map(color => ({
    shape: StandardShape.star,
    color
  })) as Readonly<Mark[]>
} as const;

export const WildMark = {
  shape: WildShape,
  color: WildColor
} as const satisfies Mark;

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
  })) as readonly Mark[],
  [StandardShape.square]: StandardColors.map(color => ({
    shape: StandardShape.square,
    color
  })) as readonly Mark[],
  [StandardShape.triangle]: StandardColors.map(color => ({
    shape: StandardShape.triangle,
    color
  })) as readonly Mark[],
  [StandardShape.star]: StandardColors.map(color => ({
    shape: StandardShape.star,
    color
  })) as readonly Mark[]
} as const;

export const WildMark = {
  shape: WildShape,
  color: WildColor
} as const satisfies Mark;

export const AllStandardMarks = [
  ...StandardMarks.circle,
  ...StandardMarks.square,
  ...StandardMarks.triangle,
  ...StandardMarks.star
] as const;

export const AllMarks = [...AllStandardMarks, WildMark];

import { Goal } from "./Goal";

export interface Cell {
  readonly isLeftWall: boolean;
  readonly isTopWall: boolean;
  readonly isRightWall: boolean;
  readonly isBottomWall: boolean;
  readonly goal: Goal | undefined;
}

// export const Cell = {
//   new(rightWall: boolean, bottomWall: boolean): Cell {
//     return {
//       rightWall,
//       bottomWall,
//       goal: undefined
//     };
//   }
// };

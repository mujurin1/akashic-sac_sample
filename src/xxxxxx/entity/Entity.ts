export interface Entity {
  x: number;
  y: number;
  width: number;
  height: number;
  hide: boolean;

  touchable: boolean;

  children?: Entity[];

  onPointDown?: (ev: g.PointDownEvent) => void;
  onPointMove?: (ev: g.PointMoveEvent) => void;
  onPointUp?: (ev: g.PointUpEvent) => void;
  onUpdate?: () => void;
}

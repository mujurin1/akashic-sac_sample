import { Entity } from "../entity/Entity";

export class CanvasEntity implements Entity {
  x: number = 0;
  y: number = 0;
  width: number = 0;
  height: number = 0;
  hide: boolean = false;

  touchable: boolean;

  children?: CanvasEntity[];

  onPointDown?: (ev: g.PointDownEvent) => void;
  onPointMove?: (ev: g.PointMoveEvent) => void;
  onPointUp?: (ev: g.PointUpEvent) => void;
  onUpdate?: () => void;

  constructor() {}

  render(ctx: CanvasRenderingContext2D): void {
    if (this.hide) return;

    this.renderSelf(ctx);

    this.renderChildren(ctx);
  }

  renderSelf(ctx: CanvasRenderingContext2D): void {}

  renderChildren(ctx: CanvasRenderingContext2D): void {
    if (this.children == null) return;

    for (const child of this.children) {
      ctx.save();

      child.renderSelf(ctx);

      ctx.restore();
    }
  }
}

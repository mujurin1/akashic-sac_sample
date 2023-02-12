import { Box, BoxLayout } from "../entity/Box";
import { CanvasEntity } from "./CanvasEntity";

export class CanvasBox extends CanvasEntity implements Box {
  layout: BoxLayout;
  color: string;

  renderSelf(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  renderChildren(ctx: CanvasRenderingContext2D): void {
    if (this.children == null) return;
  }
}

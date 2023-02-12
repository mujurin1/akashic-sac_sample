import { Label } from "../entity/Label";
import { CanvasEntity } from "./CanvasEntity";

export class CanvasLabel extends CanvasEntity implements Label {
  text: string;
  color: string;
  font: string;
  fontSize: number;

  renderSelf(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.font = `${this.fontSize}px ${this.font}`;
    ctx.fillText(this.text, this.x, this.y);
  }
}

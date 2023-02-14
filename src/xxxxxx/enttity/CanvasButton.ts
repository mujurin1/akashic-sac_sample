import { Point } from "../../hyperRobot/type";
import { CanvasLabel } from "./CanvasLabel";

export class CanvasButton extends CanvasLabel {
  backgroundColor: string = "#888";
  touchable: boolean = true;
  margine: Point = { x: 0, y: 0 };

  renderSelf(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.fillStyle = this.textColor;
    ctx.font = `${this.fontSize}px ${this.font}`;
    // ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
    ctx.fillText(this.text, this.width / 2, this.height / 2);
  }
}

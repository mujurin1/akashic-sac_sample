import { Point } from "../../hyperRobot/type";
import { CanvasEntity } from "./CanvasEntity";

export class CanvasElipse extends CanvasEntity {
  color: string = "red";

  renderSelf(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.fillStyle = this.color;

    ctx.ellipse(
      // this.x + this.width / 2,
      // this.y + this.height / 2,
      this.width / 2,
      this.height / 2,
      this.width / 2,
      this.height / 2,
      0, // 傾き
      0, // 楕円が始まる角度？？？
      2 * Math.PI
    );
    ctx.fill();
  }
}

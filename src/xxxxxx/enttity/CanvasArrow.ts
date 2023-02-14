import { CanvasEntity } from "./CanvasEntity";

/**
 * angle:0 の場合、右向きの矢印
 */
export class CanvasArrow extends CanvasEntity {
  color: string = "gray";
  borderColor: string = "red";
  borderWidth: number = 5;

  override(entity: CanvasArrow): this {
    this.color = entity.color;
    this.borderColor = entity.borderColor;
    this.borderWidth = entity.borderWidth;

    return super.override(entity);
  }

  arrowStyle(color: string, borderColor: string, borderWidth: number): this {
    this.color = color;
    this.borderColor = borderColor;
    this.borderWidth = borderWidth;

    return this;
  }

  renderSelf(ctx: CanvasRenderingContext2D) {
    // const x1 = this.width * (1 / 3);
    const x2 = this.width * (1 / 2);
    const x3 = this.width;
    const y1 = this.height * (2 / 7);
    const y2 = this.height - y1;
    const y3 = this.height;

    ctx.fillStyle = "gray";
    ctx.strokeStyle = "red";
    ctx.lineWidth = this.borderWidth;
    ctx.beginPath();

    ctx.moveTo(0, y1);
    ctx.lineTo(x2, y1);
    ctx.lineTo(x2, 0);
    ctx.lineTo(x3, this.height / 2);
    ctx.lineTo(x2, y3);
    ctx.lineTo(x2, y2);
    ctx.lineTo(0, y2);
    ctx.closePath();

    ctx.fill();
    ctx.stroke();
  }
}

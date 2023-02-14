import { CanvasBox } from "./CanvasBox";
import { CanvasEntity } from "./CanvasEntity";

export class CanvasSeparator extends CanvasEntity {
  gap: number = 0;

  /**
   * キャンバスボックスに合うように自身を整形する
   * @param canvasBox
   * @param cross それまでに改行した分の幅
   */
  make(canvasBox: CanvasBox, cross: number): void {
    if (canvasBox.boxLayout.orientation === "holizontal") {
      this.x = 0;
      this.y = cross;
      this.width = canvasBox.width;
      this.height = this.gap;
    } else {
      this.x = cross;
      this.y = 0;
      this.width = this.gap;
      this.height = canvasBox.height;
    }
  }

  renderSelf(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "black";
    // ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fillRect(0, 0, this.width, this.height);

    return false;
  }
}

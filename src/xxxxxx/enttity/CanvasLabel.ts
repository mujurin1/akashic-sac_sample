import { CanvasEntity } from "./CanvasEntity";

export class CanvasLabel extends CanvasEntity {
  text: string = "";
  textColor: string = "#000";
  font: string = "serif";
  fontSize: number = 10;

  override(entity: this): this {
    this.text = entity.text;
    this.textColor = entity.textColor;
    this.font = entity.font;
    this.fontSize = entity.fontSize;

    return super.override(entity);
  }

  setText(text: string, color: string): this {
    this.text = text;
    this.textColor = color;
    return this;
  }

  setFont(font: string, fontSize: number): this {
    this.font = font;
    this.fontSize = fontSize;
    return this;
  }

  renderSelf(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.textColor;
    ctx.font = `${this.fontSize}px ${this.font}`;
    // ctx.fillText(this.text, this.x, this.y);
    // ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
    ctx.fillText(this.text, this.width / 2, this.height / 2);
  }
}

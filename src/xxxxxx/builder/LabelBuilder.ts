import { Label } from "../entity/Label";
import { Builder } from "./Builder";

export class LabelBuilder<E extends Label> extends Builder<E> {
  text(text: string, color: string): this {
    this.state.text = text;
    this.state.color = color;
    return this;
  }

  font(font: string, fontSize: number): this {
    this.state.font = font;
    this.state.fontSize = fontSize;
    return this;
  }
}

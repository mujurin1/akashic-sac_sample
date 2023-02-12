import { Button } from "../entity/Button";
import { Builder } from "./Builder";

export class ButtonBuilder<E extends Button> extends Builder<E> {
  color(color: string): this {
    this.state.backgroundColor = color;
    return this;
  }

  text(text: string, color: string): this {
    this.state.text = text;
    this.state.textColor = color;
    return this;
  }

  font(font: string, fontSize: number): this {
    this.state.font = font;
    this.state.fontSize = fontSize;
    return this;
  }
}

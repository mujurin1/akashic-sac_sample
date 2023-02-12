import { Box, BoxLayout } from "../entity/Box";
import { Builder } from "./Builder";

export class BoxBuilder<E extends Box> extends Builder<E> {
  color(color: string): this {
    this.state.color = color;
    return this;
  }

  layout(layout: BoxLayout): this {
    this.state.layout = layout;
    return this;
  }
}

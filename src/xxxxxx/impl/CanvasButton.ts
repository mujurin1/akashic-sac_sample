import { Button } from "../entity/Button";
import { CanvasEntity } from "./CanvasEntity";

export class CanvasButton extends CanvasEntity implements Button {
  backgroundColor: string;
  text: string;
  textColor: string;
  font: string;
  fontSize: number;

  renderSelf(ctx: CanvasRenderingContext2D): void {}
}

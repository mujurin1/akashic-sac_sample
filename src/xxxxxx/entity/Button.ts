import { Entity } from "./Entity";

export interface Button extends Entity {
  backgroundColor: string;

  text: string;
  textColor: string;

  font: string;
  fontSize: number;
}

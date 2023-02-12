import { Entity } from "./Entity";

export interface Label extends Entity {
  text: string;
  color: string;

  font: string;
  fontSize: number;
}

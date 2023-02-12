import { Entity } from "./Entity";

export interface BoxLayout {
  orientation: "holizontal" | "vertical";
  gapX: number;
  gapY: number;
}

export interface Box extends Entity {
  layout: BoxLayout;
  color: string;
}

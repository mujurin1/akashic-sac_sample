// import { Point } from "../type";

// export type EntityType = FillRect | Label;

// interface Option<E extends Entity> {
//   // /** タッチイベントを受信する場合にメソッドを指定する */
//   // touched?: (entity: E) => void;
//   touchable: boolean;
// }

// export interface Entity {
//   type: string;
//   x: number;
//   y: number;
//   width: number;
//   height: number;
//   child?: EntityType[];
//   option?: Option<this>;
// }

// export interface FillRect extends Entity {
//   type: "FillRect";
//   color: string;
// }

// export interface Label extends Entity {
//   type: "Label";
//   text: string | (() => string);
//   color: string;
//   font: string;
//   fontSize: number;
// }

// export interface BuilderState {
//   x: number;
//   y: number;
//   fillColor: string;
//   font: string;
//   fontSize: number;

//   entities: EntityType[];
// }

// export class ViewEntityBuilder {
//   private state: BuilderState;

//   constructor(state: BuilderState) {
//     this.state = state;
//   }

//   static creae(): ViewEntityBuilder {
//     return new ViewEntityBuilder({
//       x: 0,
//       y: 0,
//       fillColor: "#000",
//       font: "serif",
//       fontSize: 10,
//       entities: []
//     });
//   }

//   build(): EntityType[] {
//     return this.state.entities;
//   }

//   translate(x: number, y: number): ViewEntityBuilder {
//     this.state.x += x;
//     this.state.y += y;
//     return this;
//   }

//   relative(target: "right" | "bottom" | "rightBottom", x: number, y: number): ViewEntityBuilder {
//     const last = this.state.entities[this.state.entities.length - 1];

//     /* それぞれの計算式が last.width + last.x になっていないのは、
//      * Entityによって元になる座標が違うため、直前のEntityによってズレるため
//      *
//      * 直前のEntityの生成時の`state.x`を利用するとどのEntityでも同じ動作になる
//      */
//     if (target === "right") this.state.x += last.width + x;
//     else if (target === "bottom") this.state.y += last.height + y;
//     else {
//       this.state.x += last.width + x;
//       this.state.y += last.height + y;
//     }

//     return this;
//   }

//   child(fn: (builder: ViewEntityBuilder) => void): ViewEntityBuilder {
//     const parent = this.state.entities[this.state.entities.length - 1];

//     const child = new ViewEntityBuilder({
//       ...this.state,
//       x: 0,
//       y: 0,
//       entities: []
//     });
//     fn(child);

//     parent.child = child.state.entities;

//     return this;
//   }

//   repeat<T>(
//     values: T[],
//     marginX: number,
//     marginY: number,
//     fn: (builder: ViewEntityBuilder, value: T) => void
//   ): ViewEntityBuilder {
//     const save = {
//       x: this.state.x,
//       y: this.state.y
//     };

//     values.forEach((value, index) => {
//       this.state.x = save.x + marginX * index;
//       this.state.y = save.y + marginY * index;
//       fn(this, value);
//     });

//     this.state.x = save.x;
//     this.state.y = save.y;

//     return this;
//   }

//   fillStyle(color: string): ViewEntityBuilder {
//     this.state.fillColor = color;
//     return this;
//   }

//   textStyle(font: string, fontSize: number): ViewEntityBuilder {
//     this.state.font = font;
//     this.state.fontSize = fontSize;
//     return this;
//   }

//   fillRect(
//     x: number,
//     y: number,
//     width: number,
//     height: number,
//     option?: Option<FillRect>
//   ): ViewEntityBuilder {
//     this.state.entities.push({
//       type: "FillRect",
//       x: this.state.x + x,
//       y: this.state.y + y,
//       width,
//       height,
//       color: this.state.fillColor,
//       option
//     });
//     return this;
//   }

//   label(
//     text: string | (() => string),
//     x: number,
//     y: number,
//     width: number,
//     height: number,
//     option?: Option<Label>
//   ): ViewEntityBuilder {
//     this.state.entities.push({
//       type: "Label",
//       x: this.state.x + x,
//       y: this.state.y + y,
//       width,
//       height,
//       color: this.state.fillColor,
//       font: this.state.font,
//       fontSize: this.state.fontSize,
//       text,
//       option
//     } satisfies Label);

//     return this;
//   }
// }

// interface RenderState {
//   x: number;
//   y: number;
// }

// export const ViewEntityRender = (
//   ctx: CanvasRenderingContext2D,
//   entities: EntityType[],
//   state: RenderState = {
//     x: 0,
//     y: 0
//   }
// ): void => {
//   for (const entity of entities) {
//     const x = entity.x + state.x;
//     const y = entity.y + state.y;

//     if (entity.type === "FillRect") {
//       ctx.fillStyle = entity.color;
//       ctx.fillRect(x, y, entity.width, entity.height);
//     } else if (entity.type === "Label") {
//       ctx.fillStyle = entity.color;
//       ctx.font = `${entity.fontSize}px ${entity.font}`;

//       if (typeof entity.text === "string") ctx.fillText(entity.text, x, y);
//       else ctx.fillText(entity.text(), x, y);
//     }

//     if (entity.child != null) {
//       ViewEntityRender(ctx, entity.child, {
//         ...state,
//         x: state.x + entity.x,
//         y: state.y + entity.y
//       });
//     }
//   }
// };

// interface TouchedState {
//   x: number;
//   y: number;
// }

// /**
//  * その座標に反応するエンティティを探し、タッチイベントを実行して返す\
//  * @param entities
//  * @param point
//  * @param state
//  * @returns 見つかったエンティティ. ない場合は`undefined`
//  */
// export const ViewEntityTouched = (
//   entities: Entity[],
//   point: Point,
//   state: TouchedState = {
//     x: 0,
//     y: 0
//   }
// ): Entity | undefined => {
//   for (const entity of [...entities].reverse()) {
//     if (entity.child != null) {
//       const res = ViewEntityTouched(entity.child, point, {
//         ...state,
//         x: state.x + entity.x,
//         y: state.y + entity.y
//       });
//       if (res != null) return res;
//     }

//     if (!entity.option?.touched) continue;

//     const x = entity.x + state.x;
//     const y = entity.y + state.y;
//     //prettier-ignore
//     if (
//       x <= point.x && point.x <= x + entity.width &&
//       y <= point.y && point.y <= y + entity.height
//     ){
//       // entity.option.touched(entity);
//       return entity;
//     }
//   }

//   return undefined;
// };

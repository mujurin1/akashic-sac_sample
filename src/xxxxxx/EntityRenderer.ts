import { CanvasDrawer, Client } from "akashic-sac";
import { CanvasEntity } from "./enttity/CanvasEntity";

export class EntityRenderer {
  public readonly display: g.E;

  public touchEntity: CanvasEntity | undefined;
  public readonly entities: CanvasEntity[] = [];

  public constructor() {
    this.display = g.game.env.createEntity(CanvasDrawer, {
      width: g.game.width,
      height: g.game.height,
      touchable: true,
      pixelScale: 1,
      draw: this.draw.bind(this)
    });
    this.display.onPointDown.add(this.onPointDown.bind(this));
    this.display.onPointMove.add(this.onPointMove.bind(this));
    this.display.onPointUp.add(this.onPointUp.bind(this));
    this.display.onUpdate.add(this.onUpdate.bind(this));

    // キャンバスでの文字の描画位置を調整する
    const ctx = Client.env.context;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
  }

  /**
   * 描画を更新します
   */
  public modified(): void {
    this.display.modified();
  }

  private draw(context: CanvasRenderingContext2D): void {
    this.entities.forEach((entity: CanvasEntity) => {
      entity.render(context);
    });
  }

  private onPointDown(ev: g.PointDownEvent): void {
    for (let i = this.entities.length - 1; i >= 0; i--) {
      const child = this.entities[i];
      const entity = child.checkTouch(ev.point);

      if (entity == null) continue;

      entity.onPointDown?.(ev);
      return;
    }
  }
  private onPointMove(ev: g.PointMoveEvent): void {
    if (this.touchEntity == null) return;

    this.touchEntity?.onPointMove?.(ev);
  }
  private onPointUp(ev: g.PointUpEvent): void {
    if (this.touchEntity == null) return;

    this.touchEntity?.onPointUp?.(ev);
  }

  private onUpdate(): void {
    entityForEach(this.entities, onUpdate);
  }
}

/**
 * 子孫も含めて全てのエンティティに処理を行う
 */
const entityForEach = (entities: readonly CanvasEntity[], fn: (entity: CanvasEntity) => void) => {
  for (const entity of entities) {
    fn(entity);

    entityForEach(entity.children, fn);
  }
};

const onUpdate = (entity: CanvasEntity): void => {
  if (entity.onUpdate != null) entity.onUpdate();
};

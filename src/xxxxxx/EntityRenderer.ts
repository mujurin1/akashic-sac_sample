import { CanvasDrawer } from "../CanvasDrawer";
import { Point } from "../hyperRobot/type";
import { CanvasEntity } from "./impl/CanvasEntity";

export class EntityManager {
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
  }

  private draw(context: CanvasRenderingContext2D): void {
    context.textBaseline = "top";

    this.entities.forEach((entity: CanvasEntity) => {
      entity.renderSelf(context);
    });
  }

  private onPointDown(ev: g.PointDownEvent): void {
    const entity = reverseEntityFind(
      this.entities,
      entity => checkTouch(entity, ev.point) //
    );
    this.touchEntity = entity;

    if (entity != null) entity.onPointDown?.(ev);
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

    if (entity.children != null) entityForEach(entity.children, fn);
  }
};

/**
 * 最初に条件に一致するエンティティを返す\
 * 子孫もチェックする\
 * 子(後ろの)エンティティを先に検索する
 * @returns
 */
const reverseEntityFind = (
  entities: readonly CanvasEntity[],
  check: (entity: CanvasEntity) => boolean
): CanvasEntity | undefined => {
  for (let i = entities.length - 1; i--; i >= 0) {
    const entity = entities[i];

    if (entity.children != null) {
      const res = reverseEntityFind(entity.children, check);
      if (res != null) return res;
    }

    if (check(entity)) return entity;
  }

  return undefined;
};

const onUpdate = (entity: CanvasEntity): void => {
  if (entity.onUpdate != null) entity.onUpdate();
};

const checkTouch = (entity: CanvasEntity, point: Point): boolean => {
  //prettier-ignore
  return (
    entity.touchable && !entity.hide &&
    entity.x <= point.x && point.x <= entity.x + entity.width &&
    entity.y <= point.y && point.y <= entity.y + entity.height
  );
};

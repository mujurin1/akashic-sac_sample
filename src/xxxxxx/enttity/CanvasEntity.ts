import { Point } from "../../hyperRobot/type";

/**
 * anchorX/Y が "middle" の場合 X/Y原点は左上, 回転は中心
 */
export class CanvasEntity {
  protected _children: CanvasEntity[] = [];

  x: number = 0;
  y: number = 0;
  width: number = 0;
  height: number = 0;

  anchorX: number | "middle" = 0;
  anchorY: number | "middle" = 0;
  /** 0 ~ 360 */
  angle: number = 0;

  hide: boolean = false;

  touchable: boolean = false;

  get children(): readonly CanvasEntity[] {
    return this._children;
  }

  onPointDown?: (ev: g.PointDownEvent) => void;
  onPointMove?: (ev: g.PointMoveEvent) => void;
  onPointUp?: (ev: g.PointUpEvent) => void;
  onUpdate?: () => void;

  /**
   * `children`以外のプロパティを引数のエンティティで上書きします
   *
   * 値の内部まで全てコピーした値で上書きすることを保証します
   * (参照を共有しない)
   */
  override(entity: this): this {
    this.x = entity.x;
    this.y = entity.y;
    this.width = entity.width;
    this.height = entity.height;
    this.anchorX = entity.anchorX;
    this.anchorY = entity.anchorY;
    this.angle = entity.angle;
    this.hide = entity.hide;
    this.touchable = entity.touchable;

    return this;
  }

  set<P extends keyof this>(name: P, value: this[P]): this {
    this[name] = value;
    return this;
  }

  position(x: number, y: number): this {
    this.x = x;
    this.y = y;
    return this;
  }

  /**
   * 参照したエンティティの右側に座標を設定します
   */
  right(entity: CanvasEntity, x: number, y: number): this {
    this.x = entity.x + x + entity.width;
    this.y = entity.y + y;

    return this;
  }

  /**
   * 参照したエンティティの下側に座標を設定します
   */
  bottom(entity: CanvasEntity, x: number, y: number): this {
    this.x = entity.x + x;
    this.y = entity.y + y + entity.width;

    return this;
  }

  size(width: number, height: number): this {
    this.width = width;
    this.height = height;
    return this;
  }

  anchor(anchor: number | "middle"): this {
    this.anchorX = anchor;
    this.anchorY = anchor;
    return this;
  }

  rotate(angle: number): this {
    this.angle = (this.angle + angle) % 360;
    return this;
  }

  setChildren(entities: CanvasEntity[]): this {
    this._children = entities;
    return this;
  }

  pointDown(fn: (ev: g.PointDownEvent) => void): this {
    this.onPointDown = fn;
    return this;
  }
  pointMove(fn: (ev: g.PointMoveEvent) => void): this {
    this.onPointMove = fn;
    return this;
  }
  pointUp(fn: (ev: g.PointUpEvent) => void): this {
    this.onPointUp = fn;
    return this;
  }
  update(fn: () => void): this {
    this.onUpdate = fn;
    return this;
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    if (this.anchorX === "middle" || this.anchorY === "middle") {
      ctx.translate(this.x, this.y);
      const x = this.width * 0.5;
      const y = this.height * 0.5;
      ctx.translate(x, y);
      ctx.rotate((this.angle * Math.PI) / 180);
      ctx.translate(-x, -y);
    } else {
      const x = this.x - this.width * this.anchorX;
      const y = this.y - this.height * this.anchorY;
      ctx.translate(x, y);
      ctx.rotate((this.angle * Math.PI) / 180);
    }

    this.renderSelf(ctx);

    if (this._children.length > 0) {
      for (const child of this._children) {
        child.render(ctx);
      }
    }

    ctx.restore();
  }

  renderSelf(ctx: CanvasRenderingContext2D): void {}

  checkTouch(_point: Readonly<Point>): CanvasEntity | undefined {
    if (this.hide) return undefined;
    let point = { ..._point };

    point.x -= this.x;
    point.y -= this.y;

    if (this.anchorX === "middle" || this.anchorY === "middle") {
      point.x -= this.width * 0.5;
      point.y -= this.height * 0.5;
      point = rotatePoint(point, this.angle);

      point.x += this.width * 0.5;
      point.y += this.height * 0.5;
    } else {
      point.x += this.width * this.anchorX;
      point.y += this.height * this.anchorY;
      point = rotatePoint(point, this.angle);
    }

    for (let i = this._children.length - 1; i >= 0; i--) {
      const child = this._children[i];
      const touch = child.checkTouch(point);

      if (touch != null) return touch;
    }

    //prettier-ignore
    if(this.checkTouchSelf(point))
      return this;

    return undefined;
  }

  checkTouchSelf(point: Point): boolean {
    //prettier-ignore
    return (
      this.touchable &&
      0 <= point.x && point.x <= this.width &&
      0 <= point.y && point.y <= this.height
    );
  }
}

const rotatePoint = (point: Point, angle: number): Point => {
  const radian = -angle * (Math.PI / 180);
  const cos = Math.cos(radian);
  const sin = Math.sin(radian);
  return {
    x: point.x * cos - point.y * sin,
    y: point.x * sin + point.y * cos
  };
};

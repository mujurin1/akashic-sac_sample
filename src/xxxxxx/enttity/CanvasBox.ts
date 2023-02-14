import { CanvasEntity } from "./CanvasEntity";
import { CanvasSeparator } from "./CanvasSeparator";

export interface BoxLayout {
  orientation: "holizontal" | "vertical";
  aligne: "topLeft" | "middle" | "bottomRight";
  gap: number;
  margineMain: number;
  margineCross: number;
}

/**
 * 子要素を縦横方向に並べて配置する
 *
 * 子要素に追加追加時に、追加されたエンティティは
 * * X,Yの値を変更される
 * * anchorX/Y の値が 0/"middle" でない場合 0 に変更される
 */
export class CanvasBox extends CanvasEntity {
  backgroundColor: string;
  boxLayout: BoxLayout = {
    orientation: "holizontal",
    aligne: "middle",
    gap: 0,
    margineMain: 0,
    margineCross: 0
  };

  setChildren(entities: CanvasEntity[]): this {
    this._children = entities;

    this.resetChildren();

    return this;
  }

  setBoxLayout(layout: Partial<BoxLayout>): this {
    this.boxLayout = {
      ...this.boxLayout,
      ...layout
    };

    return this;
  }

  renderSelf(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.backgroundColor;
    // ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fillRect(0, 0, this.width, this.height);
  }

  private resetChildren() {
    for (const child of this.children) {
      if (!(child.anchorX === 0 || child.anchorX === "middle")) {
        child.anchorX = 0;
      }
      if (!(child.anchorY === 0 || child.anchorY === "middle")) {
        child.anchorY = 0;
      }
    }

    const size = { main: this.width, cross: this.height };
    if (this.boxLayout.orientation === "vertical") {
      size.main = this.height;
      size.cross = this.width;
    }

    let totalCross = this.boxLayout.margineCross;

    // 子要素をパディングで分割する
    const divideValue = this.divideChildrenBySeparator();

    for (const value of divideValue) {
      this.align(totalCross, value.children, value.breadth);
      totalCross += value.breadth;

      if (value.separator != null) {
        value.separator.make(this, totalCross);
        totalCross += value.separator.gap;
      }
    }
  }

  private divideChildrenBySeparator(): {
    children: CanvasEntity[];
    breadth: number;
    separator?: CanvasSeparator;
  }[] {
    const ret: {
      children: CanvasEntity[];
      breadth: number;
      separator?: CanvasSeparator;
    }[] = [{ children: [], breadth: 0 }];

    for (const child of this.children) {
      const value = ret[ret.length - 1];

      if (child instanceof CanvasSeparator) {
        value.separator = child;
        ret.push({ children: [], breadth: 0 });
        continue;
      }

      value.children.push(child);

      if (this.boxLayout.orientation === "holizontal") {
        if (child.height > value.breadth) value.breadth = child.height;
      } else {
        if (child.width > value.breadth) value.breadth = child.width;
      }
    }

    return ret;
  }

  /**
   * エンティティを並べる
   * @param totalCross 並べ始める位置
   * @param entities 計算するエンティティ
   * @param breadth 要素が並ぶ方向に対して垂直の幅
   */
  private align(totalCross: number, entities: CanvasEntity[], breadth: number): void {
    const childPoint = {
      main: this.boxLayout.margineMain,
      cross: totalCross
    };
    const size = { main: this.width, cross: this.height };
    if (this.boxLayout.orientation === "vertical") {
      size.main = this.height;
      size.cross = this.width;
    }

    for (const child of entities) {
      const childSize = { main: child.width, cross: child.height };
      if (this.boxLayout.orientation === "vertical") {
        childSize.main = child.height;
        childSize.cross = child.width;
      }

      //prettier-ignore
      const cross = this.boxLayout.aligne === "topLeft" ? 0
            : this.boxLayout.aligne === "middle" ? (breadth -  childSize.cross) / 2
            : (breadth - childSize.cross);

      if (this.boxLayout.orientation === "holizontal") {
        child.position(childPoint.main, childPoint.cross + cross);
      } else {
        child.position(childPoint.cross + cross, childPoint.main);
      }

      childPoint.main += childSize.main + this.boxLayout.gap;
    }
  }
}

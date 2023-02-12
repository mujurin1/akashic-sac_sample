import { Entity } from "../entity/Entity";

export class Builder<E extends Entity> {
  // private readonly entity: Entity;

  // protected state: Partial<Entity>;

  protected readonly state: E;

  constructor(x: { new (): E }) {
    this.state = new x();
  }

  build(): E {
    return this.state;
    // return {
    //   ...this.state,
    //   x: requireNonNull(this.state.x),
    //   y: requireNonNull(this.state.y),
    //   width: requireNonNull(this.state.width),
    //   height: requireNonNull(this.state.height),
    //   hide: this.state.hide ?? false,
    //   touchable: requireNonNull(this.state.touchable)
    // };
  }

  position(x: number, y: number): this {
    this.state.x = x;
    this.state.y = y;

    return this;
  }

  size(width: number, height: number): this {
    this.state.width = width;
    this.state.height = height;
    return this;
  }

  hide(hide: boolean): this {
    this.state.hide = hide;
    return this;
  }

  touchable(touchable: boolean): this {
    this.state.touchable = touchable;
    return this;
  }

  child(child: Entity): this {
    if (this.state.children == null) this.state.children = [];
    this.state.children.push(child);

    return this;
  }

  children(children: Entity[]): this {
    if (this.state.children == null) this.state.children = [];
    this.state.children.push(...children);
    return this;
  }

  onPointDown(fn: E["onPointDown"]): this {
    this.state.onPointDown = fn;
    return this;
  }
  onPointMove(fn: E["onPointMove"]): this {
    this.state.onPointMove = fn;
    return this;
  }
  onPointUp(fn: E["onPointUp"]): this {
    this.state.onPointUp = fn;
    return this;
  }
  onUpdate(fn: E["onUpdate"]): this {
    this.state.onUpdate = fn;
    return this;
  }
}

// import { Entity } from "../entity/Entity";
// import { requireNonNull } from "../xxxUtils";

// export class Builder {
//   // private readonly entity: Entity;

//   protected state: Partial<Entity>;

//   constructor() {}

//   build(): Entity {
//     return {
//       ...this.state,
//       x: requireNonNull(this.state.x),
//       y: requireNonNull(this.state.y),
//       width: requireNonNull(this.state.width),
//       height: requireNonNull(this.state.height),
//       hide: this.state.hide ?? false,
//       touchable: requireNonNull(this.state.touchable)
//     };
//   }

//   position(x: number, y: number): this {
//     this.state.x = x;
//     this.state.y = y;
//     return this;
//   }

//   size(width: number, height: number): this {
//     this.state.width = width;
//     this.state.height = height;
//     return this;
//   }

//   hide(hide: boolean): this {
//     this.state.hide = hide;
//     return this;
//   }

//   touchable(touchable: boolean): this {
//     this.state.touchable = touchable;
//     return this;
//   }

//   child(child: Entity): this {
//     if (this.state.children == null) this.state.children = [];
//     this.state.children.push(child);

//     return this;
//   }

//   children(children: Entity[]): this {
//     if (this.state.children == null) this.state.children = [];
//     this.state.children.push(...children);
//     return this;
//   }

//   onPointDown(fn: Entity["onPointDown"]): this {
//     this.state.onPointDown = fn;
//     return this;
//   }
//   onPointMove(fn: Entity["onPointMove"]): this {
//     this.state.onPointMove = fn;
//     return this;
//   }
//   onPointUp(fn: Entity["onPointUp"]): this {
//     this.state.onPointUp = fn;
//     return this;
//   }
//   onUpdate(fn: Entity["onUpdate"]): this {
//     this.state.onUpdate = fn;
//     return this;
//   }
// }

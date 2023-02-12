import { StandardColor, Point, StandardShape, WildShape } from "../type";
import { Cell } from "../model/Cell";
import { CanvasDrawer } from "../../CanvasDrawer";
import { Piece } from "../model/Piece";
import { BOARD_SIZE } from "../const";
import { ManipulateType, UpdateType } from "../impl/HyperRobotStateType";
import { HyperRobotStateHolder } from "../../chapters/Game/Game_X";
import { BoxBuilder } from "../../xxxxxx/builder/BoxBuilder";
import { ButtonBuilder } from "../../xxxxxx/builder/ButtonBuilder";
import { LabelBuilder } from "../../xxxxxx/builder/LabelBuilder";
import { EntityManager } from "../../xxxxxx/EntityRenderer";
import { CanvasLabel } from "../../xxxxxx/impl/CanvasLabel";
import { CanvasBox } from "../../xxxxxx/impl/CanvasBox";
import { CanvasButton } from "../../xxxxxx/impl/CanvasButton";

//#region defaultViewState.ts

interface MutablePlayer {
  id: string;
  name: string;
  score: number;
}

interface MutablePiece {
  color: StandardColor;

  startX: number;
  startY: number;
  x: number;
  y: number;
}

// /** プレイヤーの宣言 */
// interface Declaration {
//   playerId: string;
//   count: number;
// }

// interface PieceMoving {
//   player: MutablePlayer;
//   /** 何手でゴールするか */
//   count: number;
//   nowCount: number;
// }

// //#region 本来外部にあるインポートするタイプ情報をとりあえず書いておく

// type GameState = "思考・宣言タイム" | "回答タイム" | "１ターンが終わった待機時間" | "ゲーム終了";

// type UpdateData =
//   | { type: "ゲームを次の状態に遷移する"; data: {} }
//   // 宣言タイム
//   | { type: "誰かの宣言"; data: { playerId: string; count: number } }
//   | { type: "タイマースタート"; data: { limitTime: number } }
//   // 回答タイム
//   | { type: "操作開始"; data: { playerId: string; count: number } }
//   | { type: "駒を動かす"; data: { color: StandardColor; point: Point } }
//   | { type: "成功した"; data: { playerId: string; scoreUp: number } }
//   | { type: "失敗した"; data: {} }
//   // 次のターンを始めるまでの間
//   | { type: "ゲーム終了"; data: { result: any } };

// type Manipulate =
//   | { type: "手数の宣言"; data: {} }
//   | { type: "駒の移動"; data: { color: StandardColor; dir: Dir } }
//   | {
//       type: "X";
//       data: {};
//       /** */
//     };

// //#endregion 本来外部にあるインポートするタイプ情報をとりあえず書いておく

//#endregion defaultViewState.ts

//#region defaultConst.ts

/*
 * ピクセル座標・サイズ
 */
const cellSize = 40;
const _oddNumberGap = cellSize % 2;
const _evenNumberGap = (cellSize + 1) % 2;

// 角を奇数にしたい場合は cellSize を奇数にすること
// 床模様のサイズは床と角から求める. 床模様のサイズは必ず偶数になる

// 角
const _cornerSize = 6; // 絶対に偶数にすべき
const cornerSize = _cornerSize + _oddNumberGap;
const cellCenter = (cellSize - _oddNumberGap) / 2 - (_cornerSize / 2 + _oddNumberGap);
// 外周
const cellOuterMargine = _cornerSize / 2 - _evenNumberGap;
const _cellOuterWidth = 1;
const cellOuterWidth = _cellOuterWidth + _evenNumberGap;
// 床
const middleFloorMargineFromCorner = 2;
const middleFloorX = cornerSize + middleFloorMargineFromCorner;
const middleFloorSize = cellSize - (middleFloorX + middleFloorMargineFromCorner);
const centerFloorMargineFromMiddle = 6;
const centerFloorX = middleFloorX + centerFloorMargineFromMiddle;
const centerFloorSize = middleFloorSize - centerFloorMargineFromMiddle * 2;

// 壁 (左の壁の位置)
const wallPaddingX = 1;
const wallPaddingYFromCorner = 1;
const wallWidth = cornerSize - wallPaddingX * 2;
const wallHeight = cellSize - (cornerSize + wallPaddingYFromCorner * 2);
// 駒の初期位置
const pieceStartSize = centerFloorSize;
const pieceStartX = cellCenter - pieceStartSize / 2;
const pieceStartHalf = pieceStartSize / 2;
// 駒 (円
const pieceSize = middleFloorSize;
const pieceRadius = pieceSize / 2;

/**
 * 色
 */

// 角
const cornerColor = "hsl(000, 00%, 00%)";
// 床
//  const floorColor = "hsl(225, 30%,  78%)";
//  const middleColor = "hsl(225, 30%, 75%)";
//  const centerColor = "hsl(225, 30%, 80%)";
const floorColor = "hsl(225, 30%,  78%)";
const middleColor = "hsl(225, 30%, 75%)";
const centerColor = "hsl(225, 30%, 80%)";
// 外周
const cellOuterColor = "rgba(0,0,0,0.3)";
// 壁
const wallColor = "hsl(360, 30%, 10%)";
// 駒
const pieceColor = {
  [StandardColor.red]: {
    piece: "hsl(360, 90%, 65%)",
    start: "hsl(360, 90%, 50%)"
  },
  [StandardColor.blue]: {
    piece: "hsl(240, 90%, 65%)",
    start: "hsl(240, 90%, 50%)"
  },
  [StandardColor.green]: {
    piece: "hsl(120, 80%, 65%)",
    start: "hsl(120, 85%, 50%)"
  },
  [StandardColor.yellow]: {
    piece: "hsl(60, 70%, 65%)",
    start: "hsl(60, 80%, 50%)"
  }
} as const;
// ゴール
const goalColor = {
  [StandardColor.red]: {
    color: "hsl(360, 90%, 40%)"
    // start: "hsl(360, 90%, 50%)"
  },
  [StandardColor.blue]: {
    color: "hsl(240, 90%, 40%)"
    // start: "hsl(240, 90%, 50%)"
  },
  [StandardColor.green]: {
    color: "hsl(120, 80%, 40%)"
    // start: "hsl(120, 85%, 50%)"
  },
  [StandardColor.yellow]: {
    color: "hsl(60, 80%, 50%)"
    // start: "hsl(60, 80%, 50%)"
  },
  ["wild"]: {
    color: ""
  }
} as const;

/*
 * 以下関数定義
 */

const cellPointToPxPoint = (x: number, y: number): Point => ({
  x: cornerSize + x * cellSize,
  y: cornerSize + y * cellSize
});

//#endregion defaultConst.ts

//#region defaultDrawBoard.ts

const createNomalBoardImage = (stateHolder: HyperRobotStateHolder): HTMLCanvasElement => {
  const cnv = document.createElement("canvas");
  cnv.width = cellSize * BOARD_SIZE + cornerSize;
  cnv.height = cellSize * BOARD_SIZE + cornerSize;
  const ctx = cnv.getContext("2d")!;

  ctx.fillStyle = floorColor;
  ctx.fillRect(0, 0, cnv.width, cnv.height);

  for (let x = 0; x < BOARD_SIZE; x++) {
    for (let y = 0; y < BOARD_SIZE; y++) {
      drawCell(ctx, stateHolder.state.getCell(x, y));
    }
  }

  drawOuter(ctx);

  return cnv;
};

const drawPieceStart = (ctx: CanvasRenderingContext2D, piece: Piece): void => {
  ctx.save();

  const pixel = cellPointToPxPoint(piece.startX, piece.startY);
  ctx.translate(pixel.x, pixel.y);
  ctx.fillStyle = pieceColor[piece.color].start;
  ctx.fillRect(pieceStartX, pieceStartX, pieceStartSize, pieceStartSize);
  ctx.restore();
  ctx.save();

  ctx.restore();
};

const drawPiece = (ctx: CanvasRenderingContext2D, piece: Piece): void => {
  ctx.save();

  const pixel = cellPointToPxPoint(piece.x, piece.y);
  ctx.translate(pixel.x, pixel.y);
  ctx.fillStyle = pieceColor[piece.color].piece;
  ctx.beginPath();
  ctx.arc(cellCenter, cellCenter, pieceRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
};

const drawOuter = (ctx: CanvasRenderingContext2D): void => {
  const allWallCell = {
    x: 0,
    y: 0,
    mark: undefined,
    walls: { top: true, right: true, bottom: true, left: true }
  } satisfies Cell;

  // 今の描画ロジックの場合、右と下の外周だけで良い
  for (let x = 0; x < BOARD_SIZE + 1; x++) {
    allWallCell.x = x;
    allWallCell.y = BOARD_SIZE;
    drawCell(ctx, allWallCell);
  }
  for (let y = 0; y < BOARD_SIZE + 1; y++) {
    allWallCell.x = BOARD_SIZE;
    allWallCell.y = y;
    drawCell(ctx, allWallCell);
  }
};

const drawCell = (ctx: CanvasRenderingContext2D, cell: Cell): void => {
  ctx.save();
  ctx.translate(cell.x * cellSize, cell.y * cellSize);

  // 外周
  ctx.fillStyle = cellOuterColor;
  ctx.fillRect(cellOuterMargine, cellOuterMargine, cellOuterWidth, cellSize);
  ctx.fillRect(cellOuterMargine, cellOuterMargine, cellSize, cellOuterWidth);

  // 床
  ctx.fillStyle = middleColor;
  ctx.fillRect(middleFloorX, middleFloorX, middleFloorSize, middleFloorSize);

  ctx.fillStyle = centerColor;
  ctx.fillRect(centerFloorX, centerFloorX, centerFloorSize, centerFloorSize);

  // ゴール
  drawGoal(ctx, cell);

  // 壁
  ctx.fillStyle = wallColor;
  if (cell.walls["left"]) {
    ctx.fillRect(wallPaddingX, cornerSize + wallPaddingYFromCorner, wallWidth, wallHeight);
  }
  if (cell.walls["top"]) {
    ctx.fillRect(cornerSize + wallPaddingYFromCorner, wallPaddingX, wallHeight, wallWidth);
  }

  // 角
  ctx.fillStyle = cornerColor;
  ctx.fillRect(0, 0, cornerSize, cornerSize);

  ctx.restore();
};

const drawGoal = (ctx: CanvasRenderingContext2D, cell: Cell): void => {
  const mark = cell.mark;
  if (mark == null) return;

  ctx.fillStyle = goalColor[mark.color].color;
  ctx.strokeStyle = goalColor[mark.color].color;
  ctx.lineWidth = 2;

  const center = cornerSize + cellCenter;

  // 円
  if (mark.shape === StandardShape.circle) {
    ctx.beginPath();
    ctx.arc(center, center, (centerFloorSize + 4) / 2, 0, Math.PI * 2);
    // ctx.arc(center, center, 11, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(center, center, (centerFloorSize - 2) / 2, 0, Math.PI * 2);
    // ctx.arc(center, center, 8, 0, Math.PI * 2);
    ctx.fill();
  }
  // 四角
  else if (mark.shape === StandardShape.square) {
    ctx.strokeRect(centerFloorX - 1, centerFloorX - 1, centerFloorSize + 2, centerFloorSize + 2);
    ctx.fillRect(centerFloorX + 2, centerFloorX + 2, centerFloorSize - 4, centerFloorSize - 4);
    // ctx.strokeRect(13, 13, 20, 20);
    // ctx.fillRect(16, 16, 14, 14);
  }
  // 三角
  else if (mark.shape === StandardShape.triangle) {
    ctx.beginPath();
    ctx.moveTo(22, 11);
    ctx.lineTo(33, 33);
    ctx.lineTo(11, 33);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(22, 18);
    ctx.lineTo(28, 30);
    ctx.lineTo(16, 30);
    ctx.closePath();
    ctx.fill();
  }
  // 星
  else if (mark.shape === StandardShape.star) {
    ctx.beginPath();
    //prettier-ignore
    {
      ctx.moveTo(23, 11); // 上
      ctx.lineTo(26, 20);
      ctx.lineTo(34, 20); // 右
      ctx.lineTo(28, 25);
      ctx.lineTo(30, 33); // 右下
      ctx.lineTo(23, 28);
      ctx.lineTo(16, 33); // 左下
      ctx.lineTo(18, 25);
      ctx.lineTo(12, 20); // 左
      ctx.lineTo(20, 20);
    }
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    //prettier-ignore
    {
      ctx.moveTo(23, 18); // 上
      ctx.lineTo(24, 22);
      ctx.lineTo(28, 22); // 右
      ctx.lineTo(25, 24);
      ctx.lineTo(26, 27); // 右下
      ctx.lineTo(24, 25);
      ctx.lineTo(20, 27); // 左下
      ctx.lineTo(21, 24);
      ctx.lineTo(18, 22); // 左
      ctx.lineTo(22, 22);
    }
    ctx.closePath();
    ctx.fill();
  }
  // WILD
  else if (mark.shape === WildShape) {
    ctx.beginPath();
    const gradient = ctx.createRadialGradient(
      center,
      center,
      2,
      center,
      center,
      (centerFloorSize + 2) / 2
    );
    gradient.addColorStop(0.0, "#ea3231");
    gradient.addColorStop(0.5, "#fcdc31");
    gradient.addColorStop(1.0, "#973abf");
    ctx.fillStyle = gradient;
    ctx.arc(center, center, (centerFloorSize + 4) / 2, 0, Math.PI * 2);
    ctx.fill();
  }
};

//#endregion defaultDrawBoard.ts

//#region defaultView.ts

export interface DefaultViewParam {
  readonly stateHolder: HyperRobotStateHolder;
  /** プレイヤーの操作を受け取る */
  readonly manipulate: (data: ManipulateType) => void;
}

export interface DefaultViewResult {
  update: (data: UpdateType) => void;
  display: g.E;
}

export const createDefaultView = (param: DefaultViewParam): DefaultViewResult => {
  const { stateHolder } = param;

  const display = g.game.env.createEntity(g.E, { width: g.game.width, height: g.game.height });
  display.append(createBoard(stateHolder));
  display.append(createUI(stateHolder));

  const update = ({ data, type }: UpdateType): void => {};

  return {
    display,
    update
  };
};

/**
 * 盤面を描画するエンティティの作成
 * @param stateHolder ゲームの状態
 */
const createBoard = (stateHolder: HyperRobotStateHolder): g.E => {
  const boardImage = createNomalBoardImage(stateHolder);

  return g.game.env.createEntity(CanvasDrawer, {
    // width: board.width,
    // height: board.height,
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    pixelScale: 1,
    draw: context => {
      context.drawImage(boardImage, 0, 0);

      stateHolder.state.pieces.forEach(piece => {
        drawPieceStart(context, piece);
      });
      stateHolder.state.pieces.forEach(piece => {
        drawPiece(context, piece);
      });

      // 目標のコインの描画
      // context.drawImage(targetMark.image);
    }
  });
};

/**
 * ゲームのUIを描画するエンティティの作成
 * @param stateHolder ゲームの状態
 */
const createUI = (stateHolder: HyperRobotStateHolder): g.E => {
  let declarationCount = 0;

  const incelement = (ev: g.PointDownEvent) => {
    declarationCount += 1;
    countLabel.text = declarationCount + "";
    render.display.modified();
  };
  const declement = (ev: g.PointDownEvent) => {
    declarationCount -= 1;
    countLabel.text = declarationCount + "";
    render.display.modified();
  };

  // 宣言ボタンエリア定義
  const countLabel = new LabelBuilder(CanvasLabel)
    .text(declarationCount + "", "#000")
    .position(10, 30)
    .size(100, 100)
    .font("serif", 72)
    .build();

  const declearField = new BoxBuilder(CanvasBox)
    .position(670, 510)
    .color("#d8d8d8")
    .size(400, 180)
    .layout({
      orientation: "holizontal",
      gapX: 10,
      gapY: 0
    })
    .children([
      countLabel,
      new ButtonBuilder(CanvasButton)
        .color("#84ffb4")
        .text("-", "#000")
        .font("serif", 72)
        .size(100, 100)
        .touchable(true)
        .onPointDown(incelement)
        .build(),
      new ButtonBuilder(CanvasButton)
        .color("#84ffb4")
        .text("+", "#000")
        .font("serif", 72)
        .size(100, 100)
        .touchable(true)
        .onPointDown(declement)
        .build()
    ])
    .build();

  const render = new EntityManager();
  render.entities.push(declearField);

  return render.display;

  // const declearEntities = ViewEntityBuilder.creae()
  //   .fillStyle("#d8d8d8")
  //   .fillRect(670, 510, 400, 180)
  //   .child(builder => {
  //     builder
  //       .translate(10, 30)
  //       .fillStyle("#000")
  //       .textStyle("serif", 72)
  //       .label(() => declarationCount + "", 0, 80, 80, 0)

  //       .relative("right", 0, 0)
  //       .repeat(
  //         [
  //           { text: "－", method: declement },
  //           { text: "＋", method: inclementButtonTouchEvent }
  //         ],
  //         130,
  //         0,
  //         // incBtnBuilder.onPointDown(handlePointDown).onPointMove(handlePointMove)
  //         (builder, value) => {
  //           builder
  //             .fillStyle("#84ffb4")
  //             // .fillRect(10, 0, 120, 120, { touched: value.method })
  //             .fillRect(10, 0, 120, 120, { touchable: true }, inclementButtonBuilder => {})
  //             .child(builder => {
  //               builder
  //                 .fillStyle("#000")
  //                 .textStyle("serif", 90) //
  //                 .label(value.text, 10, 90, 0, 0);
  //             });
  //         }
  //       );
  //   })
  //   .build();

  // console.log(declearField);

  // const ui = g.game.env.createEntity(CanvasDrawer, {
  //   width: g.game.width,
  //   height: g.game.height,
  //   pixelScale: 1,
  //   touchable: true,
  //   draw: ctx => {
  //     const state = stateHolder.state;
  //     ctx.save();

  //     if (state.state === "STA_THINKING") {
  //       // ViewEntityRender(ctx, declearEntities);
  //       // ViewEntityRender(ctx, userList);
  //       // ViewEntityRender(ctx, timer);
  //     } else if (state.state === "STA_ANSWER") {
  //     } else if (state.state === "STA_WAIT") {
  //       declarationCount = 0;
  //     } else if (state.state === "STA_GAMEOVER") {
  //     }

  //     ctx.restore();
  //   }
  // });

  // ui.onPointDown.add(ev => {
  //   const entity = ViewEntityTouched(declearEntities, ev.point);
  // });
  // ui.onPointMove.add(ev => {});
  // ui.onPointUp.add(ev => {});

  // return ui;
};

//#endregion defaultView.ts

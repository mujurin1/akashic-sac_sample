import { StandardColor, Point, StandardShape, WildShape, StandardColors, Dir } from "../type";
import { Cell } from "../model/Cell";
import { CanvasDrawer } from "akashic-sac";
import { Piece } from "../model/Piece";
import { BOARD_SIZE } from "../const";
import { ManipulateType, UpdateType } from "../impl/HyperRobotStateType";
import { HyperRobotStateHolder } from "../../chapters/Game/Game_X";
import { EntityRenderer } from "../../xxxxxx/EntityRenderer";
import { CanvasLabel } from "../../xxxxxx/enttity/CanvasLabel";
import { CanvasBox } from "../../xxxxxx/enttity/CanvasBox";
import { CanvasButton } from "../../xxxxxx/enttity/CanvasButton";
import { CanvasEntity } from "../../xxxxxx/enttity/CanvasEntity";
import { CanvasElipse } from "../../xxxxxx/enttity/CanvasElipse";
import { CanvasSeparator } from "../../xxxxxx/enttity/CanvasSeparator";
import { CanvasArrow } from "../../xxxxxx/enttity/CanvasArrow";

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
  const display = g.game.env.createEntity(g.E, { width: g.game.width, height: g.game.height });

  display.append(createBoard(param.stateHolder));
  display.append(createUI(param));

  const update = ({ data, type }: UpdateType): void => {
    display.modified();
  };

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
 */
const createUI = (param: DefaultViewParam): g.E => {
  const { stateHolder, manipulate } = param;

  const declaratCount = (count: number) => {
    const state = stateHolder.state;

    if (state.players.length === 0) {
      manipulate({
        type: "MAN_JOIN",
        data: { playerId: g.game.selfId! }
      });
      return;
    }

    if (state.state === "STA_WAIT") {
      manipulate({
        type: "MAN_NEXT_TURN",
        data: { nextTarget: state.remaindMarks[0] }
      });
    } else if (state.state === "STA_THINKING") {
      if (count > 0) {
        manipulate({
          type: "MAN_DECLARE",
          data: { playerId: g.game.selfId!, count }
        });
        manipulate({ type: "MAN_DECLARE_END", data: {} });
      }
    }
  };
  const movePiece = (color: StandardColor, dir: Dir) => {
    const state = stateHolder.state;
    if (state.state === "STA_ANSWER") {
      manipulate({
        type: "MAN_MOVE",
        data: { color, dir }
      });
    }
  };

  const render = new EntityRenderer();

  const declaration = createDeclaration(render, declaratCount);
  const move = createMove(stateHolder, render, movePiece);

  render.entities.push(declaration);
  render.entities.push(move);

  return render.display;
};

const createDeclaration = (
  render: EntityRenderer,
  answerClick: (count: number) => void
): CanvasEntity => {
  let declarationCount = 0;

  const incelement = (ev: g.PointDownEvent) => {
    declarationCount += 1;
    countLabel.text = declarationCount + "";
    render.modified();
  };
  const declement = (ev: g.PointDownEvent) => {
    declarationCount -= 1;
    countLabel.text = declarationCount + "";
    render.modified();
  };

  const countLabel = new CanvasLabel()
    .setText(declarationCount + "", "#000")
    .size(100, 100)
    .setFont("serif", 72);

  const counter = new CanvasBox()
    .set("backgroundColor", "#d8d8d8")
    .size(400, 180)
    .setBoxLayout({
      orientation: "holizontal",
      gap: 10,
      aligne: "middle",
      margineCross: 8
    })
    .setChildren([
      countLabel,
      new CanvasButton()
        .set("backgroundColor", "#84ffb4")
        .size(120, 120)
        .setText("－", "#000")
        .setFont("serif", 100)
        .set("margine", { x: 8, y: 12 })
        .set("touchable", true)
        .pointDown(declement),
      new CanvasButton()
        .set("backgroundColor", "#84ffb4")
        .size(120, 120)
        .setText("＋", "#000")
        .setFont("serif", 100)
        .set("margine", { x: 8, y: 12 })
        .set("touchable", true)
        .pointDown(incelement)
    ]);

  const answer = new CanvasButton()
    .size(160, 160)
    .right(counter, 20, 10)
    .setText("回答", "black")
    .set("backgroundColor", "#666")
    .setFont("serif", 60)
    .pointDown(() => answerClick(declarationCount));

  return new CanvasEntity()
    .position(670, 510) //
    .setChildren([counter, answer]);
};

const createMove = (
  stateHolder: HyperRobotStateHolder,
  render: EntityRenderer,
  movePiece: (color: StandardColor, dir: Dir) => void
): CanvasEntity => {
  let selectColor: StandardColor = StandardColors[0];

  const changeColor = (color: StandardColor) => {
    selectColor = color;
    console.log(selectColor);

    render.modified();
  };

  const moveDir = (dir: Dir) => {
    movePiece(selectColor, dir);
  };

  const moveBox = new CanvasEntity()
    .position(670, 50) //
    .size(550, 400);

  const colorButtons: CanvasEntity[] = StandardColors.map(color =>
    new CanvasElipse()
      .size(120, 120)
      .set("color", color)
      .set("touchable", true)
      .pointDown(() => changeColor(color))
  );

  const colorBox = new CanvasBox()
    .set("backgroundColor", "#d8d8d8")
    // .position(670, 310)
    .position(10, 10)
    .size(520, 180)
    .setBoxLayout({
      orientation: "holizontal",
      gap: 10,
      aligne: "middle",
      margineMain: 5,
      margineCross: 5
    })
    .setChildren(colorButtons);

  const top = new CanvasArrow()
    .size(120, 120)
    .position(140, 0)
    .anchor("middle")
    .arrowStyle("yellow", "red", 5)
    // .arrowStyle("gray", "red", 5)
    .set("touchable", true)
    .rotate(270);

  const arrowBox = new CanvasEntity().position(120, 200).setChildren([
    top.pointDown(() => moveDir("top")),
    new CanvasArrow() // left
      .override(top)
      .position(0, 140)
      .set("angle", 180)
      .pointDown(() => moveDir("left")),
    new CanvasArrow() // bottom
      .override(top)
      .position(140, 140)
      .set("angle", 90)
      .pointDown(() => moveDir("bottom")),
    new CanvasArrow() // right
      .override(top)
      .position(280, 140)
      .set("angle", 0)
      .pointDown(() => moveDir("right"))
  ]);

  return moveBox.setChildren([colorBox, arrowBox]);
};

//#endregion defaultView.ts

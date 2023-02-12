// import { randomInt } from "../../utils/randomInt";
// import { HyperRobotLogic } from "../HyperRobot/HyperRobotLogic_";
// import { CellContainer } from "../model/CellContainer";
// import { Cell } from "../model/Cell";
// import { Piece } from "../model/Piece";
// import { StandardColor, StandardColors, Dir, Dirs } from "../type";

// export const visualizeHyperRobot = (game: HyperRobotLogic): void => {
//   setTimeout(() => {
//     let selectPieceColor: StandardColor | undefined;
//     let canMoveDirs: readonly Dir[] = [];

//     const show = () => {
//       const html = createHtml(game.board, game.getAllPiece(), selectPieceColor, canMoveDirs);
//       document.write(html);
//     };

//     const selectPiece = (color: StandardColor) => {
//       selectPieceColor = color;
//       canMoveDirs = game.calcPieceMoveDirs(color);
//     };

//     const step = () => {
//       console.log();
//       console.log("step");

//       selectPiece(StandardColors[randomInt(StandardColors.length)]);
//       const dir = Dirs[randomInt(Dirs.length)];

//       console.log("move  :", selectPieceColor);
//       console.log("dir   :", dir);

//       let piece = game.getAllPiece().find(piece => piece.color === selectPieceColor)!;
//       console.log("before:", { x: piece.x, y: piece.y });
//       movePiece(dir);
//       piece = game.getAllPiece().find(piece => piece.color === selectPieceColor)!;
//       console.log("after :", { x: piece.x, y: piece.y });

//       console.log(game.getAllPiece());
//     };

//     let intervalId: g.TimerIdentifier;

//     const movePiece = (dir: Dir) => {
//       if (selectPieceColor == null) return;
//       const goalIn = game.movePiece(selectPieceColor, dir);

//       if (goalIn) {
//         g.game.env.scene.clearInterval(intervalId);

//         setTimeout(() => {
//           game.changeTarget();
//           show();

//           intervalId = g.game.env.scene.setInterval(step, 3000);
//         }, 3000);
//       }

//       show();
//     };

//     show();
//     intervalId = g.game.env.scene.setInterval(step, 3_000);
//   }, 1000);
// };

// const createHtml = (
//   board: CellContainer,
//   pieces: readonly Piece[],
//   selectPieceColor: StandardColor | undefined,
//   canMoveDir: readonly Dir[]
// ): string => {
//   let html = "";

//   for (let y = 0; y < board.height; y++) {
//     for (let x = 0; x < board.width; x++) {
//       const cell = board.getCell(x, y);
//       const style = {
//         width: "64px",
//         height: "64px",
//         position: "fixed",
//         top: `${64 * y + 128}px`,
//         left: `${64 * x + 128}px`,
//         padding: "8px",
//         "box-sizing": "border-box",
//         border: "2px solid #fff",
//         "border-left-color": cell.walls.left ? "#000" : "#fff",
//         "border-top-color": cell.walls.top ? "#000" : "#fff",
//         "border-right-color": cell.walls.right ? "#000" : "#fff",
//         "border-bottom-color": cell.walls.bottom ? "#000" : "#fff",
//         overflow: "hidden",
//         background: "#ccc"
//       };

//       const styleStr = Object.entries(style)
//         .map(([key, value]) => `${key}: ${value};`)
//         .join("");

//       const goalDiv = createMarkDiv(cell);
//       const pieceDiv = createPieceDiv(pieces, x, y);

//       html += `<div style="${styleStr}">${goalDiv}${pieceDiv}</div>`;
//     }
//   }

//   // 選択している駒を表示する
//   // 移動可能な矢印を表示する

//   return html;
// };

// const createMarkDiv = (cell: Cell): string => {
//   const mark = cell.mark;
//   if (mark == null) return "<div></div>";

//   return `<div style="color: ${mark.color};">
// G:${mark.shape}
// </div>`;
// };

// const createPieceDiv = (pieces: readonly Piece[], x: number, y: number): string => {
//   const piece = pieces.find(piece => piece.x === x && piece.y === y);
//   if (piece == null) return "<div></div>";

//   return `<div style="padding:20px 0px; color: ${piece.color};">
// P:${piece.color}
// </div>`;
// };

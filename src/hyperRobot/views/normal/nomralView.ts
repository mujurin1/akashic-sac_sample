// import { CanvasEntity } from "../../../CanvasDrawer";
// import { HyperRobot } from "../../HyperRobot/HyperRobotLogic";
// import { CreateHyperRobotView, HyperRobotView } from "../HyperRobotView";
// import { boardX, boardY } from "./constNormal";
// import { createNomalBoardImage, drawPiece } from "./nomalBoardDrawer";

// export const createNomalView: CreateHyperRobotView = param => {
//   const { hyperRobot } = param;

//   const boardImage: CanvasImageSource = createNomalBoardImage(hyperRobot);

//   const display = g.game.env.createEntity(CanvasEntity, {
//     width: g.game.width,
//     height: g.game.height,
//     pixelScale: 1,
//     touchable: true
//   });

//   const view: HyperRobotView = {
//     display,
//     update() {
//       drawBoard(display, hyperRobot, boardImage);

//       display.modified();
//     }
//   };

//   return view;
// };

// const drawBoard = (
//   canvasEntity: CanvasEntity,
//   hyperRobot: HyperRobot,
//   boardImage: CanvasImageSource
// ): void => {
//   const ctx = canvasEntity.context;

//   ctx.drawImage(boardImage, boardX, boardY);

//   hyperRobot.getAllPiece().forEach(piece => drawPiece(canvasEntity, piece));
// };

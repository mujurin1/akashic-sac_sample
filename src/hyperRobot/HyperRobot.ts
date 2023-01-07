import { Board } from "./model/Board";
import { MutableBoard as MutableBoard } from "./model/MutableBoard";
import { Piece, PieceType } from "./model/Piece";
import { boardHeight, boardWidth, createMutableBoard } from "./createMutableBoard";
import { visualizeBoard } from "./visualizeBoard";
import { mutableBoardCheck } from "./mutableBoardCheck";

export interface HyperRobot {
  readonly board: Board;
  readonly pieces: readonly [Piece, Piece, Piece, Piece];
}

export const HyperRobot = {
  new(): HyperRobot {
    let mutableBoard = createMutableBoard();

    let check = mutableBoardCheck(mutableBoard);
    while (!check) {
      mutableBoard = createMutableBoard();
      check = mutableBoardCheck(mutableBoard);
    }

    visualizeBoard(mutableBoard, boardWidth, boardHeight);

    const board: Board = {
      width: boardWidth,
      height: boardHeight,
      cells: []
    };

    const pieces = [
      Piece.new(PieceType.blue),
      Piece.new(PieceType.red),
      Piece.new(PieceType.green),
      Piece.new(PieceType.yellow)
    ] as const;

    return {
      board,
      pieces
    };
  }
};

import { IHyperRobotState } from "../model/BoardState";
import { Cell } from "../model/Cell";
import { HyperRobotPlayer } from "../model/HyperRobotPlayer";
import { AllMarks, Mark, WildMark } from "../model/Mark";
import { Piece } from "../model/Piece";
import { Dir, Dirs, StandardColor, dirToPoint, Point } from "../type";
import { CellContainer } from "./CellContainer";
import { StateType, UpdateType, ManipulateType } from "./HyperRobotStateType";

interface WithArgs extends Omit<Partial<IHyperRobotState>, "cellContainer"> {}

export class HyperRobotState implements IHyperRobotState {
  public get cells() {
    return this.cellContainer.cells;
  }

  private constructor(
    /** ゲームの状態 */
    readonly state: StateType,
    readonly players: readonly HyperRobotPlayer[],

    readonly cellContainer: CellContainer,
    readonly pieces: readonly Piece[],

    /** 現在目標のゴールのマーク */
    readonly target: Mark,
    /** ゴールしていないマーク */
    readonly remaindMarks: readonly Mark[],

    /** 現在操作しているプレイヤーID. `0`は操作プレイヤー無し */
    readonly movePlayerId: string | 0,
    /** 何手操作したか */
    readonly movedCount: number
  ) {}

  //#region 生成・更新
  /**
   * `IHyperRobotState`を新しく生成します
   */
  public static create(
    playerIds: readonly string[],
    cellContainer: CellContainer,
    pieces: readonly Piece[],
    target: Mark
  ): IHyperRobotState {
    return new HyperRobotState(
      "STA_THINKING",
      playerIds.map(toPlayer),

      cellContainer,
      pieces,

      target,
      AllMarks.filter(mark => mark !== target),

      0,
      0
    );
  }

  /**
   * 一部の状態を上書きした新しい`IHyperRobotState`を生成します
   */
  private with(args: WithArgs): IHyperRobotState {
    return new HyperRobotState(
      args.state ?? this.state,
      args.players ?? this.players,

      this.cellContainer,
      args.pieces ?? this.pieces,

      args.target ?? this.target,
      args.remaindMarks ?? this.remaindMarks,

      args.movePlayerId ?? this.movePlayerId,
      args.movedCount ?? this.movedCount
    );
  }
  //#endregion 生成・更新

  getCell(x: number, y: number): Cell {
    return this.cellContainer.getCell(x, y);
  }

  getMarkedCell(mark: Mark): Cell {
    return this.cellContainer.getMarkedCell(mark);
  }

  getAllMarkedCells(): Cell[] {
    return this.cellContainer.getAllMarkedCells();
  }

  getPiece(color: StandardColor): Piece {
    return this.pieces.find(piece => piece.color === color)!;
  }

  /**
   * 操作する順に並んだプレイヤー配列を返します
   */
  getDeclaredPlayers(): HyperRobotPlayer[] {
    const players = this.players.filter(player => player.moveOrder != undefined);
    return players.sort((a, b) => a.moveOrder! - b.moveOrder!);
  }

  //#region 計算
  /**
   * 駒の移動可能な方向を計算する
   * @param color 移動する駒の色
   * @returns 移動可能な方向の配列
   */
  calcPieceMoveDirs(color: StandardColor): Dir[] {
    const piece = this.getPiece(color);
    const cell = this.getCell(piece.x, piece.y);

    let dirs = Dirs.filter(dir => !cell.walls[dir]);
    dirs = dirs.filter(dir => {
      const dirPoint = dirToPoint(dir);
      return this.pieces.every(p => p.x !== piece.x + dirPoint.x || p.y !== piece.y + dirPoint.y);
    });

    return dirs;
  }

  /**
   * 駒を動かした後の座標を返す
   * @param color 動かす駒
   * @param dir 動かす方向
   * @returns 移動後の座標
   */
  calcPieceMovedPoint(color: StandardColor, dir: Dir): Point {
    const piece = this.getPiece(color);
    const move = dirToPoint(dir);
    const point: Point = { x: piece.x, y: piece.y };

    const movedPoint = { ...point };
    while (!this.getCell(point.x, point.y).walls[dir]) {
      movedPoint.x += move.x;
      movedPoint.y += move.y;

      if (this.pieces.some(p => p.x === movedPoint.x && p.y === movedPoint.y)) break;

      point.x = movedPoint.x;
      point.y = movedPoint.y;
    }

    return point;
  }

  //#endregion 計算

  /**
   * 駒が移動した場合にゴールしているかチェックする
   * @param color 移動する駒
   * @param point 移動先
   * @returns true:ゴールしている
   */
  checkGoal(color: StandardColor, point: Point): boolean {
    if (this.target !== WildMark && color !== this.target.color) return false;

    const goal = this.getMarkedCell(this.target);
    return goal.x === point.x && goal.y === point.y;
  }

  public MAN_UPD(args: ManipulateType): IHyperRobotState {
    let newState = this.with({});
    this.MANIPUlATE_(args).forEach(update => {
      newState = newState.UPDATE_(update);
    });

    return newState;
  }

  /**
   * ユーザーの操作, ゲーム自身の動作(時間経過による状態の変化など)
   * を引数で渡して、自身の状態を変化するための情報を返す
   *
   * 検証や計算はこのメソッドが担当する
   * @param args
   * @returns 状態を変更するための情報
   */
  public MANIPUlATE_(args: ManipulateType): UpdateType[] {
    const res: UpdateType[] = [];

    if (this.MANIPUlATE_ANY(res, args)) return res;

    if (this.state === "STA_THINKING") this.MANIPUlATE_Thinking(res, args);
    else if (this.state === "STA_ANSWER") this.MANIPUlATE_Answer(res, args);
    else if (this.state === "STA_WAIT") this.MANIPUlATE_Wait(res, args);
    // else if (this.state === "STA_GAMEOVER")

    return res;
  }

  /** 状態に関係なく処理する操作 */
  private MANIPUlATE_ANY(res: UpdateType[], { type, data }: ManipulateType): boolean {
    // いずれの条件にも引っ掛からない場合は最後の`else return false`を通る
    if (type === "MAN_JOIN") {
      if (this.players.length === 0 || this.players.some(player => player.id !== data.playerId))
        res.push({ type: "UPD_JOIN", data });
    } else return false;

    return true;
  }
  private MANIPUlATE_Thinking(res: UpdateType[], { type, data }: ManipulateType): void {
    if (type === "MAN_DECLARE") {
      const players = this.getDeclaredPlayers();
      let order = 0;
      while (order < players.length && players[order].declareCount! <= data.count) {
        order += 1;
      }

      res.push({ type: "UPD_DECLARE", data: { ...data, order } });
    } else if (type === "MAN_DECLARE_END") {
      res.push({ type: "UPD_TRANSITION_ANSWER", data: {} });
    }
  }
  private MANIPUlATE_Answer(res: UpdateType[], { type, data }: ManipulateType): void {
    if (type === "MAN_MOVE") {
      const point = this.calcPieceMovedPoint(data.color, data.dir);
      res.push({ type: "UPD_MOVE_PIECE", data: { color: data.color, point } });

      const player = this.players.find(player => player.id === this.movePlayerId)!;

      if (player.declareCount === this.movedCount + 1) {
        if (this.checkGoal(data.color, point)) {
          res.push({ type: "UPD_GOALED", data: {} });
          res.push({ type: "UPD_TRANSITION_WAIT", data: {} });
        } else {
          this.Answer_FiledOrEnd(res, player);
        }
      }
    } else if (type === "MAN_GIVE_UP") {
      this.Answer_FiledOrEnd(res, this.players.find(player => player.id === this.movePlayerId)!);
    }
  }
  private Answer_FiledOrEnd(res: UpdateType[], player: HyperRobotPlayer): void {
    const nextOrder = player.moveOrder! + 1;
    const nextPlayer = this.players.find(p => p.moveOrder === nextOrder);
    res.push({ type: "UPD_FAILED", data: { nextMoverId: nextPlayer?.id ?? 0 } });
    if (nextPlayer == null) {
      res.push({ type: "UPD_TRANSITION_WAIT", data: {} });
    }
  }
  private MANIPUlATE_Wait(res: UpdateType[], { type, data }: ManipulateType): void {
    if (type === "MAN_NEXT_TURN") {
      if (this.remaindMarks.length === 0) {
        res.push({ type: "UPD_TRANSITION_GAMEOVER", data: {} });
      } else {
        res.push({
          type: "UPD_TRANSITION_THINKING",
          data: { nextTarget: data.nextTarget }
        });
      }
    }
  }

  /**
   * チケット?を元に現在の状態を変更した新しい状態を返す
   *
   * チケット?は検証済みなので、100%信頼する
   * @param args 状態を変更するための情報
   * @returns 新しい`IHyperRobotState`
   */
  public UPDATE_(args: UpdateType): IHyperRobotState {
    const res = this.UPDATE_ANY(args);
    if (res != null) return res;

    if (this.state === "STA_THINKING") return this.UPDATE_Thinking(args);
    else if (this.state === "STA_ANSWER") return this.UPDATE_Answer(args);
    else if (this.state === "STA_WAIT") return this.UPDATE_Wait(args);
    // else if (this.state === "STA_GAMEOVER")

    return this;
  }

  /** 状態に関係なく処理する操作 */
  private UPDATE_ANY({ type, data }: UpdateType): IHyperRobotState | undefined {
    if (type === "UPD_JOIN") {
      const players = [...this.players, toPlayer(data.playerId)];
      return this.with({ players });
    }

    return undefined;
  }
  private UPDATE_Thinking({ type, data }: UpdateType): IHyperRobotState {
    if (type === "UPD_DECLARE") {
      const players = this.players.slice(0);
      const moverIndex = players.findIndex(player => player.id === data.playerId)!;
      players[moverIndex] = {
        ...players[moverIndex],
        moveOrder: data.order,
        declareCount: data.count
      };

      // 今回宣言された手番以降のプレイヤーの手番を1つずらす
      players.forEach((player, index) => {
        if (player.moveOrder != undefined && player.moveOrder > data.order)
          players[index] = {
            ...player,
            moveOrder: player.moveOrder + 1
          };
      });

      return this.with({ players });
    } else if (type === "UPD_TRANSITION_ANSWER") {
      return this.with({
        state: "STA_ANSWER",
        movePlayerId: this.players.find(p => p.moveOrder === 0)!.id,
        movedCount: 0
      });
    }
    return this;
  }
  private UPDATE_Answer({ type, data }: UpdateType): IHyperRobotState {
    if (type === "UPD_MOVE_PIECE") {
      const pieces = this.pieces.slice(0);
      const idx = pieces.findIndex(p => p.color === data.color);
      pieces[idx] = {
        ...pieces[idx],
        x: data.point.x,
        y: data.point.y
      };

      return this.with({
        movedCount: this.movedCount + 1,
        pieces
      });
    } else if (type === "UPD_GOALED") {
      const index = this.players.findIndex(player => player.id === this.movePlayerId)!;
      const players = this.players.slice(0);
      players[index] = {
        ...players[index],
        score: players[index].score + 1
      };

      return this.with({ players });
    } else if (type === "UPD_FAILED") {
      const pieces = this.pieces.map(
        p =>
          ({
            ...p,
            x: p.startX,
            y: p.startY
          } satisfies Piece)
      );
      return this.with({ pieces, movedCount: 0, movePlayerId: data.nextMoverId });
    } else if (type === "UPD_TRANSITION_WAIT") {
      const players = resetPlayeres(this.players);

      const pieces = this.pieces.map(
        piece =>
          ({
            ...piece,
            startX: piece.x,
            startY: piece.y
          } satisfies Piece)
      );

      return this.with({
        state: "STA_WAIT",
        players,
        pieces,
        movePlayerId: undefined,
        movedCount: 0
      });
    }
    return this;
  }
  private UPDATE_Wait({ type, data }: UpdateType): IHyperRobotState {
    if (type === "UPD_TRANSITION_THINKING") {
      return this.with({
        state: "STA_THINKING",
        target: data.nextTarget,
        remaindMarks: this.remaindMarks.filter(mark => mark !== data.nextTarget)
      });
    } else if (type === "UPD_TRANSITION_GAMEOVER") {
    }
    return this;
  }
}

const toPlayer = (playerId: string): HyperRobotPlayer => ({
  id: playerId,
  score: 0,
  declareCount: undefined,
  moveOrder: undefined
});

const resetPlayeres = (players: readonly HyperRobotPlayer[]): HyperRobotPlayer[] =>
  players.map(
    player =>
      ({
        ...player,
        declareCount: undefined,
        moveOrder: undefined
      } satisfies HyperRobotPlayer)
  );

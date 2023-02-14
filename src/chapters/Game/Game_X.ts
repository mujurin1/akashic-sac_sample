import { Chapter, createFrameLabel, SwitchChapter } from "akashic-sac";
import { createDefaultView } from "../../hyperRobot/views/defaultView";
import { HyperRobotState } from "../../hyperRobot/impl/HyperRobotState";
import { createRuledCellArray } from "../../hyperRobot/impl/createRuledCellArray";
import { createRuledPieces } from "../../hyperRobot/impl/createRuledPieces";
import { CellContainer } from "../../hyperRobot/impl/CellContainer";
import { StandardMarks } from "../../hyperRobot/model/Mark";
import { global } from "../../global/global";
import { Title } from "../title";

export interface HyperRobotStateHolder {
  state: HyperRobotState;
}

export class Game_X extends Chapter {
  stateHolder: HyperRobotStateHolder;

  get state() {
    return this.stateHolder.state;
  }
  // state: HyperRobotState;
  // readonly getState = () => this.state;

  init(): void {
    // const nextButton = createFrameLabel({
    //   parent: this.display,
    //   frame: global.frameAssets.defaultFrame,
    //   text: "ゲームを戻る",
    //   x: 650,
    //   y: 10,
    //   hidden: !g.game.env.isHost,
    //   touchable: g.game.env.isHost
    // });
    // if (g.game.env.isHost) {
    //   nextButton.onPointDown.add(() => {
    //     g.game.env.client!.sendAction(SwitchChapter.create(Title));
    //   });
    // }

    const container = new CellContainer(createRuledCellArray());

    this.stateHolder = {
      state: HyperRobotState.create(
        [],
        container,
        createRuledPieces(container),
        StandardMarks.circle[0]
      )
    };
  }

  show(...args: never[]): void {
    console.log("show Game");

    const { display, update } = createDefaultView({
      stateHolder: this.stateHolder,
      manipulate: manipulate => {
        const datas = this.state.MANIPUlATE_(manipulate);
        for (const data of datas) {
          this.stateHolder.state = this.state.UPDATE_(data);

          update(data);
        }
      }
    });

    // visualizeHyperRobot(hyperRobot);

    this.display.append(display);
  }

  hide(): void {
    console.log("hide Game");
  }

  // cnt = -1;
  // public dbg() {
  //   let s = this.state;

  //   if (this.cnt === -1) {
  //     s = s.MAN_UPD({ type: "MAN_JOIN", data: { playerId: "2" } });
  //   } else if (this.cnt === 0) {
  //     s = s.MAN_UPD({ type: "MAN_DECLARE", data: { playerId: "1", count: 4 } });
  //     s = s.MAN_UPD({ type: "MAN_DECLARE", data: { playerId: "2", count: 4 } });
  //     this.state = s.MAN_UPD({ type: "MAN_DECLARE_END", data: {} });
  //   } else if (this.cnt === 1) {
  //     this.state = s.MAN_UPD({ type: "MAN_MOVE", data: { color: "blue", dir: "top" } });
  //     this.display.modified();
  //   } else if (this.cnt === 2) {
  //     this.state = s.MAN_UPD({ type: "MAN_MOVE", data: { color: "blue", dir: "right" } });
  //     this.display.modified();
  //   } else if (this.cnt === 3) {
  //     this.state = s.MAN_UPD({ type: "MAN_MOVE", data: { color: "blue", dir: "bottom" } });
  //     this.display.modified();
  //   } else if (this.cnt === 4) {
  //     this.state = s.MAN_UPD({ type: "MAN_MOVE", data: { color: "blue", dir: "left" } });
  //     this.display.modified();

  //     if (this.state.movePlayerId !== 0) {
  //       this.cnt = 0;
  //     }
  //   }

  //   this.cnt++;
  //   this.cnt %= 5;
  // }
}

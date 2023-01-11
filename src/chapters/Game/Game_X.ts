import { Chapter, createFrameLabel, SwitchChapter } from "akashic-sac";
import { global } from "../../global/global";
import { createHyperRobot } from "../../hyperRobot/createHyperRobot";
import { createNomalView } from "../../hyperRobot/views/normal/nomralView";
import { visualizeHyperRobot } from "../../hyperRobot/visualizeBoard";
import { Title } from "../title";

export class Game_X extends Chapter {
  init(): void {
    const nextButton = createFrameLabel({
      parent: this.display,
      frame: global.frameAssets.defaultFrame,
      text: "ゲームを開始する",
      x: 650,
      y: 580,
      hidden: !g.game.env.isHost,
      touchable: g.game.env.isHost
    });

    if (g.game.env.isHost) {
      nextButton.onPointDown.add(() => {
        g.game.env.client!.sendAction(SwitchChapter.create(Title));
      });
    }
  }

  show(...args: never[]): void {
    console.log("show Game");

    const hyperRobot = createHyperRobot();
    const hyperRobotView = createNomalView({
      hyperRobot,
      anserMove(count) {},
      movePiece(color, dir) {}
    });

    // visualizeHyperRobot(hyperRobot);

    this.display.append(hyperRobotView.display);
    hyperRobotView.update();
  }

  hide(): void {
    console.log("hide Game");
  }
}

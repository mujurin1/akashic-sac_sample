import { Chapter } from "akashic-sac";
import { HyperRobot } from "../../hyperRobot/HyperRobot";
import { MutableBoard } from "../../hyperRobot/model/MutableBoard";

export class Game_X extends Chapter {
  init(): void {}

  show(...args: never[]): void {
    console.log("show Game");

    HyperRobot.new();
  }

  hide(): void {
    console.log("hide Game");
  }
}

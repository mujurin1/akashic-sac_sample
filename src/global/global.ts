import { PlayerManager } from "../model/PlayerManager";
import * as frameAssets from "./frameAssets";

export const global = {
  frameAssets,
  playerManager: PlayerManager.create()
} as const;

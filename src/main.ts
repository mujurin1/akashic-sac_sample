import { initializedStart, InitializedStartOption } from "akashic-sac/lib/index";
import { Title } from "./chapters/title";
import { serverStart } from "./server/server";
import { JoinPlayer } from "./actions/JoinPlayer";
import { Game_X } from "./chapters/Game/Game_X";
import { global } from "./global/global";

function main(param: g.GameMainParameterObject): void {
  const options: InitializedStartOption = {
    atsumaruSoloBackgroundColor: "wheat",
    sceneParam: {
      assetIds: ["default_frame"]
    },
    // １つ目のチャプターが最初に呼ばれる
    chapters: [Title, Game_X],
    serverStart,
    initialized
  };

  initializedStart(options, param);
}

const initialized = () => {
  // リスナーに教えてもらった、キャンバス拡大でボヤけないようにするやつ
  if (!g.game.env.isServer)
    (<any>g.game.renderers[0]).canvasRenderingContext2D.imageSmoothingEnabled = false;

  const client = g.game.env.client;
  if (client == null) return;

  client.addActionSet(
    JoinPlayer.createActionSet(data => {
      if (data.sendPlayerId != null) global.playerManager.addPlayer(data.sendPlayerId, data.name);
    })
  );
};

export = main;

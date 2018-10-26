import { Room } from "colyseus";
import { GameState, Player, Room as RoomModel } from "foosball-model";

export class StandardRoom extends Room<any> {
  standard: String;

  onInit(options) {
    console.log("StandardRoom created", options);

    let creator = new Player();
    creator.client_id = options.clientId;
    creator.client_session_id = options.sessionId;
    creator.fb_client_id = options.fb_client_id.replace("FB", "");
    creator.fb_client_name = options.fb_client_name;

    let metadata = new RoomModel();
    metadata.name = options.standard;
    metadata.scene = options.scene;
    metadata.mode = options.mode;
    metadata.creator = creator;

    let state = new GameState();
    state.step = "NEW_ROOM";
    state.players = [];
    state.roominfo = metadata;
    this.setState(state);

    this.setMetadata(metadata);
    this.standard = options.standard;
  }

  requestJoin(options) {
    return options.standard === this.standard;
  }

  onJoin(client, options) {
    let player = new Player();
    player.client_id = client.id;
    player.client_session_id = client.sessionId;
    player.fb_client_id = options.fb_client_id.replace("FB", "");
    player.fb_client_name = options.fb_client_name;

    if (this.state.step === "NEW_ROOM") {
      this.state.step = "PLAYER_JOIN";
    }
    console.log("Player Join", player);
    this.state.players.push(player);
  }

  onLeave(client) {
    console.log(client.id, client.sessionId, "left");
  }

  onMessage(client, data) {
    console.log("Update", client.sessionId, data);
  }

  onDispose() {
    console.log("Dispose Room");
  }
}

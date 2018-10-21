import { Room } from "colyseus";
import { GameState, Player, Room as RoomModel } from "foosball-model";

export class StandardRoom extends Room<any> {
  standard: String;

  onInit(options) {
    console.log("StandardRoom created", options);
    let state = new GameState();
    state.step = "NEW_ROOM";
    state.players = [];
    this.setState(state);

    let creator = new Player();
    creator.client_id = options.clientId;
    creator.client_session_id = options.sessionId;
    creator.fb_client_id = options.fb_client_id;
    creator.fb_client_name = options.fb_client_name;

    let metadata = new RoomModel();
    metadata.name = options.standard;
    metadata.scene = options.scene;
    metadata.mode = options.mode;
    metadata.creator = creator;

    this.setMetadata(metadata);
    this.standard = options.standard;
  }

  requestJoin(options) {
    return options.standard === this.standard;
  }

  onJoin(client, options) {
    console.log("Player Join ", client.id, client.sessionId);

    let player = new Player();
    player.client_id = client.id;
    player.client_session_id = client.sessionId;
    player.fb_client_id = options.fb_client_id;
    player.fb_client_name = options.fb_client_name;

    this.state.players.push(player);
    if (this.state.step === "NEW_ROOM") {
      this.state.step = "PLAYER_JOIN";
    }
  }

  onLeave(client) {
    console.log(client.id, client.sessionId, "left");
  }

  onMessage(client, data) {
    console.log(
      "Room received message from client session",
      client.sessionId,
      ":",
      data
    );
  }

  onDispose() {
    console.log("Dispose Room");
  }
}

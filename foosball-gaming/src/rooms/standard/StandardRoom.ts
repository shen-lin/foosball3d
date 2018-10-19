import { Room, Client } from "colyseus";

export class StandardRoom extends Room<any> {
  standard: String;

  onInit(options) {
    console.log("StandardRoom created", options);
    var oState = {
      step: "NEW_ROOM",
      players: []
    };
    this.setState(oState);

    var oMetadata = {
      name: options.standard,
      scene: options.scene,
      mode: options.mode,
      creator: {
        client_id: options.clientId,
        client_session_id: options.sessionId,
        fb_client_id: options.fb_client_id,
        fb_client_name: options.fb_client_name
      }
    };
    this.setMetadata(oMetadata);

    this.standard = options.standard;
  }

  requestJoin(options) {
    return options.standard === this.standard;
  }

  onJoin(client, options) {
    console.log(
      "Player Join ",
      client.id,
      client.sessionId,
      options
    );

    var player = {
      client_id: client.id,
      client_session_id: client.sessionId,
      fb_client_id: options.fb_client_id,
      fb_client_name: options.fb_client_name
    };

    this.state.players.push(player);

    if (this.state.step === "NEW_ROOM") {
      this.state.step = "PLAYER_JOIN";
    }

    // fb_client_id: '10102675149890581',
    // fb_client_name: 'Shen Lin' },
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

import { GameState, Player, Room as RoomModel } from "foosball-model";

export default class MessageHandler {
  handleMessage(client, data: any, state: GameState) {
    switch (data.method) {
      case "SET_READY":
        this.handleSetReady(client, data, state);
        break;
      default:
        break;
    }
  }

  handleSetReady(client, data: any, state: GameState) {
    state.players.forEach((item, index) => {
      if (item.client_session_id === client.sessionId) {
        item.ready = data.ready;
      }
    });
  }
}

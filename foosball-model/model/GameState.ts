import Player from "./Player";
import Room from "./Room";

export default class GameState {
  step: string;
  players: Array<Player>;
  roominfo: Room;
}

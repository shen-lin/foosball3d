import Player from "./Player";
import Room from "./Room";

export default class {
  step: string;
  players: Array<Player>;
  roominfo: Room;

  constructor(step: string, players: Array<Player>, roominfo: Room) {
    this.step = step;
    this.players = players;
    this.roominfo = roominfo;
  }
}

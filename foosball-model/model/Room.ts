import Player from "./Player";

export default class {
  name: string;
  scene: string;
  mode: string;
  creator: Player;

  constructor(name: string, scene: string, mode: string, creator: Player) {
      this.name = name;
      this.scene = scene;
      this.mode = mode;
      this.creator = creator;
  }
}

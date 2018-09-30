import { Room, Client } from "colyseus";

export class StandardRoom extends Room<any> {
    standard: String

    onInit (options) {
        var oMetadata = {name: options.standard, creator: options.clientId};
        console.log("StandardRoom created!", options);
        this.setState({metadata: oMetadata});
        this.setMetadata(oMetadata);
        this.standard = options.standard;
    }

    requestJoin (options) {
        return options.standard === this.standard;
      }

    onJoin (client) {
        console.log(client.id, client.sessionId, "joined successfully");
    }

    onLeave (client) {
        console.log(client.id, client.sessionId, "left");
    }

    onMessage (client, data) {
        console.log("AuthRoom received message from", client.sessionId, ":", data);
    }

    onDispose () {
        console.log("Dispose AuthRoom");
    }

}

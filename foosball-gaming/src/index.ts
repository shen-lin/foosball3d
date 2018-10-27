import * as path from "path";
import * as serveIndex from "serve-index";
import { createServer } from "http";
import { Server } from "colyseus";
import { monitor } from "@colyseus/monitor";
import * as WebSocket from "ws";
import { StandardRoom } from "./rooms/standard/StandardRoom";
import { CLIENT_RENEG_WINDOW } from "tls";

const port = 7000;

const gameServer = new Server({
  engine: WebSocket.Server,
  server: createServer()
});

gameServer.register("standard", StandardRoom);
gameServer.listen(port);
console.log(`Listening on http://localhost:${port}`);

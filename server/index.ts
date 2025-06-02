import express, { Response } from "express";
import { WebSocket, WebSocketServer } from "ws";
const PORT = process.env.PORT ?? 8080;

const app = express();
app.use(express.json());

app.get("/", (_, res: Response) => {
  res.json({ message: "Server is running." }).status(200);
});
const server = app.listen(PORT, () => {
  console.log("Server is running at:", `http://localhost:${PORT}`);
});

const wss = new WebSocketServer({ server });

wss.on("connection", (socket, req) => {
  socket.on("error", (error) => console.error(error));
  socket.on("message", (data, isBinary) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  });
  socket.send("Client Connected.");
});

import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./lib/db.js";
import roomRouter from "./routes/roomRoutes.js";
import { Server } from "socket.io";
import http from "http";
import { createRoomDoc, getRoomDoc } from "./lib/roomStore.js";
import Room from "./models/roomModel.js";
import * as Y from "yjs"; 


const app = express(); 

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

// Middlewares
app.use(cors({
    origin: process.env.CLIENT_URL,
}));

app.use(express.json());

// Routes
app.get('/', (_, res) => {
    res.send("Server is live!");
});

app.use("/api/rooms", roomRouter);


io.on("connection", (socket) => {
   console.log(`[Socket] Connected: ${socket.id}`);

   socket.on("join-room", async (roomId) => {
      // Join Socket.IO room
      socket.join(roomId);

      console.log(`[Socket] ${socket.id} joined ${roomId}`);

      // Get the Y.DOC for this room
      let ydoc = getRoomDoc(roomId);

      // if this is the first user
      // create the ydoc
      if(!ydoc){
        const room = await Room.findById(roomId);

        if(!room) {
          socket.emit("room-error", {
            error: "Room not found"
          });

          return;
        }

        ydoc = createRoomDoc(roomId, room.code);

      }

        // Send current Yjs state ONLY to this user
      const update = Y.encodeStateAsUpdate(ydoc);
      socket.emit("sync-state", update);
   });

   socket.on("yjs-update", ({ roomId, update }) => {
    // console.log("yjs-update recieved", roomId);
     const ydoc = getRoomDoc(roomId);

     if (!ydoc) {
       return;
     }

     // Update server's Y.Doc
     Y.applyUpdate(ydoc, update);

     // Send update to everyone except sender
     socket.to(roomId).emit("yjs-update", update);
   });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    })
});



// App startup
const port = process.env.PORT ?? 8000;
connectDB()
  .then(() => {
    httpServer.listen(port, () => {
      console.log(`[Server] Running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("[Server] Startup failed:", error);
    process.exit(1);
  });
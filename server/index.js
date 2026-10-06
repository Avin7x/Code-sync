import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./lib/db.js";
import roomRouter from "./routes/roomRoutes.js";
import { Server } from "socket.io";
import http from "http";
import { startRedisSubscriber } from "./utils/startRedisSubscriber.js";

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
  
  
   socket.on("join-room", async ({roomId}) => {
      // Join Socket.IO room
      socket.join(roomId);
      console.log(`[Socket] ${socket.id} joined ${roomId}`);

      socket.roomId = roomId;

      
    
     socket.on("yjs-sync", ({ roomId, message }) => {

       socket.to(roomId).emit(
         "yjs-sync",
         message
       );

     });
   });


  socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
  })

  
});



// App startup
const port = process.env.PORT ?? 8000;
connectDB()
  .then(async () => {
    
    await startRedisSubscriber(io);

    httpServer.listen(port, () => {
      console.log(`[Server] Running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("[Server] Startup failed:", error);
    process.exit(1);
  });
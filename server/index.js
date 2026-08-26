import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./lib/db.js";
import roomRouter from "./routes/roomRoutes.js";

const app = express();

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


// App startup
const port = process.env.PORT ?? 8000;
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`[Server] Running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("[Server] Startup failed:", error);
    process.exit(1);
  });
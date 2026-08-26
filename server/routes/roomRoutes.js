import { Router } from "express";
import { createRoom, joinRoom } from "../controllers/roomController.js";

const roomRouter = Router();

roomRouter.post('/create', createRoom);
roomRouter.get('/:id', joinRoom);

export default roomRouter;
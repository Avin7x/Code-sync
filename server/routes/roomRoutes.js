import { Router } from "express";
import { createRoom, execute, joinRoom } from "../controllers/roomController.js";

const roomRouter = Router();

roomRouter.post('/create', createRoom);
roomRouter.get('/:id', joinRoom);
roomRouter.post('/execute', execute);

export default roomRouter;
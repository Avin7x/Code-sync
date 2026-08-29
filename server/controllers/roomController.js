import mongoose from "mongoose";
import Room from "../models/roomModel.js";

export async function createRoom (req, res) {
    const { roomName } = req.body;
    if(!roomName.trim()) {
        return res.status(400).json({error: "Name is required"});
    }
    const room = await Room.create({
        name: roomName.trim(),
        
    });

    return res.status(201).json({ room });
}

export async function joinRoom(req, res) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            error: "Room not found",
        });
    }
    const room = await Room.findById(id);
    if(!room){
        return res.status(404).json({error: "No room found"});
    }
    return res.json({room});
}
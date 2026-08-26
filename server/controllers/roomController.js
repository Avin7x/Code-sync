import Room from "../models/roomModel.js";

export async function createRoom (req, res) {
    const { name, language, code } = req.body;
    if(!name.trim()) {
        return res.status(400).json({error: "Name is required"});
    }
    const room = await Room.create({
        name: name.trim(),
        language,
        code
    });

    return res.status(201).json({ room });
}

export async function joinRoom(req, res) {
    const { id } = req.params;
    const room = await Room.findById(id);
    if(!room){
        return res.status(404).json({error: "No room found"});
    }
    return res.json({room});
}
import Room from "../models/roomModel.js";
import { nanoid } from "nanoid";
import { createClient }  from "redis";

export async function createRoom (req, res) {
    const { name, userId } = req.body;
    if(!name.trim()) {
        return res.status(400).json({error: "Name is required"});
    }

    // create room id
    const roomId = nanoid(6).toUpperCase();
    
    const room = await Room.create({
        roomId,
        ownerId: userId.trim(),
        owner: name.trim(),
    });

    return res.status(201).json({ room });
}

export async function joinRoom(req, res) {
    const { id } = req.params;

    const room = await Room.findOne({roomId: id});
    if(!room){
        return res.status(404).json({error: "No room found"});
    }
    return res.json({room});
}


export async function execute(req, res) {
    // setup redis connection
    const client = createClient();

    client.on("error", (err) => {
        console.error("Redis client error", err);
    });

    await client.connect();

    // Get  job request from client;
    const { job } = req.body;

    if(!job) {
        await client.quit();
        return res.status(400).json({error:"Job is required"});
    }
    // push the job to redis list
    await client.lPush("execution-queue", JSON.stringify(job));
    console.log("Job added");

    await client.quit();

    return res.status(200).json({
        message: "Job added to execution queue",
  });

}
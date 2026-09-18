import client from "../lib/redisClient.js";

const subscriber = client.duplicate();

subscriber.on("error", (err) => {
    console.log("Redis subscriber error", err);
})
await subscriber.connect();

export async function startRedisSubscriber (io) {
    
    await subscriber.PSUBSCRIBE("room*", (message, channel) => {
        const roomId = channel.split(":")[1];
        const result = JSON.parse(message);

        console.log(`[Redis] Execution result for room ${roomId}:`, result);

        io.to(roomId).emit("execution-result", result);
    })
}
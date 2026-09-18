import { createClient } from "redis";

const client =  createClient();

client.on("error", (err) => {
    console.log("Redis client error", err);
});

await client.connect();
console.log("Redis connected");

export default client;
import { createClient } from "redis";

const client = createClient();

client.on("error", (err) => {
    console.error("Redis client error", err);
} );

await client.connect();

// Add task to redis list
const job = {
    language: "Javascript",
    code: "console.log('Hello World!');"
}

await client.lPush("execution-queue", JSON.stringify(job));
console.log("Job added");


await client.quit();
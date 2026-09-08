import { createClient } from "redis";
import { executeCode } from "./utils/executeCode.js";

const client = createClient();

client.on("error", (err) => {
    console.error("Redis client error", err);
});

await client.connect();

while(1){
    let job = await client.brPop("execution-queue", 0);
    job = JSON.parse(job.element);
    
    if(job){
        console.log("Recieved job", job);
        await executeCode(job);
    }
    
}
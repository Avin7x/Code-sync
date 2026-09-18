import client from "./lib/redisClient.js"
import { executeCode } from "./utils/executeCode.js";


while(1){
    let job = await client.brPop("execution-queue", 0);
    job = JSON.parse(job.element);
    
    if(job){
        console.log("Recieved job", job);
        await executeCode(job);
    }
    
}
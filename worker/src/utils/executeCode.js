import fs from "fs/promises";
import path from "path";
import { languageConfig } from "./languageConfig.js";
import { spawn } from "child_process";
import client from "../lib/redisClient.js";

// redis publisher client
const publisher = client.duplicate();
await publisher.connect();

export async function executeCode(job) {

  // Validate language configuration
  const config = languageConfig[job.language];
  if (!config) {
    throw new Error("Unsupported language");
  }

    // create temp directory for users code /temp/user-date.now()
  const tempDir = path.resolve("./temp");
  const userDir = path.join(
    tempDir,
    `user-${Date.now()}`
  );

  try {
    await fs.mkdir(userDir, { recursive: true });
    console.log('Directory created successfully!');
  } catch (err) {
    console.error(err);
  }

  const codeFilePath = path.join(
    userDir,
    config.file
  );

  try {
    await fs.writeFile(codeFilePath, job.code, "utf8");
    console.log("File saved successfully!");
  } catch (err) {
    console.error("Failed to save the file:", err);
  }


  // Execute code using Docker
  const dockerVolume =
    `${userDir.replace(/\\/g, "/")}:/workspace:ro`;

  const docker = spawn("docker", [
    "run",
    "--rm",
    "-i",
    "-v",
    dockerVolume,
    config.image,
    ...config.command,
  ]);

  if(job.input){
    docker.stdin.write(job.input);
    
  }
  docker.stdin.end();

  let stdOut = "";
  let stdErr = "";
  docker.stdout.on("data", (data) => {
    stdOut += data.toString();
    console.log("OUTPUT:", data.toString());
  });

  docker.stderr.on("data", (data) => {
    stdErr += data.toString();
    console.error("ERROR:", data.toString());
  });

  // Wait for docker to close 
  await new Promise((resolve, reject) => {

    docker.on("error", (error) => {
      reject(error);
    })

    docker.on("close", async (code) => {
      console.log("Docker exited with code:", code);

      const result = {
        output: stdOut,
        error: stdErr,
        exitCode: code
      }

      try {
        // publish the result on redis
        await publisher.PUBLISH(`room:${job.roomId}`, JSON.stringify(result));
        
      } catch (error) {
        console.log("Failed to publish result", error);
        reject(error);
      } finally {
        //   clean up temp directory
        try {
          await fs.rm(userDir, { recursive: true, force: true });
          resolve();
        } catch (error) {
          console.error("Failed to clean up directory", error);
          reject(error);
        }
      }

    });
  })


}
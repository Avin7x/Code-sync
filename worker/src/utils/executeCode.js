import fs from "fs/promises";
import path from "path";
import { languageConfig } from "./languageConfig.js";
import { spawn } from "child_process";

export async function executeCode(job) {

  const tempDir = path.resolve("./temp");

  const userDir = path.join(
    tempDir,
    `user-${Date.now()}`
  );

  await fs.mkdir(userDir, {
    recursive: true,
  });

  const config = languageConfig[job.language];

  if (!config) {
    
    throw new Error("Unsupported language");
  }

  const codeFilePath = path.join(
    userDir,
    config.file
  );

  await fs.writeFile(
    codeFilePath,
    job.code,
    "utf8"
  );

  // Execute code using Docker
  const dockerVolume =
    `${userDir.replace(/\\/g, "/")}:/workspace:ro`;

  const docker = spawn("docker", [
    "run",
    "--rm",
    "-v",
    dockerVolume,
    config.image,
    ...config.command,
  ]);

  docker.stdout.on("data", (data) => {
    console.log("OUTPUT:", data.toString());
  });

  docker.stderr.on("data", (data) => {
    console.error("ERROR:", data.toString());
  });

  docker.on("close", (code) => {
    console.log("Docker exited with code:", code);
  });

//   clean up temp directory
    try {
        await fs.rm(userDir, {recursive: true, force: true});
    } catch (error) {
        console.error("Failed to clean up directory", error);
    }
}
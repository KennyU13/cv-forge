import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import net from "node:net";

const image = process.env.DOCKER_IMAGE || "cv-flow:local";
const containerPort = Number(process.env.CONTAINER_PORT || 4173);
const startPort = Number(process.env.APP_PORT || 4173);
const envFile = process.env.ENV_FILE || ".env";

function readEnv(path) {
  if (!existsSync(path)) return {};

  return Object.fromEntries(
    readFileSync(path, "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const index = line.indexOf("=");
        const key = line.slice(0, index).trim();
        const rawValue = line.slice(index + 1).trim();
        return [key, rawValue.replace(/^["']|["']$/g, "")];
      }),
  );
}

function isPortFree(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", () => resolve(false));
    server.once("listening", () => {
      server.close(() => resolve(true));
    });
    server.listen(port, "127.0.0.1");
  });
}

async function findFreePort(from) {
  for (let port = from; port < from + 100; port += 1) {
    if (await isPortFree(port)) return port;
  }
  throw new Error(`No free port found between ${from} and ${from + 99}.`);
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      shell: process.platform === "win32",
      ...options,
    });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(" ")} exited with code ${code}`));
    });
  });
}

const env = readEnv(envFile);
const buildArgs = [
  "build",
  "-t",
  image,
  "--build-arg",
  `PUBLIC_SUPABASE_URL=${env.VITE_SUPABASE_URL || env.SUPABASE_URL || ""}`,
  "--build-arg",
  `PUBLIC_SUPABASE_PUBLISHABLE=${
    env.VITE_SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_PUBLISHABLE_KEY || ""
  }`,
  ".",
];

const hostPort = await findFreePort(startPort);
const containerName = `cv-flow-local-${hostPort}`;

await run("docker", buildArgs);

const runArgs = ["run", "--rm", "--name", containerName, "-p", `${hostPort}:${containerPort}`];

if (existsSync(envFile)) {
  runArgs.push("--env-file", envFile);
}

runArgs.push(image);

console.log(`\nCV Flow is starting on http://localhost:${hostPort}`);
console.log("Press Ctrl+C to stop the container.\n");

await run("docker", runArgs);

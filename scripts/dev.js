import { spawn } from "node:child_process";

const children = [];

function run(command, args) {
  const child = spawn(command, args, {
    stdio: "inherit",
    shell: true,
  });

  children.push(child);
  child.on("exit", (code) => {
    if (code && code !== 0) {
      process.exitCode = code;
    }
  });
}

run("node", ["server/index.js"]);
run("vite", []);

function shutdown() {
  for (const child of children) {
    child.kill();
  }
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

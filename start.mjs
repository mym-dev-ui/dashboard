import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const child = spawn(
  resolve(__dirname, "node_modules/.bin/next"),
  ["dev", "-p", "8081", "-H", "0.0.0.0"],
  { cwd: __dirname, stdio: "inherit", detached: false }
);

// Ignore SIGTERM to keep the process alive
process.on("SIGTERM", () => {
  // Do nothing — let Replit's port monitor keep tracking us
});

process.on("SIGINT", () => {
  child.kill("SIGINT");
  process.exit(0);
});

child.on("exit", (code) => {
  process.exit(code || 0);
});

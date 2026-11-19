import { loadEnv } from "vite";
import { handleMcp } from "../api/mcp.js";

// Serves the blog MCP endpoint in development and local preview, as Vercel does in production.
// Vercel puts its settings in the process environment; locally they come from .env files.
// Braces matter: Vite would treat a returned value as a hook to call later.
const serve = (server) => {
  const local = loadEnv(server.config.mode, process.cwd(), ["GHOST_", "BLOG_"]);
  for (const [name, value] of Object.entries(local)) process.env[name] ??= value;
  server.middlewares.use("/api/mcp", (req, res) => handleMcp(req, res));
};

export const localMcp = { name: "local-mcp", configureServer: serve, configurePreviewServer: serve };

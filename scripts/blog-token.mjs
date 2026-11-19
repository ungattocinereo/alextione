import { createHash, randomBytes } from "node:crypto";

// Creates an access token for one model. Usage: node scripts/blog-token.mjs <name> [--publish]
// The token is shown once; only its SHA-256 goes into the BLOG_MCP_TOKENS environment variable.
const [name, flag] = process.argv.slice(2);
if (!name || !/^[a-z0-9-]+$/.test(name) || (flag && flag !== "--publish")) {
  console.error("Usage: node scripts/blog-token.mjs <name> [--publish]   (name: lowercase letters, digits, hyphens)");
  process.exit(1);
}
const token = "atb_" + randomBytes(32).toString("base64url");
const entry = { sha256: createHash("sha256").update(token).digest("hex"), publish: flag === "--publish" };
console.log(`Token for "${name}" (give it to the model, it is not stored anywhere):\n\n  ${token}\n`);
console.log(`Add this entry to the BLOG_MCP_TOKENS JSON object:\n\n  ${JSON.stringify({ [name]: entry })}\n`);

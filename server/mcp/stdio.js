import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { server } from "./mcpServer.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Load the root `.env` from the server directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "..", ".env") });

async function startStdio() {
  try {
    // We need MongoDB connected for our tools to run. 
    // This script replaces `app.js` when running locally via Claude's stdio configuration.
    if (!process.env.MONGO_URI) {
       console.error("MONGO_URI is missing from server/.env!");
       process.exit(1);
    }
    await mongoose.connect(process.env.MONGO_URI);
    
    // Attach the STDIO transport instead of SSE
    const transport = new StdioServerTransport();
    await server.connect(transport);
    
    // We do not close the mongoose connection here as the background node process stays alive.
  } catch (error) {
    console.error("Fatal error starting Stdio MCP Server:", error);
    process.exit(1);
  }
}

startStdio();

#!/usr/bin/env node
import readline from 'readline';
import dns from 'dns';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { executeMcpTool, MCP_TOOLS } from './routes/mcpRoutes.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '.env') });
dns.setServers(['8.8.8.8', '1.1.1.1']);

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://bama:XwBYXCAzmjbUnFz2@cluster0.ksbnq.mongodb.net/test?retryWrites=true&w=majority';

let isConnected = false;
async function ensureDb() {
  if (!isConnected) {
    await mongoose.connect(MONGO_URI);
    isConnected = true;
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', async (line) => {
  if (!line.trim()) return;
  try {
    const msg = JSON.parse(line);
    await ensureDb();

    if (msg.method === 'initialize') {
      const response = {
        jsonrpc: '2.0',
        id: msg.id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: { tools: {} },
          serverInfo: { name: 'money-mentor-mcp', version: '2.0.0' }
        }
      };
      process.stdout.write(JSON.stringify(response) + '\n');
      return;
    }

    if (msg.method === 'tools/list') {
      const response = {
        jsonrpc: '2.0',
        id: msg.id,
        result: { tools: MCP_TOOLS }
      };
      process.stdout.write(JSON.stringify(response) + '\n');
      return;
    }

    if (msg.method === 'tools/call') {
      const { name, arguments: args } = msg.params || {};
      try {
        const result = await executeMcpTool(name, args || {});
        process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id: msg.id, result }) + '\n');
      } catch (err) {
        process.stdout.write(JSON.stringify({
          jsonrpc: '2.0',
          id: msg.id,
          result: { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true }
        }) + '\n');
      }
      return;
    }

    if (msg.id !== undefined && msg.id !== null) {
      process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id: msg.id, result: {} }) + '\n');
    }
  } catch (e) {
    // ignore invalid JSON lines
  }
});

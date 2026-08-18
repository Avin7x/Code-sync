export const collaborators = [
  {
    id: "u_you",
    name: "You (Alex Rivera)",
    initials: "AR",
    color: "oklch(0.74 0.13 195)",
    status: "online",
    activeFile: "f_server",
    role: "owner",
  },
  {
    id: "u_mia",
    name: "Mia Chen",
    initials: "MC",
    color: "oklch(0.7 0.15 155)",
    status: "online",
    activeFile: "f_server",
    role: "editor",
  },
  {
    id: "u_jonas",
    name: "Jonas Weber",
    initials: "JW",
    color: "oklch(0.72 0.16 300)",
    status: "online",
    activeFile: "f_index",
    role: "editor",
  },
  {
    id: "u_priya",
    name: "Priya Nair",
    initials: "PN",
    color: "oklch(0.75 0.14 60)",
    status: "idle",
    activeFile: "f_package",
    role: "editor",
  },
  {
    id: "u_sam",
    name: "Sam Okoro",
    initials: "SO",
    color: "oklch(0.68 0.17 20)",
    status: "offline",
    activeFile: null,
    role: "viewer",
  },
]




export const fileContents = {
  f_server: `import express from "express"
import cors from "cors"
import { connectDatabase } from "./db.js"
import { registerRoutes } from "./routes.js"

const app = express()
const PORT = process.env.PORT || 4000

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL }))
app.use(express.json({ limit: "1mb" }))

// Realtime collaboration namespace
const sessions = new Map()

function trackPresence(socket, roomId) {
  const room = sessions.get(roomId) ?? new Set()
  room.add(socket.id)
  sessions.set(roomId, room)

  return () => {
    room.delete(socket.id)

    if (room.size === 0) {
      sessions.delete(roomId)
    }
  }
}

async function bootstrap() {
  await connectDatabase(process.env.MONGO_URL)
  registerRoutes(app)

  app.listen(PORT, () => {
    console.log(\`CodeSync API listening on :\${PORT}\`)
  })
}

// TODO: forward SIGTERM to graceful shutdown handler
bootstrap().catch((err) => {
  console.error("Failed to start server", err)
  process.exit(1)
})
`,

  f_index: `import { createRoot } from "react-dom/client"
import { EditorWorkspace } from "./workspace.js"
import { io } from "socket.io-client"

const socket = io(import.meta.env.VITE_WS_URL, {
  transports: ["websocket"],
  reconnectionAttempts: 5,
})

socket.on("connect", () => {
  console.log("connected as", socket.id)
})

const root = createRoot(document.getElementById("root"))
root.render(<EditorWorkspace socket={socket} />)
`,

  f_routes: `import { Router } from "express"

export function registerRoutes(app) {
  const router = Router()

  router.get("/health", (_req, res) => {
    res.json({
      status: "ok",
      uptime: process.uptime(),
    })
  })

  router.post("/rooms/:id/sync", async (req, res) => {
    const { id } = req.params
    const { ops } = req.body

    // apply operational transform to shared document
    const revision = await applyOps(id, ops)

    res.json({ revision })
  })

  app.use("/api", router)
}
`,

  f_db: `import { MongoClient } from "mongodb"

let client

export async function connectDatabase(url) {
  if (!url) {
    throw new Error("MONGO_URL is required")
  }

  client = new MongoClient(url)
  await client.connect()

  return client.db("codesync")
}

export function getCollection(name) {
  if (!client) {
    throw new Error("Database is not connected")
  }

  return client.db("codesync").collection(name)
}
`,

  f_package: `{
  "name": "codesync-server",
  "version": "1.4.0",
  "type": "module",
  "scripts": {
    "dev": "node --watch src/server.js",
    "start": "node src/server.js",
    "test": "vitest run"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.19.2",
    "mongodb": "^6.7.0",
    "socket.io": "^4.7.5"
  }
}
`,

  f_readme: `# CodeSync

Real-time collaborative code editor.

## Features

- Multi-cursor live editing
- Operational transform sync engine
- Containerized code execution (Docker)
- MongoDB-backed project storage

## Getting started

\`\`\`bash
pnpm install
pnpm dev
\`\`\`
`,

  f_env: `PORT=4000
CLIENT_URL=http://localhost:3000
MONGO_URL=mongodb://localhost:27017
VITE_WS_URL=ws://localhost:4000
`,
}

export const diagnostics = [
  {
    id: "diag_1",
    fileId: "f_server",
    line: 30,
    column: 1,
    severity: "warning",
    message: "TODO comment: graceful shutdown handler not implemented.",
    source: "eslint",
  },
  {
    id: "diag_2",
    fileId: "f_routes",
    line: 15,
    column: 28,
    severity: "error",
    message: "'applyOps' is not defined.",
    source: "no-undef",
  },
  {
    id: "diag_3",
    fileId: "f_index",
    line: 5,
    column: 16,
    severity: "warning",
    message:
      "'import.meta.env' may be undefined outside of a Vite build.",
    source: "ts(2571)",
  },
]

export const remoteCursors = [
  {
    collaboratorId: "u_mia",
    fileId: "f_server",
    line: 18,
    column: 24,
  },
  {
    collaboratorId: "u_jonas",
    fileId: "f_server",
    line: 27,
    column: 6,
  },
]

export const terminalLines = [
  "$ pnpm dev",
  "",
  "> codesync-server@1.4.0 dev",
  "> node --watch src/server.js",
  "",
  "Connecting to MongoDB at mongodb://localhost:27017 ...",
  "MongoDB connected → db: codesync",
  "CodeSync API listening on :4000",
  "socket.io: client connected 9fJ2x1 (Mia Chen)",
  "socket.io: client connected b7Kd0p (Jonas Weber)",
  "[sync] room src/server.js → revision 142 applied (2 ops)",
]

export const consoleLines = [
  {
    level: "log",
    text: "connected as 9fJ2x1",
  },
  {
    level: "log",
    text: "[presence] 3 collaborators in room src/server.js",
  },
  {
    level: "warn",
    text: "import.meta.env.VITE_WS_URL is undefined, falling back to ws://localhost:4000",
  },
  {
    level: "error",
    text: "Uncaught (in promise) TypeError: applyOps is not a function (routes.js:15)",
  },
  {
    level: "log",
    text: "[sync] flushed 2 pending operations",
  },
]

export const outputLines = [
  "Build started at 14:22:07",
  "vite v5.2.11 building for production...",
  "✓ 214 modules transformed.",
  "dist/index.html                 0.61 kB │ gzip:  0.34 kB",
  "dist/assets/index-8f2a1c.css   14.20 kB │ gzip:  3.11 kB",
  "dist/assets/index-3b9d7e.js   198.44 kB │ gzip: 62.08 kB",
  "✓ built in 1.84s",
]

export function findFile(nodes, id) {
  for (const node of nodes) {
    if (node.id === id) {
      return node
    }

    if (node.children) {
      const found = findFile(node.children, id)

      if (found) {
        return found
      }
    }
  }

  return null
}
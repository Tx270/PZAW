import { readFileSync } from "node:fs";

const index = readFileSync("public/index.html");
const favicon = readFileSync("public/favicon.ico");

const pathConfigs = [
  {
    path: "/",
    allowed_methods: ["GET"],
    handler: (req, res) => {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(index);
    },
  },
  {
    path: "/favicon.ico",
    allowed_methods: ["GET"],
    handler: (req, res) => {
      res.writeHead(200, { "Content-Type": "image/vnd.microsoft.icon" });
      res.end(favicon);
    },
  },
  {
    path: "/hellow",
    allowed_methods: ["GET"],
    handler: (req, res) => {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end("hi~");
    },
  },
];

export function handlePath(path, req, res) {
  for (let config of pathConfigs) {
    if (path === config.path) {
      if (config.allowed_methods.includes(req.method)) {
        config.handler(req, res);
      } else {
        res.writeHead(405, { "Content-Type": "text/plain" });
        res.end("Method not allowed\n");
      }
      break;
    }
  }
}

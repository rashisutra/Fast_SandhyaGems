import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // Serve static files with aggressive caching for hashed assets
  app.use(
    express.static(distPath, {
      maxAge: "1y", // Hashed assets can be cached for a long time
      immutable: true, // Signal that hashed assets won't change
      etag: true,
      lastModified: true,
      setHeaders: (res, filePath) => {
        // HTML files should not be cached aggressively
        if (filePath.endsWith(".html")) {
          res.setHeader("Cache-Control", "no-cache, must-revalidate");
        }
        // Add security header for all static files
        res.setHeader("X-Content-Type-Options", "nosniff");
      },
    })
  );

  // fall through to index.html if the file doesn't exist
  app.use("/{*path}", (_req, res) => {
    res.setHeader("Cache-Control", "no-cache, must-revalidate");
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

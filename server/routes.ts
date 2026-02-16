import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import type { Request, Response, NextFunction } from "express";

// ── In-memory cache for API responses ──────────────────
interface CacheEntry {
  data: unknown;
  timestamp: number;
}

const apiCache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached(key: string): unknown | null {
  const entry = apiCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    apiCache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key: string, data: unknown): void {
  apiCache.set(key, { data, timestamp: Date.now() });
}

// ── Simple rate limiter ────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 60; // 60 requests per minute per IP

function rateLimit(req: Request, res: Response, next: NextFunction): void {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    next();
    return;
  }

  record.count++;
  if (record.count > RATE_LIMIT_MAX) {
    res.status(429).json({ error: "Too many requests. Please try again later." });
    return;
  }

  next();
}

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  const entries = Array.from(rateLimitMap.entries());
  for (const [ip, record] of entries) {
    if (now > record.resetTime) rateLimitMap.delete(ip);
  }
}, 5 * 60 * 1000);

// ── Security headers middleware ────────────────────────
function securityHeaders(_req: Request, res: Response, next: NextFunction): void {
  // Allow iframe embedding in development (Replit preview)
  // Prevent MIME-type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");
  // Enable XSS protection
  res.setHeader("X-XSS-Protection", "1; mode=block");
  // Referrer policy
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  // Permissions policy — restrict sensitive browser features
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(self), payment=()"
  );
  // Remove powered-by header
  res.removeHeader("X-Powered-By");
  // Content Security Policy (relaxed for CDN assets)
  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://connect.facebook.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://wa.me https://sandhyagems.in https://www.facebook.com ws: wss:",
      "frame-ancestors *",
    ].join("; ")
  );
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Apply security middleware
  app.use(securityHeaders);
  app.use("/api", rateLimit);

  // Disable X-Powered-By globally
  app.disable("x-powered-by");

  // Proxy endpoint for Shopify products — with caching & error handling
  app.get("/api/products", async (req, res) => {
    try {
      // Check cache first
      const cacheKey = "shopify-products";
      const cached = getCached(cacheKey);
      if (cached) {
        res.setHeader("X-Cache", "HIT");
        res.setHeader("Cache-Control", "public, max-age=300, stale-while-revalidate=60");
        res.json(cached);
        return;
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout

      const response = await fetch(
        "https://sandhyagems.in/collections/best-gemstone-bracelets-online/products.json?limit=12",
        { signal: controller.signal }
      );
      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }
      const data = await response.json();

      // Cache the response
      setCache(cacheKey, data);

      res.setHeader("X-Cache", "MISS");
      res.setHeader("Cache-Control", "public, max-age=300, stale-while-revalidate=60");
      res.json(data);
    } catch (error: any) {
      console.error("Error fetching products:", error?.message || error);

      // Serve stale cache if available
      const stale = apiCache.get("shopify-products");
      if (stale) {
        res.setHeader("X-Cache", "STALE");
        res.json(stale.data);
        return;
      }

      res.status(502).json({ error: "Failed to fetch products. Please try again." });
    }
  });

  return httpServer;
}

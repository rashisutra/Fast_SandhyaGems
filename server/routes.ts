import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Proxy endpoint for Shopify products to bypass CORS - fetches from navratna collection
  app.get("/api/products", async (req, res) => {
    try {
      const response = await fetch("https://sandhyagems.in/collections/authentic-navratna-gemstones-online-sandhya-gems/products.json?limit=8");
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  return httpServer;
}

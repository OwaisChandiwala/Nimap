import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertCategorySchema, insertProductSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express) {
  // Categories API
  app.get("/api/categories", async (_req, res) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });

  app.post("/api/categories", async (req, res) => {
    const result = insertCategorySchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid category data" });
    }

    const category = await storage.createCategory(result.data);
    res.status(201).json(category);
  });

  app.patch("/api/categories/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const result = insertCategorySchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid category data" });
    }

    try {
      const category = await storage.updateCategory(id, result.data);
      res.json(category);
    } catch (error) {
      res.status(404).json({ message: "Category not found" });
    }
  });

  app.delete("/api/categories/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    try {
      await storage.deleteCategory(id);
      res.status(204).end();
    } catch (error) {
      res.status(404).json({ message: "Category not found" });
    }
  });

  // Products API
  app.get("/api/products", async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = 10;

    const { products, total } = await storage.getProducts(page, pageSize);
    res.json({ products, total, page, pageSize });
  });

  app.post("/api/products", async (req, res) => {
    const result = insertProductSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid product data" });
    }

    try {
      const product = await storage.createProduct(result.data);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: "Invalid category ID" });
    }
  });

  app.patch("/api/products/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const result = insertProductSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid product data" });
    }

    try {
      const product = await storage.updateProduct(id, result.data);
      res.json(product);
    } catch (error) {
      res.status(404).json({ message: "Product not found" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    try {
      await storage.deleteProduct(id);
      res.status(204).end();
    } catch (error) {
      res.status(404).json({ message: "Product not found" });
    }
  });

  return createServer(app);
}

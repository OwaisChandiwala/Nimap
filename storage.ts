import { type Category, type InsertCategory, type Product, type InsertProduct, type ProductWithCategory } from "@shared/schema";

export interface IStorage {
  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: InsertCategory): Promise<Category>;
  deleteCategory(id: number): Promise<void>;

  // Products
  getProducts(page: number, pageSize: number): Promise<{
    products: ProductWithCategory[];
    total: number;
  }>;
  getProduct(id: number): Promise<ProductWithCategory | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: InsertProduct): Promise<Product>;
  deleteProduct(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private categoryId: number;
  private productId: number;

  constructor() {
    this.categories = new Map();
    this.products = new Map();
    this.categoryId = 1;
    this.productId = 1;
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryId++;
    const category = { id, ...insertCategory };
    this.categories.set(id, category);
    return category;
  }

  async updateCategory(id: number, insertCategory: InsertCategory): Promise<Category> {
    const category = await this.getCategory(id);
    if (!category) throw new Error("Category not found");

    const updated = { ...category, ...insertCategory };
    this.categories.set(id, updated);
    return updated;
  }

  async deleteCategory(id: number): Promise<void> {
    if (!this.categories.has(id)) throw new Error("Category not found");
    this.categories.delete(id);
  }

  async getProducts(page: number, pageSize: number): Promise<{
    products: ProductWithCategory[];
    total: number;
  }> {
    const allProducts = Array.from(this.products.values());
    const total = allProducts.length;

    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    const paginatedProducts = allProducts.slice(start, end).map(product => {
      const category = this.categories.get(product.categoryId);
      if (!category) throw new Error("Category not found for product");
      return { ...product, category };
    });

    return {
      products: paginatedProducts,
      total
    };
  }

  async getProduct(id: number): Promise<ProductWithCategory | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;

    const category = this.categories.get(product.categoryId);
    if (!category) throw new Error("Category not found for product");

    return { ...product, category };
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    if (!this.categories.has(insertProduct.categoryId)) {
      throw new Error("Category not found");
    }

    const id = this.productId++;
    const product = { id, ...insertProduct };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: number, insertProduct: InsertProduct): Promise<Product> {
    if (!this.categories.has(insertProduct.categoryId)) {
      throw new Error("Category not found");
    }

    const product = await this.getProduct(id);
    if (!product) throw new Error("Product not found");

    const updated = { ...product, ...insertProduct };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: number): Promise<void> {
    if (!this.products.has(id)) throw new Error("Product not found");
    this.products.delete(id);
  }
}

export const storage = new MemStorage();
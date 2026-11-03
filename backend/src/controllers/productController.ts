import { Request, Response } from "express";
import { Product } from "../models/Product.js";

export async function getProducts(req: Request, res: Response): Promise<void> {
  try {
    const { cat, search, sort, minPrice, maxPrice, inStock } = req.query;
    const filter: any = {};

    if (cat && cat !== "all") {
      filter.cat = cat;
    }

    if (search) {
      filter.name = { $regex: String(search).trim(), $options: "i" };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (inStock === "true") {
      filter.stock = { $gt: 0 };
    }

    let query = Product.find(filter);

    if (sort === "price-low") {
      query = query.sort({ price: 1 });
    } else if (sort === "price-high") {
      query = query.sort({ price: -1 });
    } else if (sort === "rating") {
      query = query.sort({ rating: -1 });
    } else {
      query = query.sort({ id: 1 });
    }

    const products = await query;
    res.json({ success: true, count: products.length, data: products });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getProductById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    let product;

    if (!isNaN(Number(id))) {
      product = await Product.findOne({ id: Number(id) });
    }
    if (!product && id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    }

    if (!product) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }

    res.json({ success: true, data: product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getCategories(req: Request, res: Response): Promise<void> {
  try {
    const distinctCategories = await Product.distinct("cat");
    const counts = await Promise.all(
      distinctCategories.map(async (name) => {
        const count = await Product.countDocuments({ cat: name });
        const sampleProduct = await Product.findOne({ cat: name }).select("img");
        return {
          name,
          count,
          img: sampleProduct?.img || "/images/p1.jpg",
        };
      })
    );

    res.json({ success: true, count: counts.length, data: counts });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function createProduct(req: Request, res: Response): Promise<void> {
  try {
    const { name, cat, price, old, img, images, stock, desc, badge, isSale, isFeatured, isBestseller, sizes, colors, features } = req.body;

    if (!name || !cat || price === undefined || !img || !desc) {
      res.status(400).json({ success: false, message: "Name, category, price, img, and description are required." });
      return;
    }

    // Auto-calculate next numeric id if not passed
    let id = req.body.id;
    if (!id) {
      const highest = await Product.findOne().sort({ id: -1 });
      id = highest ? highest.id + 1 : 1;
    }

    const existing = await Product.findOne({ id });
    if (existing) {
      res.status(409).json({ success: false, message: `Product with id ${id} already exists.` });
      return;
    }

    const product = await Product.create({
      id,
      name,
      cat,
      price: Number(price),
      old: old ? Number(old) : undefined,
      img,
      images: Array.isArray(images) ? images : [img],
      stock: stock !== undefined ? Number(stock) : 10,
      desc,
      badge,
      isSale: Boolean(isSale),
      isFeatured: Boolean(isFeatured),
      isBestseller: Boolean(isBestseller),
      sizes: Array.isArray(sizes) && sizes.length ? sizes : ["39", "40", "41", "42", "43", "44"],
      colors: Array.isArray(colors) && colors.length ? colors : ["Black", "Brown"],
      features: Array.isArray(features) ? features : [],
    });

    res.status(201).json({ success: true, data: product, message: "Product created successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function updateProduct(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    let query: any = { id: Number(id) };
    if (isNaN(Number(id))) {
      query = { _id: id };
    }

    const product = await Product.findOneAndUpdate(query, req.body, { new: true, runValidators: true });
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }

    res.json({ success: true, data: product, message: "Product updated successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function adjustStock(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { delta } = req.body;

    if (delta === undefined || isNaN(Number(delta))) {
      res.status(400).json({ success: false, message: "Stock delta (number) is required." });
      return;
    }

    let query: any = { id: Number(id) };
    if (isNaN(Number(id))) {
      query = { _id: id };
    }

    const product = await Product.findOne(query);
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }

    const newStock = Math.max(0, product.stock + Number(delta));
    product.stock = newStock;
    await product.save();

    res.json({ success: true, data: product, message: `Stock adjusted to ${newStock}` });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function deleteProduct(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    let query: any = { id: Number(id) };
    if (isNaN(Number(id))) {
      query = { _id: id };
    }

    const product = await Product.findOneAndDelete(query);
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}


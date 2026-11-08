import { Request, Response } from "express";
import { Review } from "../models/Review.js";
import { Product } from "../models/Product.js";

export async function getReviews(req: Request, res: Response): Promise<void> {
  try {
    const { shoeName, rating } = req.query;
    const filter: any = { status: "approved" };

    if (shoeName) {
      filter.shoeName = { $regex: String(shoeName).trim(), $options: "i" };
    }
    if (rating) {
      filter.rating = Number(rating);
    }

    const reviews = await Review.find(filter).sort({ createdAt: -1 });

    // Calculate dynamic stats
    const allApproved = await Review.find({ status: "approved" });
    const totalCount = allApproved.length;
    const avgRating = totalCount > 0 ? (allApproved.reduce((acc, r) => acc + r.rating, 0) / totalCount).toFixed(1) : "0";

    const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    for (const r of allApproved) {
      if (distribution[r.rating] !== undefined) {
        distribution[r.rating] += 1;
      }
    }

    res.json({
      success: true,
      stats: {
        averageRating: Number(avgRating),
        totalReviews: totalCount,
        distribution,
      },
      data: reviews,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function createReview(req: Request, res: Response): Promise<void> {
  try {
    const { shoeName, city, rating, comment, productId } = req.body;
    const authorName = (req.body.userName || req.body.name || "").trim();

    if (!shoeName || !authorName || !city || !rating || !comment) {
      res.status(400).json({ success: false, message: "Shoe name, your name, city, rating, and comment are required." });
      return;
    }

    const review = await Review.create({
      shoeName: shoeName.trim(),
      userName: authorName,
      city: city.trim(),
      rating: Number(rating),
      comment: comment.trim(),
      productId: productId ? Number(productId) : undefined,
      status: "approved", // Auto-approved for verified customer feedback
      verified: true,
    });

    if (productId) {
      await Product.updateOne({ id: Number(productId) }, { $inc: { reviews: 1 } });
    }

    res.status(201).json({ success: true, data: review, message: "Thank you! Your review has been published." });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getAdminReviews(req: Request, res: Response): Promise<void> {
  try {
    const { status, search } = req.query;
    const filter: any = {};

    if (status && status !== "all") {
      filter.status = status;
    }
    if (search) {
      const s = String(search).trim();
      filter.$or = [
        { userName: { $regex: s, $options: "i" } },
        { shoeName: { $regex: s, $options: "i" } },
        { comment: { $regex: s, $options: "i" } },
      ];
    }

    const reviews = await Review.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function updateReviewStatus(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { status, verified } = req.body;

    const review = await Review.findById(id);
    if (!review) {
      res.status(404).json({ success: false, message: "Review not found" });
      return;
    }

    if (status && ["pending", "approved", "rejected"].includes(status)) {
      review.status = status;
    }
    if (typeof verified === "boolean") {
      review.verified = verified;
    }

    await review.save();

    res.json({ success: true, data: review, message: "Review updated successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function deleteReview(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      res.status(404).json({ success: false, message: "Review not found" });
      return;
    }

    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}


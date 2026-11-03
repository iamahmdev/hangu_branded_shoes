import { Request, Response } from "express";
import { Subscriber } from "../models/Subscriber.js";

export async function subscribe(req: Request, res: Response): Promise<void> {
  try {
    const { email } = req.body;

    if (!email || !email.includes("@")) {
      res.status(400).json({ success: false, message: "Valid email address is required." });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await Subscriber.findOne({ email: cleanEmail });

    if (existing) {
      if (!existing.isActive) {
        existing.isActive = true;
        await existing.save();
        res.json({ success: true, message: "Welcome back! Your subscription has been reactivated." });
        return;
      }
      res.json({ success: true, message: "You are already subscribed to our VIP newsletter." });
      return;
    }

    await Subscriber.create({ email: cleanEmail });

    res.status(201).json({
      success: true,
      message: "Subscribed successfully! Use code HANGU10 for 10% OFF on your first order.",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getSubscribers(req: Request, res: Response): Promise<void> {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    res.json({ success: true, count: subscribers.length, data: subscribers });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function deleteSubscriber(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const subscriber = await Subscriber.findByIdAndDelete(id);
    if (!subscriber) {
      res.status(404).json({ success: false, message: "Subscriber not found" });
      return;
    }

    res.json({ success: true, message: "Subscriber removed successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}


import { Request, Response } from "express";
import { Inquiry } from "../models/Inquiry.js";

export async function createInquiry(req: Request, res: Response): Promise<void> {
  try {
    const { name, phone, email, subject, message, source = "website" } = req.body;

    if (!name || !phone || !subject || !message) {
      res.status(400).json({ success: false, message: "Name, phone, subject, and message are required." });
      return;
    }

    const inquiry = await Inquiry.create({
      name: name.trim(),
      phone: phone.trim(),
      email: email ? email.trim().toLowerCase() : undefined,
      subject: subject.trim(),
      message: message.trim(),
      source,
      status: "new",
    });

    res.status(201).json({
      success: true,
      data: inquiry,
      message: "Thank you! Your message has been received. Our team will contact you shortly.",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getInquiries(req: Request, res: Response): Promise<void> {
  try {
    const { status, search } = req.query;
    const filter: any = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    if (search) {
      const s = String(search).trim();
      filter.$or = [
        { name: { $regex: s, $options: "i" } },
        { phone: { $regex: s, $options: "i" } },
        { subject: { $regex: s, $options: "i" } },
        { message: { $regex: s, $options: "i" } },
      ];
    }

    const inquiries = await Inquiry.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: inquiries.length, data: inquiries });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function updateInquiryStatus(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const inquiry = await Inquiry.findById(id);
    if (!inquiry) {
      res.status(404).json({ success: false, message: "Inquiry not found" });
      return;
    }

    if (status && ["new", "in_progress", "resolved", "archived"].includes(status)) {
      inquiry.status = status;
    }
    if (adminNotes !== undefined) {
      inquiry.adminNotes = adminNotes;
    }

    await inquiry.save();

    res.json({ success: true, data: inquiry, message: "Inquiry updated successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function deleteInquiry(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const inquiry = await Inquiry.findByIdAndDelete(id);
    if (!inquiry) {
      res.status(404).json({ success: false, message: "Inquiry not found" });
      return;
    }

    res.json({ success: true, message: "Inquiry deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}


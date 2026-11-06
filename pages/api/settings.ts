import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }

  return res.status(200).json({
    success: true,
    data: {
      storeName: "Hangu Branded Shoes",
      whatsappNumber: "923333147691",
      address: "Hangu tall road tahir markit hangu brand shoes 👟",
      shopTiming: "8:00 AM to 5:00 PM",
      freeShippingThreshold: 5000,
      standardShippingFee: 250,
      heroSubtitle: "Handcrafted Luxury Footwear",
      currency: "PKR",
    },
  });
}

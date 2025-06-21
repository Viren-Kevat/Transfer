const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
require("dotenv").config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
router.post("/create-order", async (req, res) => {
  try {
    const { plan, userId } = req.body;
    console.log(`Creating order for user: ${userId} with plan: ${plan}`);
    // Define plan amounts (should match frontend)
    const PLAN_AMOUNTS = {
      bronze: 10000,
      silver: 30000,
      gold: 100000,
    };
    if (!PLAN_AMOUNTS[plan])
      return res.status(400).json({ error: "Invalid plan" });
    const shortUserId = String(userId).slice(-8); // Use last 8 chars of userId
    const options = {
      amount: PLAN_AMOUNTS[plan],
      currency: "INR",
      receipt: `rcpt_${shortUserId}_${Date.now()}`.slice(0, 39),
      payment_capture: 1,
    };
    try {
      const order = await razorpay.orders.create(options);
      res.json(order);
    } catch (err) {
      console.error("Razorpay order creation error:", err);
      res
        .status(500)
        .json({ error: "Failed to create order", details: err.message });
    }
  } catch (err) {
    console.error("Payments route error:", err);
    res
      .status(500)
      .json({ error: "Failed to create order (outer)", details: err.message });
  }
});

module.exports = router;

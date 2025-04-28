const express = require("express");
const Razorpay = require("razorpay");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { PaymentModel, UserSchemabillModel } = require("../db"); // ✅ Correct import
require("dotenv").config();

const Paymentrouter = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Middleware to verify user token
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_USER_PASSWORD); // ✅ Corrected
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

// Create Razorpay Order
Paymentrouter.post("/create-order", authMiddleware, async (req, res) => {
  try {
    const { amount, type, billMonth } = req.body;

    if (!amount || amount <= 0 || !type) {
      return res.status(400).json({ message: "Invalid amount or type" });
    }

    const options = {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: `receipt_${Math.random().toString(36).substring(7)}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    // Save payment record
    const payment = new PaymentModel({
      userId: req.user.id,
      razorpayOrderId: order.id,
      amount: order.amount,
      type,
      billMonth: type === "bill" ? billMonth : undefined,
    });
    await payment.save();
    console.log(payment);

    res.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Error creating Razorpay order:", err);
    res.status(500).json({ message: "Error creating Razorpay order" });
  }
});

// Verify Payment
Paymentrouter.post("/verify-payment", authMiddleware, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, type, billMonth } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // Update payment status to completed
      const payment = await PaymentModel.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id, userId: req.user.id },
        { razorpayPaymentId: razorpay_payment_id, status: "completed" },
        { new: true }
      );

      if (!payment) {
        return res.status(404).json({ message: "Payment record not found" });
      }

      // Update student record
      if (type === "bill" && billMonth) {
        // For bill payment -> mark bill as Paid
        await UserSchemabillModel.updateOne(
          { _id: req.user.id, "billHistory.month": billMonth },
          { $set: { "billHistory.$.status": "Paid" } }
        );
      } else if (type === "fee") {
        // For fee payment -> reduce pendingFees
        await UserSchemabillModel.updateOne(
          { _id: req.user.id },
          { $inc: { pendingFees: -(payment.amount / 100) } } // payment.amount is in paise
        );
      }

      res.json({ message: "Payment verified successfully" });
    } else {
      // Signature mismatch -> Payment failed
      await PaymentModel.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id, userId: req.user.id },
        { status: "failed" }
      );
      res.status(400).json({ message: "Invalid payment signature" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ message: "Error verifying payment" });
  }
});

module.exports = {
  Paymentrouter,
};

const express = require("express");
const Transaction = require("../models/transaction");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SK);

exports.postPayment = async (req, res, next) => {
  try {
    const { userId, orderId, amount, paymentMethod } = req.body;
    // Create a PaymentIntent with the order amount and currency
    // This example sets up an endpoint using the Express framework.
    // Watch this video to get started: https://youtu.be/rPR2aJ6XnAc.

    // Use an existing Customer ID if this is a returning customer.
    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2022-11-15" }
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "INR",
      customer: customer.id,
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Creating an invoice

    const newTransaction = new Transaction({
      userId,
      orderId,
      amount,
    });

    await newTransaction.save();

    res.send({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey:
        "pk_test_51NMyLEEuOjFLJVPuq4bSZaqs1fbFro4PKBhANuxTByGDUhog4xbfxXt2U7IDTnzf3Qwnt664KRvs5bliKb9w5lhr00dAD8QEmK",
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

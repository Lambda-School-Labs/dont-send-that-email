const express = require("express");
const stripe = require("../constants/stripe");
const router = express.Router();
const populateUser = require("../middlewares/populateUser");
const db = require("../data/dbconfig");

router.use(populateUser);

const postStripeCharge = (user, res) => async (stripeErr, stripeRes) => {
  console.log("response object", res);
  if (stripeErr) {
    res.status(500).send({ error: stripeErr });
  } else {
    const id = (await db("subscriptions").insert({
      user_id: user.id,
      transaction_id: stripeRes.id,
      duration: 30,
    }))[0];
    res.status(200).send({ success: stripeRes, id });
  }
};

router.get("/", (req, res) => {
  res.send({
    user: req.user,
    message: "Transmitting - Stripe checkout server!",
    timestamp: new Date().toISOString(),
  });
});

router.post("/", async (req, res) => {
  console.log("router response object", res);
  stripe.charges.create(req.body, postStripeCharge(req.user, res));
});

module.exports = router;

const express = require("express");
const stripe = require("stripe")("STRIPE_SECRET_KEY");
console.log(typeof stripe);

const app = express();
app.use(express.json());

app.use("/public", express.static(__dirname + "/public"));
app.get("/health", (req, res) => res.send("Ok"));

app.post("/pay", async (request, response) => {
  try {
    let intent;
    if (request.body.payment_method_id) {
      // Create the PaymentIntent
      intent = await stripe.paymentIntents.create({
        payment_method: request.body.payment_method_id,
        amount: 100,
        currency: "usd",
        confirmation_method: "manual",
        confirm: true,
        return_url: "http://localhost:8080/public/redirect.html",
      });
    } else if (request.body.payment_intent_id) {
      intent = await stripe.paymentIntents.confirm(
        request.body.payment_intent_id
      );
    }
    response.send(generateResponse(intent));
  } catch (e) {
    console.log(e.message);
    return response.send({ error: e.message });
  }
});

const generateResponse = (intent) => {
  if (
    intent.status === "requires_action" &&
    intent.next_action.type === "use_stripe_sdk"
  ) {
    return {
      requires_action: true,
      payment_intent_client_secret: intent.client_secret,
    };
  } else if (intent.status === "succeeded") {
    console.log(intent);
    return {
      success: true,
    };
  } else {
    return {
      error: "Invalid PaymentIntent status",
    };
  }
};

app.listen(8080, () => {
  console.log("Server is running");
});

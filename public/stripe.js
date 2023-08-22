const stripe = Stripe(
  "STRIPE_PUBLIC_KEY"
);

const elements = stripe.elements();

const style = {
  base: {
    color: "#32325d",
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: "antialiased",
    fontSize: "16px",
    "::placeholder": {
      color: "#aab7c4",
    },
  },
  invalid: {
    color: "#fa755a",
    iconColor: "#fa755a",
  },
};

const cardElement = elements.create("card", { style });
cardElement.mount("#card-element");

const form = document.getElementById("payment-form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const result = await stripe.createPaymentMethod({
    type: "card",
    card: cardElement,
    billing_details: {
      name: "Jenny Rosen",
    },
  });

  stripePaymentMethodHandler(result);
});

const stripePaymentMethodHandler = async (result) => {
  if (result.error) {
  } else {
    const res = await fetch("/pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        payment_method_id: result.paymentMethod.id,
      }),
    });
    const paymentResponse = await res.json();

    handleServerResponse(paymentResponse);
  }
};

const handleServerResponse = (paymentResponse) => {
  if (paymentResponse.success) {
    alert("Payment successful");
  } else {
    alert("Payment failed");
    console.log(paymentResponse);
  }
};

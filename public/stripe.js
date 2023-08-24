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

const paymentform = document.getElementById("payment-form");
paymentform.addEventListener("submit", async (event) => {
  event.preventDefault();
  const captureLater = document.getElementById("capture-later").checked;
  const amountToPay = Number(document.getElementById("amount_to_pay").value) * 100;

  const result = await stripe.createPaymentMethod({
    type: "card",
    card: cardElement,
    billing_details: {
      name: "Jenny Rosen",
    },
  });

  stripePaymentMethodHandler(result, amountToPay, captureLater);
});

const stripePaymentMethodHandler = async (result, amountToPay, captureLater) => {
  if (result.error) {
  } else {
    const res = await fetch("/pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        payment_method_id: result.paymentMethod.id,
        amount_to_pay: amountToPay,
        capture_later: captureLater,
      }),
    });
    const paymentResponse = await res.json();

    handleServerResponse(paymentResponse);
  }
};

const handleServerResponse = (paymentResponse) => {
  console.log(paymentResponse);
  if (paymentResponse.success) {
    if (paymentResponse.requires_capture) {
      document.getElementById("payment_intent_id").value = paymentResponse.payment_details.payment_intent_id;
      document.getElementById("authorized_amount").innerHTML = (paymentResponse.payment_details.authorized_amount / 100).toFixed(2);
      document.getElementById("capture-form").hidden = false;
      alert("Payment successful, needs to be captured");
      return;
    }
    alert("Payment successful");
    document.location.reload();
  } else if (paymentResponse.canceled) {
    alert("Payment canceled");
    document.location.reload();
  } else {
    alert("Error");
    console.log("Error", paymentResponse);
  }
};

const captureForm = document.getElementById("capture-form");
captureForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const reqBody = {
    payment_intent_id: document.getElementById("payment_intent_id").value
  };
  if (document.getElementById("amount_to_capture").value)
    reqBody.amount_to_capture = Number(document.getElementById("amount_to_capture").value) * 100;

  const res = await fetch("/capture", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reqBody),
  });
  const captureResponse = await res.json();
  handleServerResponse(captureResponse);
});

const cancelButton = document.getElementById("cancel-payment");
cancelButton.addEventListener("click", async (event) => {
  event.preventDefault();

  const reqBody = {
    payment_intent_id: document.getElementById("payment_intent_id").value
  };

  const res = await fetch("/cancel", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reqBody),
  });
  const cancelResponse = await res.json();
  handleServerResponse(cancelResponse);
});
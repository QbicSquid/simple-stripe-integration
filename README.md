# simple-stripe-integration
Pay, capture payments, cancel payments using stripe.

## Requirements

Node JS

## Usage

1. Create a Stripe account. Get the public key and secret key from Stripe dashboard. (This could be done in developer mode for testing)
2. Add the Stripe public key to the frontend.<br>
   > In the file public/stripe.js, replace the string STRIPE_PUBLIC_KEY with your public key.
4. Add the Stripe secret key to the backend.<br>
   > In the file index.js, replace the string STRIPE_SECRET_KEY with your secret key.
5. In the project root, execute the following commands.<br>
   > npm install<br>
   > npm run dev
6. Access http://localhost:8080/public/stripe.html in your browser and make payments. Observe the stripe dashboard.

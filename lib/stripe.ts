import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
console.log("stripe secret key",process.env.STRIPE_SECRET_KEY)
export { stripe };
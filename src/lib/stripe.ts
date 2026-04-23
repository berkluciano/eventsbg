import Stripe from "stripe";
export { SERVICE_FEE_CENTS } from "./constants";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

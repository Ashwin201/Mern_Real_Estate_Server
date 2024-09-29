import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`);

export const Checkout = async (req, res) => {
  try {
    const { cart } = req.body;
    // console.log(cart);
    const lineItems = cart?.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item?.post?.title,
            images: [item?.post?.images[0]],
          },
          unit_amount: Math.round(item?.post?.price),
        },
        quantity: item?.quantity,
      };
    });
    // console.log("gggsd", lineItems);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `https://homiorentals.onrender.com/checkout/success?payment_status=success&message=Thank_you_for_using_homiorentals`,
      cancel_url: `https://homiorentals.onrender.com/cart`,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Checkout error:", error.message);
    res.status(500).json({ message: error.essage });
  }
};

// server.js
const express = require('express');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.use(express.static('public'));
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  const { amount } = req.body; // استقبل المبلغ من الفرونت إند

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Amount must be positive" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'egp', // يمكنك تغيير العملة هنا
            product_data: {
              name: 'ChanZel Order',
            },
            unit_amount: amount, // Stripe expects amount in cents (e.g. 100 EGP = 10000)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://ecommerce-website-chan-zel-git-main-nermeenkamals-projects.vercel.app/success.html',
      cancel_url: 'https://ecommerce-website-chan-zel-git-main-nermeenkamals-projects.vercel.app/cancel.html',
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

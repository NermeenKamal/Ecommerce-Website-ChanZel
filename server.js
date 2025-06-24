// server.js
const express = require('express');
const app = express();
const stripe = require('stripe')('sk_test_YourSecretKeyHere'); // حطي هنا Secret key

app.use(express.static('public'));
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  const { priceId, quantity } = req.body; // البيانات اللي هتبعتها من الفرونت إند

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId, // معرف المنتج أو السعر من Stripe dashboard
          quantity: quantity || 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://yourdomain.com/success.html',
      cancel_url: 'https://yourdomain.com/cancel.html',
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

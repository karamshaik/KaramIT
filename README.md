# Online store (static, no build step)

Open `index.html` in a browser, or upload the whole folder to Netlify, Vercel, GitHub Pages or any web host.

## Make it yours (3 files)
- `js/config.js`: store name, tagline, currency, WhatsApp number, email, shipping, tax, colours.
- `js/products.js`: your products (name, category, price, mrp, stock, image, description). Categories, filters and search build themselves from this list.
- `img/`: replace the placeholder pictures with your own photos and point `img:` at them.

## How ordering works
The customer fills in name, phone and address; the cart opens WhatsApp (and optionally email) with the full order ready to send. There is no online payment or server: you confirm the order and collect payment yourself (UPI, cash on delivery, etc.).
The cart is saved in the customer's browser only.

## Later upgrades
Online payments (Razorpay or Stripe), a database and admin panel, and order tracking all need a server. Keep `products.js` as the data shape and swap it for an API call.

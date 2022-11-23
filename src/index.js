const express = require("express");
const app = express();
const stripe = require("stripe")(
  "sk_test_51LVhgnAumJv74xi4mpuvEHppE80K5BDM8JShLqCCaOs8tw9c3thMY8MkhaNhojiOF3Cpef2b1ukGfPxNmKXBQiKJ007Fg1IRlr"
);
const bodyParser = require("body-parser");


const jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.post("/create-checkout-session", urlencodedParser, async (req, res) => {
  console.log(req);
  console.log(res);
  const { price } = req.body;
  const checkoutInfo = {
    payment_method_types: ['card'],

    line_items: [
      {
        price_data: {
          currency: "brl",
          product_data: {
            name: "Comanda",
          },
          unit_amount: price,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "http://localhost:4242/success",
    cancel_url: "http://localhost:4242/cancel",
  };
  const session = await stripe.checkout.sessions.create(checkoutInfo);

  res.redirect(303, session.url);
});

app.listen(4242, () => console.log(`Listening on port ${4242}!`));

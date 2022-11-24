const express = require("express");
const app = express();
const stripe = require("stripe")(
  "sk_test_51LVhgnAumJv74xi4mpuvEHppE80K5BDM8JShLqCCaOs8tw9c3thMY8MkhaNhojiOF3Cpef2b1ukGfPxNmKXBQiKJ007Fg1IRlr"
);
const bodyParser = require("body-parser");
var cors = require('cors')


const jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var corsOptions = {
  origin: 'http://54.233.177.232:8080',
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/create-checkout-session", urlencodedParser, async (req, res) => {
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

app.listen(8080, () => console.log(`Listening on port ${4242}!`));

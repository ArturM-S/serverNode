const express = require("express");
const app = express();
const stripe = require("stripe")(
  "sk_test_51LVhgnAumJv74xi4mpuvEHppE80K5BDM8JShLqCCaOs8tw9c3thMY8MkhaNhojiOF3Cpef2b1ukGfPxNmKXBQiKJ007Fg1IRlr"
);
const bodyParser = require("body-parser");
var cors = require('cors')


const jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
}

//...
app.configure(function() {
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'cool beans' }));
  app.use(express.methodOverride());
  app.use(allowCrossDomain);
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});
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

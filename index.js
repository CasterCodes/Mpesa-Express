require("dotenv").config();

const handler = require("./controllers/lipanaMpesa.controller");

const middleware = require("./middleware/getauthtoken.middleware");

const express = require("express");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Lipa na Mpesa ");
});

app.post("/auth-token", middleware.getAuthToken, handler.lipaNaMpesaHandler);

app.post("/mpesa-callback-realestate", handler.lipaNaMpesaCallBackHandler);

app.listen(PORT, () => console.log(`Server running on ${PORT}`));

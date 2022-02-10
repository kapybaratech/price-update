const express = require("express");
const {
  getPriceMiddleware: getShopeePriceMiddleware,
} = require("./shopeePrice");
const {
  getPriceMiddleware: getLazadaPriceMiddleware,
} = require("./lazadaPrice");
const app = express();
const port = 3001;

const errorMiddleware = (error, req, res, next) => {
  try {
    const status = error.status || 500;
    const message = error.message || "Something went wrong";

    res.status(status).json({ message });
  } catch (error) {
    next(error);
  }
};

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/shopeePrice", getShopeePriceMiddleware);
app.post("/lazadaPrice", getLazadaPriceMiddleware);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const puppeteer = require("puppeteer");

const priceString = ".pdp-price_size_xl";

const getPrice = async (link) => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto(link, {
    waitUntil: "networkidle2",
  });

  await page.waitForSelector(priceString);
  let element = await page.$(priceString);
  let value = await page.evaluate((el) => el.textContent, element);

  await browser.close();
  return value;
};

const getPriceMiddleware = async (req, res, next) => {
  try {
    const value = await getPrice(req.body.link);
    res.send(value);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getPriceMiddleware,
};

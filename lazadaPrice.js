const { getPuppeteerInstance } = require("./util");

const priceString = ".pdp-price_size_xl";

const getPrice = async (link) => {
  const browser = await getPuppeteerInstance();
  const page = await browser.newPage();
  let value;
  try {
    await page.goto(link, {
      waitUntil: "networkidle2",
    });

    await page.waitForSelector(priceString);
    let element = await page.$(priceString);
    value = await page.evaluate((el) => el.textContent, element);
  } catch (e) {
    console.log(e);
  } finally {
    await page.close();
    return value;
  }
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

const puppeteer = require("puppeteer");

const priceString = "._2v0Hgx";

const getPrice = async (link, variations) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  let value;
  try {
    await page.goto(link, {
      waitUntil: "networkidle2",
    });

    for (const variation of variations) {
      await Promise.all([
        page.click(`.product-variation[aria-label="${variation}"]`),
        waitForNetworkIdle(page, 500, 0), // equivalent to 'networkidle0'
      ]);
    }

    await page.waitForSelector(priceString);
    let element = await page.$(priceString);
    value = await page.evaluate((el) => el.textContent, element);
  } catch (e) {
    console.log(e);
  } finally {
    await browser.close();
  }
  return value;
};

function waitForNetworkIdle(page, timeout, maxInflightRequests = 0) {
  page.on("request", onRequestStarted);
  page.on("requestfinished", onRequestFinished);
  page.on("requestfailed", onRequestFinished);

  let inflight = 0;
  let fulfill;
  let promise = new Promise((x) => (fulfill = x));
  let timeoutId = setTimeout(onTimeoutDone, timeout);
  return promise;

  function onTimeoutDone() {
    page.removeListener("request", onRequestStarted);
    page.removeListener("requestfinished", onRequestFinished);
    page.removeListener("requestfailed", onRequestFinished);
    fulfill();
  }

  function onRequestStarted() {
    ++inflight;
    if (inflight > maxInflightRequests) clearTimeout(timeoutId);
  }

  function onRequestFinished() {
    if (inflight === 0) return;
    --inflight;
    if (inflight === maxInflightRequests)
      timeoutId = setTimeout(onTimeoutDone, timeout);
  }
}

const getPriceMiddleware = async (req, res, next) => {
  try {
    const value = await getPrice(req.body.link, req.body.variations);
    res.send(value);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getPriceMiddleware,
};

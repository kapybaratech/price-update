const puppeteer = require("puppeteer");

let puppeteerInstance;

const initializePuppeteer = async function () {
  puppeteerInstance = await puppeteer.launch();
};

const getPuppeteerInstance = async function () {
  if (!puppeteerInstance) {
    console.log("initializing puppeteer instance");
    await initializePuppeteer();
  } else {
    console.log("using existing puppeteer instance");
  }
  return puppeteerInstance;
};

module.exports = {
  getPuppeteerInstance,
};

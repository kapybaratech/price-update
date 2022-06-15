import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { createReadStream, writeFileSync } from "fs";
import puppeteer from "puppeteer";

const urls = [
  "https://shopee.sg/Fellow-Carter-MOVE-Mug-i.171623681.4760526841?sp_atk=030a5131-fbdd-4519-9d38-ff47249d9f31&xptdk=030a5131-fbdd-4519-9d38-ff47249d9f31",
];

const getScreenshot = async (url, pdfDoc) => {
  const pdfOptions = {};
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });
  const pdfBuffer = await page.pdf(pdfOptions);
  await browser.close();
  return pdfBuffer;
};

const createPDF = async () => {
  // Create a new PDFDocument
  const pdfDoc = await PDFDocument.create();

  const pdfBuffers = await Promise.all(urls.map((url) => getScreenshot(url)));
  const pdfDocs = await Promise.all(
    pdfBuffers.map((pdfBuffer) => PDFDocument.load(pdfBuffer))
  );
  const firstPages = await Promise.all(
    pdfDocs.map(async (shopeePdfDoc) => {
      const pages = await pdfDoc.copyPages(shopeePdfDoc, [0]);
      return pages[0];
    })
  );
  for (let page of firstPages.reverse()) {
    pdfDoc.insertPage(0, page);
  }

  // Serialize the PDFDocument to bytes (a Uint8Array)
  writeFileSync("./blank.pdf", await pdfDoc.save());

  // For example, `pdfBytes` can be:
  //   • Written to a file in Node
  //   • Downloaded from the browser
  //   • Rendered in an <iframe>
};

export const generatePriceReport = async (req, res, next) => {
  await createPDF();
  const readStream = createReadStream("./blank.pdf");
  res.contentType("application/pdf");
  readStream.pipe(res);
};

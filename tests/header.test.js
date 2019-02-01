const puppeteer = require("puppeteer");

test("launch a browser", async () => {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
});

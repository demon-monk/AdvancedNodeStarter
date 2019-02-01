const puppeteer = require("puppeteer");

test("launch a browser", async () => {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  await page.goto("http://localhost:3000");
  const text  = await page.$eval('a.brand-logo', el => el.innerHTML)
  expect(text).toEqual('Blogster')
});

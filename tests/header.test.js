const puppeteer = require("puppeteer");
const { Buffer } = require("safe-buffer");
const KeyGrip = require("keygrip");
const keyConfig = require("../config/keys");

const HOME_URL = "http://localhost:3000";

let browser, page;

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: false
  });
  page = await browser.newPage();
  await page.goto(HOME_URL);
});

afterEach(async () => {
  await browser.close();
});

test("the header should has the correct logo test", async () => {
  const text = await page.$eval("a.brand-logo", el => el.innerHTML);
  expect(text).toEqual("Blogster");
});

test("should goto oAuth flow when click the login button", async () => {
  await page.click(".right a");
  const url = await page.url();
  expect(url).toMatch(/accounts\.google\.com/);
});

test.only("should show logout button when use sign in", async () => {
  const id = "5c4fc43e980377029484c5e2";
  const sessionObj = {
    passport: {
      user: id
    }
  };
  const sessionString = Buffer.from(JSON.stringify(sessionObj)).toString(
    "base64"
  );
  const keyGrip = new KeyGrip([keyConfig.cookieKey]);
  const sig = keyGrip.sign(`session=${sessionString}`);
  await page.setCookie({ name: "session", value: sessionString });
  await page.setCookie({ name: "session.sig", value: sig });
  await page.goto(HOME_URL);
  await page.waitFor('a[href="/auth/logout"]')
  const text = await page.$eval(
    'a[href="/auth/logout"]',
    el => el.innerHTML
  );
  expect(text).toEqual('Logout');
});

const Page = require("./helpers/page");
const HOME_URL = "http://localhost:3000";


let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto(page.HOME_URL);
});

afterEach(async () => {
  await page.close();
});

test("the header should has the correct logo test", async () => {
  const text = await page.getContent("a.brand-logo");
  expect(text).toEqual("Blogster");
});

test("should goto oAuth flow when click the login button", async () => {
  await page.click(".right a");
  const url = await page.url();
  expect(url).toMatch(/accounts\.google\.com/);
});

test("should show logout button when use sign in", async () => {
  await page.login()
  const text = await page.getContent('a[href="/auth/logout"]');
  expect(text).toEqual("Logout");
});

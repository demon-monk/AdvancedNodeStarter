const Page = require("./helpers/page");

let page;
beforeEach(async () => {
  page = await Page.build();
  await page.goto(page.HOME_URL);
});

afterEach(async () => {
  await page.close();
});

test("should show the add post button when user is logged in", async () => {
  await page.login();
  await page.click("a.btn-floating");
  const text = await page.getContent("form label");
  expect(text).toEqual("Blog Title");
});

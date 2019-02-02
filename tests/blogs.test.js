const Page = require("./helpers/page");

let page;
beforeEach(async () => {
  page = await Page.build();
  await page.goto(page.HOME_URL);
});

afterEach(async () => {
  await page.close();
});

describe("when logged in and click new post btn", () => {
  beforeEach(async () => {
    await page.login();
    await page.click("a.btn-floating");
  });

  test("should show the new post form", async () => {
    const text = await page.getContent("form label");
    expect(text).toEqual("Blog Title");
  });

  describe("when enter valid inputs", () => {
    beforeEach(async () => {
      await page.type(".title input", "test title");
      await page.type(".content input", "test content");
      await page.click("form button");
    });

    test("should take user to review page", async () => {
      const pageTitle = await page.getContent("h5");
      expect(pageTitle).toEqual("Please confirm your entries");
    });
  });

  describe("when enter invalid inputs", () => {
    beforeEach(async () => {
      await page.click("form button");
    });

    test("should see incorrect input messages", async () => {
      const msgExpect = "You must provide a value";
      const titleMsg = await page.getContent(".title .red-text");
      expect(titleMsg).toEqual(msgExpect);
      const contentMsg = await page.getContent(".content .red-text");
      expect(contentMsg).toEqual(msgExpect);
    });
  });
});

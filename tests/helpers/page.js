const puppeteer = require("puppeteer");
const userFactory = require("../factories/userFactory");
const sessionFactory = require("../factories/sessionFactory");

const getFetch = (path, method, obj) =>
  fetch(path, {
    method,
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(obj)
  }).then(res => res.json());

class Page {
  get HOME_URL() {
    return "http://localhost:3000";
  }
  static async build() {
    const browser = await puppeteer.launch({
      headless: false
    });
    const originPage = await browser.newPage();
    const customePage = new Page(originPage);
    return new Proxy(customePage, {
      get(target, property) {
        return (
          // broswer should be primier to originPage to use its close method
          customePage[property] || browser[property] || originPage[property]
        );
      }
    });
  }

  constructor(page, browser) {
    this.page = page;
  }

  async login() {
    const user = await userFactory();
    const { session, sig } = sessionFactory(user);
    await this.page.setCookie({ name: "session", value: session });
    await this.page.setCookie({ name: "session.sig", value: sig });
    await this.page.goto(`${this.HOME_URL}/blogs`);
    await this.page.waitFor('a[href="/auth/logout"]');
  }

  getContent(selector) {
    return this.page.$eval(selector, el => el.innerHTML);
  }

  get(path) {
    return this.page.evaluate(getFetch, path, "GET");
  }

  post(path, body) {
    return this.page.evaluate(getFetch, path, "POST");
  }
}

module.exports = Page;

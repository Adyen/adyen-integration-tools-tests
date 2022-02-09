import { BasePage } from "../plugin/Base.page.js";

export class SuccessfulCheckoutPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;

    this.pageTitle = page.locator(".page-title .base");
    this.continueButton = page.locator(
      "//*[@class = 'action primary continue']//*[text()='Continue Shopping']"
    );
  }

  async waitforNavigaton() {
    await this.page.waitForNavigation({ waitUntil: "load" });
    await this.continueButton.waitFor({ state: "visible", timeout: 5000 });
  }
}

import { BasePage } from "../plugin/Base.page.js";

export class SuccessfulCheckoutPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;

    this.pageTitle = page.locator(".page-title .base");
    this.continueButton = page.locator(
      "//*[@class = 'action primary continue']//*[text()='Continue Shopping']"
    );
    this.voucherCoudeContainer = page.locator(
      ".adyen-checkout__voucher-result"
    );
  }

  get titleText() {
    return this.pageTitle.innerText();
  }

  async waitForRedirection() {
    await this.page.waitForNavigation({
      url: / *\/onepage\/success/,
      timeout: 15000,
    });
  }
}

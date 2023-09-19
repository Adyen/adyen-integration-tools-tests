import { BasePage } from "../plugin/Base.page.js";

export class SuccessfulCheckoutPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;

    this.pageTitle = page.locator(".page-title .base");
    this.continueButton = page.locator(
      "//*[@class = 'action primary continue']//*[text()='Continue Shopping']"
    );
    this.voucherCodeContainer = page.locator(
      ".adyen-checkout__voucher-result"
    );
    this.orderNumberSpan = page.locator(".checkout-success p span");
  }

  async titleText() {
    return await this.pageTitle.innerText();
  }

  async orderNumber(){
    return await this.orderNumberSpan.innerText();
  }

  async waitForRedirection(timeout = 15000) {
    await this.page.waitForNavigation({
      url: / *\/onepage\/success/,
      timeout: timeout,
    });
  }
}

import { expect } from "@playwright/test";
import { BasePage } from "./Base.page.js";

export class ShoppingCartPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
    this.errorMessage = page.locator(".message-error");
  }

  async goTo() {
    await this.page.goto("/checkout/cart");
  }

  async verifyPaymentFailure() {
    await this.page.waitForNavigation({
      url: /.*checkout\/cart/,
      timeout: 10000,
    });
    await expect(await this.errorMessage.innerText()).toContain(
      "Your payment failed, Please try again later"
    );
  }
}

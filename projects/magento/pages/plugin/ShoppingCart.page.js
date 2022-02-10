import { expect } from "@playwright/test";
import { BasePage } from "./Base.page.js";
import { Helpers } from "../plugin/Helpers.js";

export class ShoppingCartPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
    this.errorMessage = page.locator(".message-error");
  }

  async goTo() {
    await this.page.goto("/checkout/cart");
    await new Helpers(this.page).waitForAnimation();
  }

  async waitforNavigaton() {
    await this.page.waitForNavigation({
      url: /.*checkout\/cart/,
      timeout: 10000,
    });
  }

  async verifyPaymentFailure() {
    await this.waitforNavigaton();
    await expect(await this.errorMessage.innerText()).toEqual(
      "Your payment failed, Please try again later"
    );
  }
}

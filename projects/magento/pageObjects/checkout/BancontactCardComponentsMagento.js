import { expect } from "@playwright/test";
import { BancontactCardComponents } from "../../../common/checkoutComponents/BancontactCardComponents.js";
export class BancontactCardComponentsMagento extends BancontactCardComponents {
  constructor(page) {
    super(page.locator("#bcmcContainer"));
    this.page = page;

    this.errorMessage = page.locator(".message-error");
  }

  async verifyPaymentRefusal() {
    expect(await this.errorMessage.innerText()).toContain(
        "The payment is REFUSED."
    );
  }
}

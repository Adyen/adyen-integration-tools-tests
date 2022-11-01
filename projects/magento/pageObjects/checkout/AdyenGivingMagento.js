import { expect } from "@playwright/test";
import { AdyenGivingComponents } from "../../../common/checkoutComponents/AdyenGivingComponents.js";
export class AdyenGivingMagento extends AdyenGivingComponents {
  constructor(page) {
    super(page);
    this.page = page;

    this.DonationMessage = this.adyenGivingContainer.locator(
      ".adyen-checkout__status__text"
    );
  }

  async verifySuccessfulDonationMessage() {
    await expect(this.DonationMessage).toHaveText("Thanks for your support!");
  }

  async verifyDeclineRedirection() {
    await this.page.waitForURL("/index.php/", { timeout: 10000 });
  }
}

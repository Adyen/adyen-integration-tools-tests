import { IDealComponents } from "../../../common/checkoutComponents/iDealComponents.js";
import { IdealIssuerPage } from "../../../common/redirect/IdealIssuerPage.js";
export class IDealComponentsMagento extends IDealComponents {
  constructor(page) {
    super(page)
    this.page = page;

    this.placeOrderButton = page.locator(
      ".payment-method._active button[type=submit]"
    );
  }

  async placeOrder() {
    await this.placeOrderButton.click();
    return new IdealIssuerPage(this.page);
  }
}

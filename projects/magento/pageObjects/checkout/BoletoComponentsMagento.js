import { BoletoComponents } from "../../../common/checkoutComponents/BoletoComponents.js";

export class BoletoComponentsMagento extends BoletoComponents {
  constructor(page) {
    super(page);
    this.page = page;
  }

  async placeOrder() {
    await this.placeOrderButton.click();
  }
}

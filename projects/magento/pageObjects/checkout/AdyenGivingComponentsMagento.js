import { AdyenGivingComponents } from "../../../common/checkoutComponents/AdyenGivingComponents.js";
export class AdyenGivingMagento extends AdyenGivingComponents {
  constructor(page) {
    super(page);
    this.page = page;
  }

  async verifyDeclineRedirection() {
    await this.page.waitForURL("/index.php/", { timeout: 10000 });
  }
}

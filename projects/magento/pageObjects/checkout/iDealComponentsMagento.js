import { IdealIssuerPage } from "../../../common/redirect/IdealIssuerPage.js";
export class IDealComponents {
  constructor(page) {
    this.page = page;

    this.iDealDropDown = page.locator(
      "#payment_form_adyen_hpp_ideal .adyen-checkout__dropdown__button"
    );

    this.placeOrderButton = page.locator(
      ".payment-method._active button[type=submit]"
    );
  }

  iDealDropDownSelectorGenerator(issuerName) {
    return this.page.locator(
      `#payment_form_adyen_hpp_ideal .adyen-checkout__dropdown__list li [alt='${issuerName}']`
    );
  }

  async selectIdealIssuer(issuerName) {
    await this.iDealDropDown.click();
    await this.iDealDropDownSelectorGenerator(issuerName).click();
  }

  async selectRefusedIdealIssuer() {
    await this.iDealDropDown.click();
    await this.iDealDropDownSelectorGenerator("Test Issuer Refused").click();
  }

  async placeOrder() {
    await this.placeOrderButton.click();
    return new IdealIssuerPage(this.page);
  }
}

import { AnimationHelper } from "../../helpers/AnimationHelper.js";

export class ShippingDetails {
  constructor(page) {
    this.page = page;

    // Shipping Section Locators
    this.emailInput = page.locator(
      "#checkout-step-shipping #customer-email"
    );
    this.firstNameInput = page.locator("#checkout-step-shipping input[name='firstname']");
    this.lastNameInput = page.locator("#checkout-step-shipping input[name='lastname']");
    this.addressInput = page.locator("#checkout-step-shipping input[name='street[0]']");
    this.countrySelector = page.locator("#checkout-step-shipping select[name='country_id']");
    this.stateProvinceDropdown = page.locator("#checkout-step-shipping select[name='region_id']");
    this.stateProvinceField = page.locator("#checkout-step-shipping input[name='region']");
    this.cityInput = page.locator("#checkout-step-shipping input[name='city']");
    this.postCodeInput = page.locator("#checkout-step-shipping input[name='postcode']");
    this.phoneNumberInput = page.locator("#checkout-step-shipping input[name='telephone']");
    this.shippingMethodRadioButton = page
      .locator("#checkout-shipping-method-load input[type='radio']")
      .first();
    this.nextButton = page.locator(
      "#checkout-step-shipping_method button[type=submit]"
    );
  }

  async goTo(waitForAnimation = true) {
    // Only works with a non-empty shopping cart
    await this.page.goto("/checkout/#shipping");
    if (waitForAnimation != false){
      await new AnimationHelper(this.page).waitForAnimation();
    }
  }

  async fillShippingDetails(user) {
    await this.emailInput.fill(user.email);
    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    await this.addressInput.fill(user.street);

    await this.countrySelector.selectOption(user.countryCode);
    await new AnimationHelper(this.page).waitForAnimation();

    if (user.stateOrProvince != undefined) {
      await this.stateProvinceDropdown.selectOption(user.stateOrProvince);
    } else if (user.stateCode != undefined) {
      await this.stateProvinceField.fill(user.stateCode);
    }

    await this.cityInput.fill(user.city);
    await this.postCodeInput.fill(user.postCode);

    await this.phoneNumberInput.fill(user.phoneNumber);
    await this.shippingMethodRadioButton.check();
  }

  async clickNextButton() {
    await this.nextButton.click();
  }

  async fillShippingDetailsAndProceedToPayment(user) {
    await this.fillShippingDetails(user);
    await this.clickNextButton();
    await new AnimationHelper(this.page).waitForAnimation();
  }
}

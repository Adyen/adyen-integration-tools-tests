import { AnimationHelper } from "../../helpers/AnimationHelper.js";

export class ShippingDetails {
  constructor(page) {
    this.page = page;

    // Shipping Section Locators
    this.emailInput = page.locator(
      "//*[@id='customer-email' and @type='email' and @aria-required='true']"
    );
    this.firstNameInput = page.locator("input[name='firstname']");
    this.lastNameInput = page.locator("input[name='lastname']");
    this.addressInput = page.locator("input[name='street[0]']");
    this.countrySelector = page.locator("select[name='country_id']");
    this.stateProvinceDropdown = page.locator("select[name='region_id']");
    this.stateProvinceField = page.locator("input[name='region']");
    this.cityInput = page.locator("input[name='city']");
    this.postCodeInput = page.locator("input[name='postcode']");
    this.phoneNumberInput = page.locator("input[name='telephone']");
    this.shippingMethodRadioButton = page
      .locator("#checkout-shipping-method-load input[type='radio']")
      .first();
    this.nextButton = page.locator(
      "#checkout-step-shipping_method button[type=submit]"
    );
  }

  async goTo() {
    // Only works with a non-empty shopping cart
    await this.page.goto("/checkout/#shipping");
    await new AnimationHelper(this.page).waitForAnimation();
  }

  async fillShippingDetails(user) {
    await this.emailInput.type(user.email);
    await this.firstNameInput.type(user.firstName);
    await this.lastNameInput.type(user.lastName);
    await this.addressInput.type(user.street);

    await this.countrySelector.selectOption(user.countryCode);
    await new AnimationHelper(this.page).waitForAnimation();

    if (user.stateOrProvince != undefined) {
      await this.stateProvinceDropdown.selectOption(user.stateOrProvince);
    } else if (user.stateCode != undefined) {
      await this.stateProvinceField.type(user.stateCode);
    }

    await this.cityInput.type(user.city);
    await this.postCodeInput.type(user.postCode);

    await this.phoneNumberInput.type(user.phoneNumber);
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

  async proceedToPaymentWithSavedAddress() {
    await this.shippingMethodRadioButton.check();
    await this.clickNextButton();
    await new AnimationHelper(this.page).waitForAnimation();
  }
}

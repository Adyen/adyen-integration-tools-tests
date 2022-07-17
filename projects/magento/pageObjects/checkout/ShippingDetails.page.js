import { AnimationHelper } from "../../helpers/AnimationHelper.js";

export class ShippingDetails {
  constructor(page) {
    this.page = page;

    // Shipping Section Locators
    this.shippingForm = page.locator(
      "#checkout-step-shipping"
    );
    this.emailInput = this.shippingForm.locator("#customer-email");
    this.firstNameInput = this.shippingForm.locator("input[name='firstname']");
    this.lastNameInput = this.shippingForm.locator("input[name='lastname']");
    this.addressInput = this.shippingForm.locator("input[name='street[0]']");
    this.countrySelector = this.shippingForm.locator("select[name='country_id']");
    this.stateProvinceDropdown = this.shippingForm.locator("select[name='region_id']");
    this.stateProvinceField = this.shippingForm.locator("input[name='region']");
    this.cityInput = this.shippingForm.locator("input[name='city']");
    this.postCodeInput = this.shippingForm.locator("input[name='postcode']");
    this.phoneNumberInput = this.shippingForm.locator("input[name='telephone']");
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
    if (waitForAnimation != false) {
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
    this.page.waitForLoadState("networkidle", { timeout: 10000 });
    await this.clickNextButton();
    await new AnimationHelper(this.page).waitForAnimation();
  }

  async proceedToPaymentWithSavedAddress() {
    this.page.waitForLoadState("networkidle", { timeout: 10000 });
    await this.shippingMethodRadioButton.check();
    await this.clickNextButton();
    await new AnimationHelper(this.page).waitForAnimation();
  }
}

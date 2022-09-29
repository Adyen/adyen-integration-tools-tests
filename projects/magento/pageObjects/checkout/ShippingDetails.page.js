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
    const typeDelay = 50;

    await this.emailInput.fill(user.email);
    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    await this.addressInput.fill(user.street);

    await this.countrySelector.selectOption(user.countryCode);

    if (user.stateOrProvince != undefined) {
      await this.stateProvinceDropdown.selectOption(user.stateOrProvince);
    } else if (user.stateCode != undefined) {
      await this.stateProvinceField.fill(user.stateCode);
    }

    await this.cityInput.type(user.city, { delay: typeDelay });
    await this.postCodeInput.type(user.postCode, { delay: typeDelay });

    await this.phoneNumberInput.type(user.phoneNumber, { delay: typeDelay });
    await this.shippingMethodRadioButton.check();
  }

  async clickNextButton() {
    await this.nextButton.click();
  }

  async fillShippingDetailsAndProceedToPayment(user) {
    await this.fillShippingDetails(user);
    await this.page.waitForLoadState("domcontentloaded", { timeout: 10000 });
    await this.page.waitForLoadState("networkidle", { timeout: 10000 });

    await this.clickNextButton();
    await new AnimationHelper(this.page).waitForAnimation();
  }

  async proceedToPaymentWithSavedAddress() {
    await this.shippingMethodRadioButton.check();
    await this.page.waitForLoadState("domcontentloaded", { timeout: 10000 });
    await this.page.waitForLoadState("networkidle", { timeout: 10000 });

    // Unavoidable hard wait until the payment method render issue is resolved
    await new Promise(r => setTimeout(r, 1500));

    await this.clickNextButton();
    await new AnimationHelper(this.page).waitForAnimation();
  }
}

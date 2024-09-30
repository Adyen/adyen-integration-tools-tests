
export class ShippingDetails {
  constructor(page, formWrapper = page.locator("#guest_details")) {
    this.page = page;

    this.guestEmailSection = page.locator("#guest-details");
    this.shippingForm = page.locator("#shipping-details");
    this.shippingMethodForm = page.locator("#shipping");
    this.emailInput = this.guestEmailSection.locator("#guest_details-email_address");
    this.firstNameInput = this.shippingForm.locator("input[name='firstname']");
    this.lastNameInput = this.shippingForm.locator("input[name='lastname']");
    this.addressInput = this.shippingForm.locator("input[name='street[0]']");
    this.countrySelector = this.shippingForm.locator("select[name='country_id']");
    this.stateProvinceDropdown = this.shippingForm.locator("select[name='region']");
    this.stateProvinceField = this.shippingForm.locator("input[name='region']");
    this.cityInput = this.shippingForm.locator("input[name='city']");
    this.postCodeInput = this.shippingForm.locator("input[name='postcode']");
    this.phoneNumberInput = this.shippingForm.locator("input[name='telephone']");
    this.shippingMethodRadioButton = this.shippingMethodForm
      .locator("#shipping-method-option-flatrate input[type='radio']");
    this.nextButton = page.locator("button[rel=next]");
  }

  async goTo(waitForAnimation = true) {
    // Only works with a non-empty shopping cart
    await this.page.goto("/checkout");
    if (waitForAnimation != false) {
    }
  }

  async fillShippingDetails(user, fillEmail = true) {
    const typeDelay = 50;

    if (fillEmail === true) {
      await this.page.waitForLoadState(this.emailInput, { timeout: 10000 });
      await this.emailInput.fill(user.email);
    }

    await this.firstNameInput.fill(user.firstName, { delay: typeDelay });
    await this.lastNameInput.fill(user.lastName, { delay: typeDelay });
    await this.addressInput.fill(user.street, { delay: typeDelay });
    await this.postCodeInput.type(user.postCode, { delay: typeDelay });
    await this.cityInput.type(user.city, { delay: typeDelay });
    await this.phoneNumberInput.type(user.phoneNumber, { delay: typeDelay });

    await this.countrySelector.selectOption(user.countryCode, { timeout: 10000 });

    if (user.stateOrProvince != undefined) {
      const dropdownValue = await this.stateProvinceDropdown
      .locator(`option`).last().getAttribute("value");
      await this.stateProvinceDropdown.selectOption(dropdownValue);
    } else if (user.stateCode != undefined) {
      await this.stateProvinceField.fill(user.stateCode);
    }

    if (fillEmail === true) {
      await this.shippingMethodRadioButton.check();
    }
  }

  async clickNextButton() {
    await this.nextButton.click();
  }

  async fillShippingDetailsAndProceedToPayment(user) {
    await this.fillShippingDetails(user);
    await this.page.waitForLoadState("domcontentloaded", { timeout: 10000 });
    await this.page.waitForLoadState("networkidle", { timeout: 10000 });

    await this.clickNextButton();
  }

  async proceedToPaymentWithSavedAddress() {
    await this.shippingMethodRadioButton.check();
    await this.page.waitForLoadState("load", { timeout: 10000 });

    await this.clickNextButton();
  }
}

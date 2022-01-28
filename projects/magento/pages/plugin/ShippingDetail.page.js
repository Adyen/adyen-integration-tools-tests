import { Helpers } from "./Helpers";

export class ShippingDetailsPage {
  constructor(page) {
    this.page = page;

    this.emailInput = page.locator("input[id='customer-email']");
    this.firstNameInput = page.locator("input[name='firstname']");
    this.lastNameInput = page.locator("input[name='lastname']");
    this.addressInput = page.locator("input[name='street[0]']");
    this.countrySelector = page.locator("select[name='country_id']");
    this.stateProvinceDropdown = page.locator("select[name='region_id']");
    this.stateProvinceField = page.locator("input[name='region']");
    this.cityInput = page.locator("input[name='city']");
    this.postalCodeInput = page.locator("input[name='postcode']");
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
    await new Helpers(this.page).waitForAnimation();
  }

  async fillShippingDetails(user) {
    await this.emailInput.type(user.email);
    await this.firstNameInput.type(user.firstName);
    await this.lastNameInput.type(user.lastName);
    await this.addressInput.type(user.address);

    if (user.stateSelect) {
      await this.stateProvinceDropdown.selectOption(user.stateSelect);
    } else {
      await this.stateProvinceField.type(user.stateType);
    }

    await this.countrySelector.selectOption(user.country);
    await this.cityInput.type(user.city);
    await this.postalCodeInput.type(user.postalCode);
  }
}

export class BoletoComponents {
  constructor(page) {
    this.page = page;

    this.socialSecurityNumberInput = page.locator("#adyen_boleto_social_security_number");
    this.firstNameInput = page.locator("#adyen_boleto_firstname");
    this.lastNameInput = page.locator("#adyen_boleto_lastname");
    this.placeOrderButton = page.locator(
      ".payment-method._active button[type=submit]"
    );
  }

  async placeOrder() {
    await this.placeOrderButton.click();
  }

  async fillBoletoDetails(socialSecurityNumber, firstName, lastName) {
    await this.socialSecurityNumberInput.fill(socialSecurityNumber);
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
  }
}

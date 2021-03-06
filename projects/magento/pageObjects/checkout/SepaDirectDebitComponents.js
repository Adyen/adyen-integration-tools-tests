export class SepaDirectDebitComponents {
  constructor(page) {
    this.page = page;

    this.sepaDirectDebitSection = page.locator(
      "#payment_form_adyen_hpp_sepadirectdebit"
    );
    this.accountHolderNameInput = this.sepaDirectDebitSection.locator(
      "input[name='ownerName']"
    );
    this.accountNumberInput = this.sepaDirectDebitSection.locator(
      "input[name='ibanNumber']"
    );
    this.placeOrderButton = page.locator(
      ".payment-method._active button[type=submit]"
    );
  }

  async fillSepaDirectDebitInfo(accountHolderName, accountNumber) {
    await this.accountHolderNameInput.click();
    await this.accountHolderNameInput.fill(accountHolderName);

    await this.accountNumberInput.click();
    await this.accountNumberInput.fill(accountNumber);
  }

  async placeOrder() {
    await this.placeOrderButton.click();
  }
}

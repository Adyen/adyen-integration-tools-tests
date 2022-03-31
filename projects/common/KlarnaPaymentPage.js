import PaymentResources from "../data/PaymentResources.js";

export default class KlarnaPaymentPage {
  constructor(page) {
    this.page = page;

    this.klarnaGoBackButton = page.locator("#back-button");
    this.klarnaBuyButton = page.locator("#buy-button");

    this.klarnaIframe = page.frameLocator("#klarna-hpp-instance-fullscreen");
    this.klarnaDateOfBirthInput = page.locator(
      "#invoice_kp-purchase-approval-form-date-of-birth"
    );
    this.klarnaPhoneInput = this.klarnaIframe.locator("#email_or_phone");
    this.klarnaContinueButton = this.klarnaIframe.locator("#onContinue");
    this.klarnaVerificationCodeInput = this.klarnaIframe.locator("#otp_field");

    this.klarnaConfirmButton = this.klarnaIframe.locator(
      "#invoice_kp-purchase-review-continue-button"
    );
    this.klarnaConfirmBankAccountButton = page.locator(
      "#mandate-review__confirmation-button"
    );
  }

  async makeKlarnaPayment(action, phoneNumber = null) {
    await this.waitForKlarnaLoad();
    switch (action) {
      case "later":
        await this.continueOnKlarna(phoneNumber);
        await this.klarnaConfirmButton.click();
        break;
      case "directDebit":
        await this.continueOnKlarna(phoneNumber);
        await this.klarnaConfirmBankAccountButton.click();
        break;
      case "cancel":
        await this.klarnaGoBackButton.click();
        break;
    }
  }

  async continueOnKlarna(phoneNumber) {
    await this.klarnaBuyButton.click();

    await this.klarnaPhoneInput.fill(phoneNumber);
    await this.klarnaContinueButton.click();

    await this.klarnaVerificationCodeInput.fill(new PaymentResources().klarnaVerificationCode);
    await this.klarnaConfirmButton.click();
  }

  async waitForKlarnaLoad() {
    await this.page.waitForNavigation({
      url: /.*playground.klarna/,
      timeout: 10000,
    });
  }
}

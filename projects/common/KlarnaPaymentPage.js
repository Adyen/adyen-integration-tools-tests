import PaymentResources from "../data/PaymentResources.js";

export default class KlarnaPaymentPage {
  constructor(page) {
    this.page = page;

    this.klarnaGoBackButton = page.locator("#back-button");
    this.klarnaBuyButton = page.locator("#buy-button");

    this.klarnaIframe = page.frameLocator("#klarna-hpp-instance-fullscreen");
    this.klarnaMainIframe = page.frameLocator("#klarna-hpp-instance-main");
    this.klarnaDateOfBirthInput = page.locator(
      "#invoice_kp-purchase-approval-form-date-of-birth"
    );
    this.klarnaPhoneInput = this.klarnaIframe.locator("#email_or_phone");
    this.klarnaContinueButton = this.klarnaIframe.locator("#onContinue");
    this.klarnaVerificationCodeInput = this.klarnaIframe.locator("#otp_field");

    this.klarnaConfirmButton = this.klarnaIframe.locator(
      "#invoice_kp-purchase-review-continue-button"
    );
    this.klarnaConfirmBankAccountButton = this.klarnaIframe.locator(
      "#mandate-review__confirmation-button"
    );
    this.klarnaConfirmPurchaseWithInstallmentsButton =
      this.klarnaIframe.locator(
        "#payinparts_kp-purchase-review-continue-button"
      );
    this.directDebitButton = this.klarnaMainIframe.locator(
      "input[value|=directdebit_kp]"
    );
    this.directBankTransferButton = this.klarnaMainIframe.locator(
      "input[value|=banktransfer_kp]"
    )
    this.bankSelector = page.locator("select[id='SenderBank']");

    this.bankCredentialsIframe = page.frameLocator(
      "#banktransfer_kp-direct-bank-transfer-dialog iframe"
    );
    this.userIDInput = this.bankCredentialsIframe.locator("input#BackendFormUSERID");
    this.userPINInput = this.bankCredentialsIframe.locator("input#BackendFormUSERPIN");
    this.bankCredentialsNextButton = this.bankCredentialsIframe.locator("button:has-text('Next')");
    this.confirmationCodeInput = this.bankCredentialsIframe.locator("input#BackendFormTAN");
  }

  async makeKlarnaPayment(action, phoneNumber = null) {
    await this.waitForKlarnaLoad();
    switch (action) {
      case "later":
        await this.continueOnKlarna(phoneNumber);
        await this.klarnaConfirmButton.click();
        break;
      case "directDebit":
        await this.directDebitButton.click();
        await this.continueOnKlarna(phoneNumber);
        await this.klarnaConfirmBankAccountButton.click();
        break;
      case "directBankTransfer":
        await this.directBankTransferButton.click();
        await this.continueOnKlarna(phoneNumber);
        await this.klarnaConfirmBankAccountButton.click();
        await this.bankSelector.selectOption("00000");

        await this.bankCredentialsNextButton.click();
        await this.userIDInput.fill("test");
        await this.userPINInput.fill("1111");
        await this.bankCredentialsNextButton.click();
        await this.bankCredentialsNextButton.click();
        await this.confirmationCodeInput.fill("12345");
        break;
      case "overTime":
        await this.continueOnKlarna(phoneNumber);
        await this.klarnaConfirmPurchaseWithInstallmentsButton.click();
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

    await this.klarnaVerificationCodeInput.fill(
      new PaymentResources().klarnaVerificationCode
    );
  }

  async waitForKlarnaLoad() {
    await this.page.waitForNavigation({
      url: /.*playground.klarna/,
      timeout: 10000,
    });
  }
}

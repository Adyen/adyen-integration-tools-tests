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

    this.payLaterButton = this.klarnaMainIframe.locator("#radio-pay_later");
    this.payInThreeInstallmentsButton = this.klarnaMainIframe.locator(
      "#radio-pay_over_time"
    );
    this.payNowButton = this.klarnaMainIframe.locator("#radio-pay_now");

    this.klarnaConfirmButton = this.klarnaIframe.locator(
      "#invoice_kp-purchase-review-continue-button"
    );

    this.klarnaConfirmPaymentButton = this.klarnaIframe.locator("#dd-confirmation-dialog__footer-button-wrapper button")

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
    );

    this.dialogIframe = this.klarnaIframe.frameLocator("iframe");

    // Bank Selection Dialog Selectors
    this.countryAndBankSelectionDialog =
      this.dialogIframe.locator("#SelectCountryPage");
    this.bankSelectionDropdown = this.countryAndBankSelectionDialog.locator(
      "select[id='SenderBank']"
    );
    this.countryAndBankSelectionNextButton =
      this.countryAndBankSelectionDialog.locator("button:has-text('Next')");

    // Bank Account Dialog Selectors
    this.bankCredentialsDialog = this.dialogIframe.locator("#LoginPage");
    this.userIDInput = this.bankCredentialsDialog.locator(
      "input#BackendFormUSERID"
    );
    this.userPINInput = this.bankCredentialsDialog.locator(
      "input#BackendFormUSERPIN"
    );
    this.bankCredentialsNextButton = this.bankCredentialsDialog.locator(
      "button:has-text('Next')"
    );

    // Select Account Dialog Selectors
    this.selectAccountDialog = this.dialogIframe.locator("#SelectAccountPage");
    this.selectAccountNextButton = this.selectAccountDialog.locator(
      "button:has-text('Next')"
    );

    // Transaction Confirmation Dialog
    this.transactionConfirmationDialog =
      this.dialogIframe.locator("#ProvideTanPage");
    this.confirmationCodeInput = this.transactionConfirmationDialog.locator(
      "input#BackendFormTAN"
    );
    this.transactionConfirmationNextButton =
      this.transactionConfirmationDialog.locator("button:has-text('Next')");
  }

  async makeKlarnaPayment(action, phoneNumber = null) {
    await this.waitForKlarnaLoad();
    await this.page.waitForLoadState("networkidle", { timeout: 10000 });
    switch (action) {
      case "later":
        /* Commenting out the step below due to changes in sandbox,
        but not deleting it since the changes get reverted from time
        to time.
        await this.payLaterButton.click();
        */
        await this.continueOnKlarna(phoneNumber);
        await this.klarnaConfirmButton.click();
        break;
      case "directDebit":
        /* Commenting out the step below due to changes in sandbox,
        but not deleting it since the changes get reverted from time
        to time.
        await this.payNowButton.click();
        */
        await this.directDebitButton.waitFor({
          state: "visible",
          timeout: 10000,
        });
        await this.directDebitButton.click();
        await this.continueOnKlarna(phoneNumber);
        /* Commenting out the step below due to changes in sandbox,
        but not deleting it since the changes get reverted from time
        to time.

        await this.klarnaConfirmBankAccountButton.waitFor({
          state: "visible",
          timeout: 10000,
        });
        await this.klarnaConfirmBankAccountButton.click();
        */
        await this.klarnaConfirmPaymentButton.waitFor({ state: "visible", timeout: 10000 });
        await this.klarnaConfirmPaymentButton.click();

        break;
      case "directBankTransfer":
        /* Commenting out the step below due to changes in sandbox,
        but not deleting it since the changes get reverted from time
        to time.
        await this.payNowButton.click();
        */
        await this.directBankTransferButton.waitFor({
          state: "visible",
          timeout: 10000,
        });
        await this.directBankTransferButton.click();
        /* Additional wait is needed since the buy button remains enabled even
        the page load is ongoing, and clicking it during that period breaks
        the flow */
        await this.page.waitForLoadState("networkidle", { timeout: 10000 });
        await this.continueOnKlarna(phoneNumber);
        await this.bankSelectionDropdown.selectOption("00000");
        await this.countryAndBankSelectionNextButton.click();

        await this.userIDInput.fill("test");
        await this.userPINInput.fill("1111");
        await this.bankCredentialsNextButton.click();
        /* Commenting out the step below due to changes in sandbox,
        but not deleting it since the changes get reverted from time
        to time.
        await this.selectAccountNextButton.click();
        */
        await this.confirmationCodeInput.fill("12345");
        await this.transactionConfirmationNextButton.click();
        break;
      case "overTime":
        await this.payInThreeInstallmentsButton.click();
        await this.continueOnKlarna(phoneNumber);
        await this.klarnaConfirmPurchaseWithInstallmentsButton.click();
        break;
      case "cancel":
        await this.klarnaGoBackButton.click();
        break;
    }
  }

  async continueOnKlarna(phoneNumber) {
    await this.klarnaBuyButton.waitFor({
      state: "visible",
      timeout: 10000,
    });
    await this.klarnaBuyButton.click();
    await this.klarnaPhoneInput.waitFor({
      state: "visible",
      timeout: 10000,
    });
    await this.klarnaPhoneInput.fill(phoneNumber);
    await this.klarnaContinueButton.waitFor({
      state: "visible",
      timeout: 10000,
    });
    await this.klarnaContinueButton.click();
    await this.klarnaVerificationCodeInput.waitFor({
      state: "visible",
      timeout: 10000,
    });
    await this.klarnaVerificationCodeInput.fill(
      new PaymentResources().klarnaVerificationCode
    );
  }

  async waitForKlarnaLoad() {
    await this.page.waitForNavigation({
      url: /.*playground.klarna/,
      timeout: 15000,
      waitUntil: "networkidle",
    });
  }
}

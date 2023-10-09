import PaymentResources from "../../data/PaymentResources.js";

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

    this.klarnaConfirmPaymentButton = this.klarnaIframe.getByRole('button', { name: 'Confirm and pay' });
    this.klarnaClosePopupButton = this.klarnaIframe.locator('#dd-manual-input-dialog__nav-bar__right-icon__overlay');
    this.klarnaIbanPromptText = this.klarnaIframe.getByText('The IBAN can be found in your bank documents or on your bank card.');

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
    this.bankSelectionDialog = this.dialogIframe.locator("#SelectCountryPage");

    this.klarnaDialogLoader = this.klarnaIframe.locator("circle");
    
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

        await this.klarnaDialogLoader.waitFor({
          state: "hidden",
          timeout: 10000,
        });

        await this.page.waitForLoadState("domcontentloaded", { timeout: 10000 });

        /* Adding this conditional since Klarna can randomly ask for IBAN prompt
        for confirmation */

        try {
          await this.klarnaConfirmPaymentButton.click();
        } catch {
          await this.klarnaClosePopupButton.click();
          await this.klarnaBuyButton.click();
          await this.klarnaConfirmPaymentButton.click();
        }

        break;
      case "directBankTransfer":

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
        await this.bankSelectionDialog.getByText('Demo Bank').click();
        await this.page.waitForLoadState("domcontentloaded");
        
        await this.dialogIframe.getByLabel('User ID').click();
        await this.dialogIframe.getByLabel('User ID').fill('test');
        await this.dialogIframe.getByLabel('PIN').click();
        await this.dialogIframe.getByLabel('PIN').fill('1111');
        await this.dialogIframe.getByRole('button', { name: 'Next' }).click();
        
        await this.page.waitForLoadState("domcontentloaded");

        if (await this.dialogIframe.getByRole('button', { name: 'Next' }).isVisible()){
          await this.dialogIframe.getByRole('button', { name: 'Next' }).click();
        }

        await this.dialogIframe.getByLabel('Confirmation code').click();
        await this.dialogIframe.getByLabel('Confirmation code').fill('12345');
        await this.dialogIframe.getByRole('button', { name: 'Next' }).click();

        await this.page.waitForLoadState("domcontentloaded");
        await this.dialogIframe.getByRole('heading', { name: 'Thank you' }).waitFor({state:"visible"});
        break;
      case "overTime":
        /* Commenting out the step below due to changes in sandbox,
        but not deleting it since the changes get reverted from time
        to time.
        await this.payInThreeInstallmentsButton.click();
        */
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

export default class KlarnaPaymentPage {
  constructor(page) {
    this.page = page;
    // this.klarnaIframe = page.frameLocator('#klarna-apf-iframe');

    this.phoneNumberVerificationDialog = page.locator('#collectPhonePurchaseFlow');
    this.genericInputField = page.getByTestId('kaf-field');
    this.genericButton = page.getByTestId('kaf-button');
    this.smsVerificationDialog = page.locator('#phoneOtp');
    this.closeButton = page.getByLabel('Close');
    this.cancelDialog =  page.locator('#payment-cancel-dialog-express__container');
    this.confirmCancellationButton =  page.getByRole('button', { name: 'Yes, cancel' });
    this.paymentTypeSelectButton = page.getByTestId('pick-plan');
    this.confirmAndPayButton = page.getByTestId('confirm-and-pay');
  }

  async makeKlarnaPayment(phoneNumber, paynow = false){
    await this.waitForKlarnaLoad();
    await this.phoneNumberVerificationDialog.waitFor({state:'visible'})
    await this.genericInputField.click();
    await this.genericInputField.fill(phoneNumber);
    await this.genericButton.click();
    await this.smsVerificationDialog.waitFor({state:'visible'})
    await this.genericInputField.click();
    await this.genericInputField.fill('111111');
    if (paynow) {
      await this.paymentTypeSelectButton.waitFor({state:'visible'})
      await this.paymentTypeSelectButton.click();
      await this.paymentTypeSelectButton.click();
    }
    await this.confirmAndPayButton.waitFor({state:'visible'})
    await this.confirmAndPayButton.click();
  }

  async cancelKlarnaPayment(){
    await this.waitForKlarnaLoad();
    await this.page.waitForLoadState("networkidle", { timeout: 10000 });
    await this.closeButton.click();
    await this.cancelDialog.waitFor({state:'visible'})
    await this.confirmCancellationButton.click();
  }

  async waitForKlarnaLoad() {
    await this.page.waitForURL(/.*playground.klarna/, {
      timeout:15000,
      waitUntil: "load",
    })
  }
}

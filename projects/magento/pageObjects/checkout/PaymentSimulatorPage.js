export class PaymentSimulatorPage {
  constructor(page) {
    this.page = page;

    this.authorizedPaymentButton = page.getByTestId("success-payment-outcome-button");
    this.refusedPaymentButton = page.getByTestId("refused-payment-outcome-button");
    this.cancelledPaymentButton = page.getByTestId("cancelled-payment-outcome-button");
  }

  async authorizePayment() {
    await this.authorizedPaymentButton.click();
  }

  async refusePayment() {
    await this.refusedPaymentButton.click();
  }

  async cancelPayment() {
    await this.cancelledPaymentButton.click();
  }
}

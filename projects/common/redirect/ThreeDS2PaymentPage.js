export class ThreeDS2PaymentPage {
  constructor(page) {
    this.page = page;
    this.threeDS2ModalFrame = page.locator("iframe[name='threeDSIframe']");
    this.threeDS2Iframe = page.frameLocator(
      ".adyen-checkout__threeds2__challenge iframe"
    );
    this.threeDS2PasswordInput = this.threeDS2Iframe.locator(
      "input[name='answer']"
    );
    this.threeDS2SubmitButton = this.threeDS2Iframe.locator(
      "button[type='submit']"
    );
    this.threeDS2CancelButton = this.threeDS2Iframe.locator(
      "#buttonCancel"
    );
  }

  async validate3DS2(answer) {
    await this.fillThreeDS2PasswordAndSubmit(answer);
  }

  async fillThreeDS2PasswordAndSubmit(answer) {
    await this.threeDS2ModalFrame.waitFor({ state: "visible", timeout: 10000 });
    await this.threeDS2PasswordInput.click();
    await this.threeDS2PasswordInput.type(answer);
    await this.threeDS2SubmitButton.click();
  }

  async clickCancel() {
    await this.threeDS2ModalFrame.waitFor({ state: "visible", timeout: 10000 });
    await this.threeDS2CancelButton.click();
  }

}

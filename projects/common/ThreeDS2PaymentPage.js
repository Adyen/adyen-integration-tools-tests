export class ThreeDS2PaymentPage {
  constructor(page) {
    this.threeDS2ChallengeModalBackdrop = page.locator("#actionModal");
    this.threeDS2ChallengeModalCloseButton = page.locator(
      '#actionModal button[data-dismiss="modal"]'
    );
    this.threeDS2ChallengeIframe = page.frameLocator(
      ".adyen-checkout__threeds2__challenge iframe"
    );
    this.threeDS2ChallengeInput = page.locator('input[name="answer"]');
    this.threeDS2ChallengeSubmit = page.locator('input[type="submit"]');
  }

  async validate3DS2(answer) {
    await this.fillThreeDS2ChallengeAndSubmit(answer);
  }

  fillThreeDS2ChallengeAndSubmit = async (answer) => {
    await t
      .switchToIframe(this.threeDS2ChallengeIframe)
      .typeText(this.threeDS2ChallengeInput, answer)
      .click(this.threeDS2ChallengeSubmit)
      .switchToMainWindow();
  };
}

import {Selector, t} from "testcafe";

export default class ThreeDS2PaymentPage {

  threeDS2ChallengeModalBackdrop = Selector('#actionModal');
  threeDS2ChallengeModalCloseButton = Selector('#actionModal button[data-dismiss="modal"]');
  threeDS2ChallengeIframe = Selector('.adyen-checkout__threeds2__challenge iframe');
  threeDS2ChallengeInput = Selector('input[name="answer"]');
  threeDS2ChallengeSubmit = Selector('input[type="submit"]');

  do3DS2Validation = async (answer) => {
    await this.fillThreeDS2ChallengeAndSubmit(answer);
  }

  fillThreeDS2ChallengeAndSubmit = async (answer) => {
    await t
      .switchToIframe(this.threeDS2ChallengeIframe)
      .typeText(this.threeDS2ChallengeInput, answer)
      .click(this.threeDS2ChallengeSubmit)
      .switchToMainWindow();
  }
}

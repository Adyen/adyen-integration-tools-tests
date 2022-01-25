import {Selector, t, ClientFunction} from "testcafe";

export default class ThreeDSPaymentPage {

    threeDS2UsernameInput = Selector('input[name="username"]');
    threeDS2PasswordInput = Selector('input[name="password"]');
    threeDSSubmit = Selector('input[type="submit"]');

	do3DSValidation = async (username, password) => {
      await this.fillThreeDSCredentialsAndSubmit(username, password);
    }

    fillThreeDSCredentialsAndSubmit = async (username, password) => {
        await t
        .typeText(this.threeDS2UsernameInput, username)
        .typeText(this.threeDS2PasswordInput, password)
        .click(this.threeDSSubmit)
        .switchToMainWindow()
        .wait(5000);
    }

}
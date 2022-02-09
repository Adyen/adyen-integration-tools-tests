import {Selector, t} from "testcafe";

export default class KlarnaPaymentPage {

  klarnaBuyButton = Selector('#buy-button');
  klarnaIframe = Selector('#klarna-hpp-instance-fullscreen');
  klarnaDateOfBirthInput = Selector('#invoice_kp-purchase-approval-form-date-of-birth');
  klarnaPhoneInput= Selector('#invoice_kp-purchase-approval-form-phone-number');
  klarnaContinueButton = Selector('#invoice_kp-purchase-approval-form-continue-button');
  klarnaCancelButton = Selector('#back-button');

  doKlarnaPayment = async (action, dateOfBirth = null, phone = null) => {

    switch (action) {
      case 'continue':
        await this.continueOnKlarna(dateOfBirth, phone);
        break;
      case 'cancel':
        await t.click(this.klarnaCancelButton);
        break;
      default:
        await this.continueOnKlarna(dateOfBirth);
    }
  }

  continueOnKlarna = async (dateOfBirth, phone) => {
    await t
      .expect(this.klarnaBuyButton.hasAttribute('disabled')).notOk('ready for testing', {timeout: 10000})
      .click(this.klarnaBuyButton)
      .switchToIframe(this.klarnaIframe)
      .typeText(this.klarnaDateOfBirthInput, dateOfBirth)
      .typeText(this.klarnaPhoneInput, phone)
      .click(this.klarnaContinueButton)
      .switchToMainWindow();
  }
}

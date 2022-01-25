import {Selector} from "testcafe";
import PaymentPage from "./modules/PaymentPage";
import User from "./modules/User";
import Magento2Config from "./Magento2Config";
import ThreeDSpaymentPage from "../commons/modules/ThreeDSPaymentPage";

const config = new Magento2Config();

fixture `Magento2 frontend logged in user card payments`
    .page(config.storeFrontURL);

test('Successful card payment without 3DS', async t => {
    const paymentPage = new PaymentPage();
    await paymentPage.goToCheckoutPageWithFullCart();

    const user = new User();
    await user.setUser('regularUser');
    await paymentPage.goToPaymentsPage();

    await paymentPage.doCardPayment("Attila test", config.masterCardWithout3D, config.expDate, config.cvc, true);
    await paymentPage.placeOrder();
    await paymentPage.expectSuccess();
});

test('Refused card payment without 3DS', async t => {
    const paymentPage = new PaymentPage();
    await paymentPage.goToCheckoutPageWithFullCart();

    const user = new User();
    await user.setUser('regularUser');
    await paymentPage.goToPaymentsPage();

    await paymentPage.doCardPayment("Attila test", config.masterCardWithout3D, config.wrongExpDate, config.cvc );
    await paymentPage.placeOrder();
    await paymentPage.expectRefusal();
});

test('Successful card payment with 3DS1', async t => {
    const paymentPage = new PaymentPage();
    await paymentPage.goToCheckoutPageWithFullCart();

    const user = new User();
    await user.setUser('regularUser');
    await paymentPage.goToPaymentsPage();

    await paymentPage.doCardPayment("Attila test", config.visa3DS1, config.expDate, config.cvc);
    await paymentPage.placeOrder();


    const threeDSpaymentPage = new ThreeDSpaymentPage();
    await threeDSpaymentPage.do3DSValidation('user', 'password');
    await paymentPage.expectSuccess();
});

test('Refused card payment with 3DS1', async t => {
    const paymentPage = new PaymentPage();
    await paymentPage.goToCheckoutPageWithFullCart();

    const user = new User();
    await user.setUser('regularUser');
    await paymentPage.goToPaymentsPage();

    await paymentPage.doCardPayment("Attila test", config.visa3DS1, config.expDate, config.cvc);
    await paymentPage.placeOrder();


    const threeDSpaymentPage = new ThreeDSpaymentPage();
    await threeDSpaymentPage.do3DSValidation('wrongUser', 'wrongPassword');
    await paymentPage.expectError();
});

test('Successful card payment with 3DS2', async t => {
    const paymentPage = new PaymentPage();
    await paymentPage.goToCheckoutPageWithFullCart();

    const user = new User();
    await user.setUser('regularUser');
    await paymentPage.goToPaymentsPage();

    await paymentPage.doCardPayment("Attila test", config.masterCard3DS2, config.expDate, config.cvc);
    await paymentPage.placeOrder();
    await paymentPage.do3DS2Validation(config.threeDS2CorrectAnswer);
    await paymentPage.expectSuccess();
});

test('Refused card payment with 3DS2', async t => {
    const paymentPage = new PaymentPage();
    await paymentPage.goToCheckoutPageWithFullCart();

    const user = new User();
    await user.setUser('regularUser');
    await paymentPage.goToPaymentsPage();

    await paymentPage.doCardPayment("Attila test", config.masterCard3DS2, config.expDate, config.cvc);
    await paymentPage.placeOrder();
    await paymentPage.do3DS2Validation(config.threeDS2WrongAnswer);
    await paymentPage.expectRefusal();
});

test('Empty field with oneclick', async t => {
      const paymentPage = new PaymentPage();
      await paymentPage.goToCheckoutPageWithFullCart();

      const user = new User();
      await user.setUser('regularUser');
      await paymentPage.goToPaymentsPage();

      await paymentPage.doOneClickPaymentWithEmptyRequiredFields(config.cvc);
      await paymentPage.expectPlaceOrderDisabled();
});

test('Successful iDeal payment', async t => {
    const paymentPage = new PaymentPage();
    await paymentPage.goToCheckoutPageWithFullCart();

    const user = new User();
    await user.setUser('regularUser');
    await paymentPage.goToPaymentsPage();

    await paymentPage.doIDealPayment();
    await paymentPage.expectSuccess();
});

test('Refused iDeal payment', async t => {
    const paymentPage = new PaymentPage();
    await paymentPage.goToCheckoutPageWithFullCart();

    const user = new User();
    await user.setUser('regularUser');
    await paymentPage.goToPaymentsPage();

    await paymentPage.doIDealPayment('refused');
    await paymentPage.expectError();
});

test('Successful AfterPay payment', async t => {
    const paymentPage = new PaymentPage();
    await paymentPage.goToCheckoutPageWithFullCart();

    const user = new User();
    await user.setUser('afterPayApprovedUser');
    await paymentPage.goToPaymentsPage();

    await paymentPage.doAfterPayPayment(config.afterPayApprovedNLGender, config.afterPayApprovedNLDateOfBirth, config.afterPayApprovedNLHouseNumber);

    await paymentPage.expectSuccess();
});

test('Refused AfterPay payment', async t => {
    const paymentPage = new PaymentPage();
    await paymentPage.goToCheckoutPageWithFullCart();

    const user = new User();
    await user.setUser('afterPayDeniedUser');
    await paymentPage.goToPaymentsPage();

    await paymentPage.doAfterPayPayment(config.afterPayApprovedNLGender, config.afterPayApprovedNLDateOfBirth, config.afterPayDeniedNLHouseNumber);

    await paymentPage.expectRefusal();
});


test('Successful Klarna payment', async t => {
    const paymentPage = new PaymentPage();
    await paymentPage.goToCheckoutPageWithFullCart();

    const user = new User();
    await user.setUser('klarnaApprovedUser');
    await paymentPage.goToPaymentsPage();

    await paymentPage.doKlarnaPayment("continue", config.registeredUser.klarna.approved.klarnaApprovedNLDateOfBirth);
    await paymentPage.expectSuccess();
});

test('Cancelled Klarna payment', async t => {
    const paymentPage = new PaymentPage();
    await paymentPage.goToCheckoutPageWithFullCart();
    const user = new User();
    await user.setUser('klarnaApprovedUser');
    await paymentPage.goToPaymentsPage();

    await paymentPage.doKlarnaPayment("cancel");
    await paymentPage.expectError();
});

test('Successful one click payment', async t => {
    const paymentPage = new PaymentPage();
    await paymentPage.goToCheckoutPageWithFullCart();

    const user = new User();
    await user.setUser('regularUser');
    await paymentPage.goToPaymentsPage();

    await paymentPage.doOneClickPayment(config.cvc);
    await paymentPage.expectSuccess();
});

test('Successful payment with combo card - prerequisite BRL set up as default currency on M2', async t => {
    const paymentPage = new PaymentPage();
    await paymentPage.changeCurrency('BRL');
    await paymentPage.goToCheckoutPageWithFullCart();

    const user = new User();
    await user.setUser('brazilianUser');
    await paymentPage.goToPaymentsPage();

    await paymentPage.doCardPayment("Attila test", config.masterCardWithout3D, config.expDate, config.cvc);
    await paymentPage.selectCardType(config.cardTypes.debit);

    await paymentPage.placeOrder();
    await paymentPage.expectSuccess();
})

test('Successful payment with installments - prerequisite BRL as default currency and 10 x installments configured on credit cards M2', async t => {
    const paymentPage = new PaymentPage();
    await paymentPage.changeCurrency('BRL');
    await paymentPage.goToCheckoutPageWithFullCart();

    const user = new User();
    await user.setUser('brazilianUser');

    await paymentPage.goToPaymentsPage();

    await paymentPage.doCardPayment("Attila test", config.masterCardWithout3D, config.expDate, config.cvc);
    await paymentPage.selectCardType(config.cardTypes.credit);
    await paymentPage.selectInstallments();

    await paymentPage.placeOrder();
    await paymentPage.expectSuccess();
})

test('Successful Oney payment', async t => {
    const paymentPage = new PaymentPage();
    await paymentPage.goToCheckoutPageWithFullCart(300);

    const user = new User();
    await user.setUser('frenchUser', true);
    await paymentPage.goToPaymentsPage();

    await paymentPage.doOneyPayment("continue", config.guestUser.oney.approved.fr, [config.oneyCard, config.cvc, config.expDate]);
    await paymentPage.expectVoucherInSuccessPage();
});

test('Refused Oney payment', async t => {
    const paymentPage = new PaymentPage();
    await paymentPage.goToCheckoutPageWithFullCart();

    const user = new User();
    await user.setUser('frenchUser', true);
    await paymentPage.goToPaymentsPage();

    await paymentPage.doOneyPayment("refused", config.guestUser.oney.approved.fr, [config.oneyCard, config.cvc, config.expDate]);
    await paymentPage.expectError();
});

test('Successful Multibanco payment', async t => {
    const paymentPage = new PaymentPage();
    await paymentPage.goToCheckoutPageWithFullCart();

    const user = new User();
    await user.setUser('portugueseUser');
    await paymentPage.goToPaymentsPage();

    await paymentPage.doSimplePayment(paymentPage.multibancoInput());
    await paymentPage.expectVoucherInSuccessPage();
});

test('Successful bankTransfer_IBAN payment (SEPA Bank Transfer)', async t => {
    const paymentPage = new PaymentPage();
    await paymentPage.goToCheckoutPageWithFullCart();

    const user = new User();
    await user.setUser('regularUser');
    await paymentPage.goToPaymentsPage();

    await paymentPage.doSimplePayment(paymentPage.bankTransfer_IBANInput());
    await paymentPage.expectSuccess();
});

test('Successful sepadirectdebit payment', async t => {
    const paymentPage = new PaymentPage();
    await paymentPage.goToCheckoutPageWithFullCart();

    const user = new User();
    await user.setUser('regularUser');
    await paymentPage.goToPaymentsPage();

    await paymentPage.doSepaDirectDebitPayment(config.sepaDirectDebit);
    await paymentPage.expectSuccess();
});

test('Successful Bancontact payment', async t => {
    const paymentPage = new PaymentPage();
    await paymentPage.goToCheckoutPageWithFullCart();

    const user = new User();
    await user.setUser('belgianUser');

    await paymentPage.goToPaymentsPage();
    await paymentPage.doBancontactPayment("Attila test", config.bcmc.be.cardNumber, config.bcmc.be.expDate);
    await paymentPage.placeOrder();

    const threeDSpaymentPage = new ThreeDSpaymentPage();
    await threeDSpaymentPage.do3DSValidation(config.bcmc.be.user, config.bcmc.be.password);
    await paymentPage.expectSuccess();
});

test('Refused Bancontact payment', async t => {
    const paymentPage = new PaymentPage();
    await paymentPage.goToCheckoutPageWithFullCart();

    const user = new User();
    await user.setUser('belgianUser');

    await paymentPage.goToPaymentsPage();
    await paymentPage.doBancontactPayment("Attila test", config.bcmc.be.cardNumber, config.bcmc.be.expDate);
    await paymentPage.placeOrder();

    const threeDSpaymentPage = new ThreeDSpaymentPage();
    await threeDSpaymentPage.do3DSValidation(config.bcmc.be.wrongUser, config.bcmc.be.wrongPassword);
    await paymentPage.expectError();
});
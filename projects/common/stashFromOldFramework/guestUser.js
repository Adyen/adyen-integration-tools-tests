import {Selector} from "testcafe";
import PaymentPage from "./modules/PaymentPage";
import User from "./modules/User";
import Magento2Config from "./Magento2Config";
import ThreeDSpaymentPage from "../commons/modules/ThreeDSPaymentPage"

const config = new Magento2Config();

fixture`Magento2 frontend guest user card payments`
    .page(config.storeFrontURL);

test('Successful card payment without 3DS', async t => {
    const paymentPage = new PaymentPage();
    await paymentPage.goToCheckoutPageWithFullCart();

    const user = new User();
    await user.setUser('guestUser');
    await paymentPage.goToPaymentsPage();

    await paymentPage.doCardPayment("Attila test", config.masterCardWithout3D, config.expDate, config.cvc);
    await paymentPage.placeOrder();
    await paymentPage.expectSuccess();
});

test('Refused card payment without 3DS', async t => {
    const paymentPage = new PaymentPage();
    await paymentPage.goToCheckoutPageWithFullCart();

    const user = new User();
    await user.setUser('guestUser');
    await paymentPage.goToPaymentsPage();
    await paymentPage.doCardPayment("Attila test", config.masterCardWithout3D, config.wrongExpDate, config.cvc);
    await paymentPage.placeOrder();
    await paymentPage.expectRefusal();
});

test('Successful card payment without 3DS explicitly checking for terms and conditions checkbox - prerequisite: custom terms and conditions needs to be enabled and set up on the magento admin', async t => {
    const paymentPage = new PaymentPage();
    await paymentPage.goToCheckoutPageWithFullCart();

    const user = new User();
    await user.setUser('guestUser');
    await paymentPage.goToPaymentsPage();
    await paymentPage.doCardPayment("Attila test", config.masterCardWithout3D, config.expDate, config.cvc);

    await t
        .expect(paymentPage.termsAndConditionsCheckbox.exists).ok("Custom terms and conditions in NOT set up on the page");

    await paymentPage.placeOrder();
    await paymentPage.expectSuccess();
});


test('Successful card payment with 3DS1', async t => {
    const paymentPage = new PaymentPage();
    await paymentPage.goToCheckoutPageWithFullCart();

    const user = new User();
    await user.setUser('guestUser');
    await paymentPage.goToPaymentsPage();

    await paymentPage.doCardPayment("Attila test", config.visa3DS1, config.expDate, config.cvc);
    await paymentPage.placeOrder();


    const threeDSpaymentPage = new ThreeDSpaymentPage();
    await threeDSpaymentPage.do3DSValidation('user', 'password');
    await paymentPage.expectSuccess();
});

test('Refused card payment with 3DS', async t => {
    const paymentPage = new PaymentPage();
    await paymentPage.goToCheckoutPageWithFullCart();

    const user = new User();
    await user.setUser('guestUser');
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
    await user.setUser('guestUser');
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
    await user.setUser('guestUser');
    await paymentPage.goToPaymentsPage();

    await paymentPage.doCardPayment("Attila test", config.masterCard3DS2, config.expDate, config.cvc);
    await paymentPage.placeOrder();
    await paymentPage.do3DS2Validation(config.threeDS2WrongAnswer);
    await paymentPage.expectRefusal();
});

test('Successful iDeal payment', async t => {
    const paymentPage = new PaymentPage();
    await paymentPage.goToCheckoutPageWithFullCart();

    const user = new User();
    await user.setUser('guestUserDutch');
    await paymentPage.goToPaymentsPage();

    await paymentPage.doIDealPayment();
    await paymentPage.expectSuccess();
});

test('Refused iDeal payment', async t => {
    const paymentPage = new PaymentPage();
    await paymentPage.goToCheckoutPageWithFullCart();

    const user = new User();
    await user.setUser('guestUserDutch');
    await paymentPage.goToPaymentsPage();

    await paymentPage.doIDealPayment('refused');
    await paymentPage.expectError();
});

test('Successful Klarna payment, using street line 2 for housenumber - prerequisite: address line 2 needs to be enabled on the magento admin', async t => {
    const paymentPage = new PaymentPage();
    await paymentPage.goToCheckoutPageWithFullCart();

    const user = new User();
    await user.setUser('guestUserKlarna', true);
    await paymentPage.goToPaymentsPage();

    await paymentPage.doKlarnaPayment("continue", config.klarnaApprovedNLDateOfBirth);
    await paymentPage.expectSuccess();
});

test('Cancelled Klarna payment', async t => {
    const paymentPage = new PaymentPage();
    await paymentPage.goToCheckoutPageWithFullCart();

    const user = new User();
    await user.setUser('guestUserKlarna', true);
    await paymentPage.goToPaymentsPage();

    await paymentPage.doKlarnaPayment("cancel");
    await paymentPage.expectError();
});

test('Changing shipping country successfully refresh payment methods list', async t => {
    const paymentPage = new PaymentPage();
    await paymentPage.goToCheckoutPageWithFullCart();

    const user = new User();
    await user.setUser('guestUserDutch');
    await paymentPage.goToPaymentsPage();

    await t
      .expect(paymentPage.iDealInput.exists).ok("iDeal did not appear, while it should.");

    await paymentPage.goToShippingAddressPage();
    await paymentPage.changeCountry("HU");
    await paymentPage.goToPaymentsPage();

    await t
      .expect(paymentPage.iDealInput.exists).notOk("iDeal appeared, while it shouldn't");
});

test('Successful payment with combo card - prerequisite BRL set up as default currency on M2', async t => {
    const paymentPage = new PaymentPage();
    await paymentPage.changeCurrency('BRL');
    await paymentPage.goToCheckoutPageWithFullCart();

    const user = new User();
    await user.setUser('guestUserBrazilian');
    await paymentPage.goToPaymentsPage();

    await paymentPage.doCardPayment("Attila test", config.masterCardWithout3D, config.expDate, config.cvc);
    await paymentPage.selectCardType(config.cardTypes.debit);

    await paymentPage.placeOrder();
    await paymentPage.expectSuccess();
});

test('Successful Oney payment', async t => {
    const paymentPage = new PaymentPage();
    await paymentPage.goToCheckoutPageWithFullCart(300);

    const user = new User();
    await user.setUser('guestUserOney', true);
    await paymentPage.goToPaymentsPage();

    await paymentPage.doOneyPayment("continue", config.guestUser.oney.approved.fr, [config.oneyCard, config.cvc, config.expDate]);
    await paymentPage.expectSuccess();
});

test('Refused Oney payment', async t => {
    const paymentPage = new PaymentPage();
    await paymentPage.goToCheckoutPageWithFullCart();

    const user = new User();
    await user.setUser('guestUserOney', true);
    await paymentPage.goToPaymentsPage();

    await paymentPage.doOneyPayment("refused", config.guestUser.oney.approved.fr, [config.oneyCard, config.cvc, config.expDate]);
    await paymentPage.expectError();
});

test('Successful Multibanco payment', async t => {
    const paymentPage = new PaymentPage();
    await paymentPage.goToCheckoutPageWithFullCart();

    const user = new User();
    await user.setUser('guestUserPortuguese');
    await paymentPage.goToPaymentsPage();

    await paymentPage.doSimplePayment(paymentPage.multibancoInput());
    await paymentPage.expectVoucherInSuccessPage();
});

test('Successful bankTransfer_IBAN (SEPA Bank Transfer) payment', async t => {
    const paymentPage = new PaymentPage();
    await paymentPage.goToCheckoutPageWithFullCart();

    const user = new User();
    await user.setUser('guestUser');
    await paymentPage.goToPaymentsPage();

    await paymentPage.doSimplePayment(paymentPage.bankTransfer_IBANInput());
    await paymentPage.expectSuccess();
});

test('Successful sepadirectdebit payment', async t => {
    const paymentPage = new PaymentPage();
    await paymentPage.goToCheckoutPageWithFullCart();

    const user = new User();
    await user.setUser('guestUser');
    await paymentPage.goToPaymentsPage();

    await paymentPage.doSepaDirectDebitPayment(config.sepaDirectDebit);
    await paymentPage.expectSuccess();
});

test('Successful AfterPay payment', async t => {
    const paymentPage = new PaymentPage();
    await paymentPage.goToCheckoutPageWithFullCart();

    const user = new User();
    await user.setUser('guestAfterPayApprovedUser');
    await paymentPage.goToPaymentsPage();

    await paymentPage.doAfterPayPayment(config.afterPayApprovedNLGender, config.afterPayApprovedNLDateOfBirth, config.afterPayApprovedNLHouseNumber);

    await paymentPage.expectSuccess();
});

test('Refused AfterPay payment', async t => {
    const paymentPage = new PaymentPage();
    await paymentPage.goToCheckoutPageWithFullCart();

    const user = new User();
    await user.setUser('guestAfterPayDeniedUser');
    await paymentPage.goToPaymentsPage();

    await paymentPage.doAfterPayPayment(config.afterPayApprovedNLGender, config.afterPayApprovedNLDateOfBirth, config.afterPayDeniedNLHouseNumber);

    await paymentPage.expectRefusal();
});

test('Successful Bancontact payment', async t => {
    const paymentPage = new PaymentPage();
    await paymentPage.goToCheckoutPageWithFullCart();

    const user = new User();
    await user.setUser('guestUserBelgian');

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
    await user.setUser('guestUserBelgian');

    await paymentPage.goToPaymentsPage();
    await paymentPage.doBancontactPayment("Attila test", config.bcmc.be.cardNumber, config.bcmc.be.expDate);
    await paymentPage.placeOrder();

    const threeDSpaymentPage = new ThreeDSpaymentPage();
    await threeDSpaymentPage.do3DSValidation(config.bcmc.be.wrongUser, config.bcmc.be.wrongPassword);
    await paymentPage.expectError();
});
import {Selector, t, ClientFunction} from "testcafe";
import User from "./User";
import Product from "./Product";
import OneyPaymentPage from "../../commons/modules/OneyPaymentPage";

export default class PaymentPage {
    user = new User();
    product = new Product();

    shippingMethodsButton = Selector('#shipping-method-buttons-container .continue');
    backToShippingMethods = Selector('.opc-progress-bar-item').withText('Shipping');
    currencyDropDown = Selector('#switcher-currency-trigger');
    currencyDropDownList = Selector('#switcher-currency');
    successMessage = Selector('.message-success');
    creditCardInput = Selector('#adyen_cc');
    bcmcInput = Selector('#adyen_bcmc');
    bcmcCardNumberIframe = Selector('#payment_form_adyen_hpp_bcmc .adyen-checkout__card__cardNumber__input iframe');
    bcmcExpDateIframe = Selector('#payment_form_adyen_hpp_bcmc .adyen-checkout__card__exp-date__input iframe');
    iDealInput = Selector('#adyen_ideal');
    klarnaInput = Selector('#adyen_klarna');
    oneyInput = Selector('#adyen_facilypay_4x');
    sepaDirectDebitInput = Selector('#adyen_sepadirectdebit');
    multibancoInput = Selector('#adyen_multibanco');
    bankTransfer_IBANInput = Selector('#adyen_bankTransfer_IBAN');
    afterPayInput = Selector('#adyen_afterpay_default');
    oneClickInput = Selector('.adyen_oneclick');
    holderNameInput = Selector('#payment_form_adyen_cc .adyen-checkout__card__holderName input');
    bcmcHolderNameInput = Selector('#payment_form_adyen_hpp_bcmc input.adyen-checkout__card__holderName__input');
    cardNumberIFrame = Selector('.adyen-checkout__card__cardNumber__input iframe');
    cardNumberInput = Selector('#encryptedCardNumber');
    expDateIFrame = Selector('.adyen-checkout__card__exp-date__input iframe');
    expDateInput = Selector('#encryptedExpiryDate');
    cvcIFrame = Selector('.adyen-checkout__card__cvc__input iframe');
    cvcInput = Selector('#encryptedSecurityCode')
    klarnaIframe = Selector('#klarna-hpp-instance-fullscreen');

    billingAsShippingAddress = Selector('#billing-address-same-as-shipping-adyen_oneclick');
    billingAsShippingAddressHpp = Selector('.payment-method._active #billing-address-same-as-shipping-adyen_hpp');
    billingAsShippingAddressDropDown = Selector('.payment-method._active .field-select-billing select');
    billingAsShippingAddressDropDownOption = this.billingAsShippingAddressDropDown.find('option');

    iDealDropDown = Selector('#payment_form_adyen_hpp_ideal .adyen-checkout__dropdown__button');
    iDealDropDownList = Selector('#payment_form_adyen_hpp_ideal .adyen-checkout__dropdown__list');
    iDealDropDownListElement = Selector('#payment_form_adyen_hpp_ideal .adyen-checkout__dropdown__list li');
    iDealRefusedDropDownListElement = Selector('#payment_form_adyen_hpp_ideal .adyen-checkout__dropdown__list li')
        .withText('Test Issuer Refused');
    iDealContinueButtonOnHPP = Selector('input[type="submit"]');

    threeDS2ChallengeIframe = Selector('.adyen-checkout__threeds2__challenge iframe');
    threeDS2ChallengeInput = Selector('input[name="answer"]');
    threeDS2ChallengeSubmit = Selector('input[type="submit"]');

    termsAndConditionsCheckbox = Selector('.checkout-agreement input[type="checkbox"]');
    placeOrderButton = Selector('.payment-method._active button[type=submit]');

    errorMessage = Selector('.message-error');

    klarnaBuyButton = Selector('#buy-button');
    klarnaDateOfBirthInput = Selector('#purchase-approval-form-date-of-birth');
    klarnaContinueButton = Selector('#purchase-approval-form-continue-button');
    klarnaRedirectButton = Selector('#confirmation__footer-button-wrapper button');
    klarnaCancelButton = Selector('#back-button');

    oneyFormContainer = Selector('#payment_form_adyen_hpp_facilypay_4x');
    afterPayFormContainer = Selector('#payment_form_adyen_hpp_afterpay_default');

    formContainerGenderRadioButton = function (gender = "M") {
        return 'input.adyen-checkout__radio_group__input[value*=' + gender + ']'
    };

    formDateOfBirthInput = 'input[name=dateOfBirth]';
    formHouseNumberOrName = 'input[name=houseNumberOrName]';
    formConsentCheckbox = 'input[name=consentCheckbox]';

    sepaDirectDebitAccountNameInput = Selector('#payment_form_adyen_hpp_sepadirectdebit input[name="sepa.ownerName"]');
    sepaDirectDebitIbanInput = Selector('#payment_form_adyen_hpp_sepadirectdebit input[name="sepa.ibanNumber"]');

    saveForNextPaymentCheckbox = Selector('.adyen-checkout__checkbox input[type="checkbox"]');
    checkoutUrl = '/checkout';

    cartTotal = Selector('#cart-totals .grand.totals .price');
    cartItemQtyInput = Selector('#shopping-cart-table .cart.item .input-text.qty');

    cartUrl = '/checkout/cart';

    endAnimationWatcher = ClientFunction(() => {
        return new Promise(resolve => {
            var interval = setInterval(() => {
                let loader = document.querySelector('.loading-mask');

                if (!loader) {
                  clearInterval(interval);
                  resolve();
                }

                let style = window.getComputedStyle(loader);
                if (style.display !== 'none')
                    return;

                clearInterval(interval);
                resolve();
            }, 100);
        });
    });

    getLocation = ClientFunction(() => document.location.href);

    fillHolderName = async (holderName) => {
      await t
        .typeText(this.holderNameInput, holderName);
    }

    fillCardNumber = async (cardNumber) => {
        await t
        .switchToIframe(this.cardNumberIFrame.filterVisible())
        .typeText(this.cardNumberInput, cardNumber)
        .switchToMainWindow();
    }

    fillExpDate = async (expDate) => {
        await t
        .switchToIframe(this.expDateIFrame.filterVisible())
        .typeText(this.expDateInput, expDate)
        .switchToMainWindow();
    }

    fillCVC = async (cvc) => {
      await t
          .switchToIframe(this.cvcIFrame.filterVisible())
          .typeText(this.cvcInput, cvc)
          .switchToMainWindow();
    }

    fillThreeDS2ChallengeAndSubmit = async (answer) => {
        await t
        .switchToIframe(this.threeDS2ChallengeIframe)
        .typeText(this.threeDS2ChallengeInput, answer)
        .click(this.threeDS2ChallengeSubmit)
        .switchToMainWindow()
        .wait(5000);
    }

    fillBcmcHolderName = async (holderName) => {
        await t
            .typeText(this.bcmcHolderNameInput, holderName);
    }

    fillBcmcCardNumber = async (cardNumber) => {
        await t
            .switchToIframe(this.bcmcCardNumberIframe.filterVisible())
            .typeText(this.cardNumberInput, cardNumber)
            .switchToMainWindow();
    }

    fillBcmcExpDate = async (expDate) => {
        await t
            .switchToIframe(this.bcmcExpDateIframe.filterVisible())
            .typeText(this.expDateInput, expDate)
            .switchToMainWindow();
    }

    goToCheckoutPageWithFullCart = async (cartMinimum = null) => {
        await this.product.addProductToCart();
        await this.successMessage();
        if (!!cartMinimum) {
            await t
                .navigateTo(this.cartUrl);
            let cartTotalString = await this.cartTotal().textContent
            let cartTotalNumber = Number(cartTotalString.replace(/[^0-9.-]+/g, ""));
            if (cartMinimum > cartTotalNumber) {
                await t.click(this.cartItemQtyInput()).pressKey('ctrl+a delete')
                    .typeText(this.cartItemQtyInput(), Math.ceil(cartMinimum / cartTotalNumber).toString())
                    .pressKey('enter');
            }
        }

      await t
          .navigateTo(this.checkoutUrl);

      await this.endAnimationWatcher();
    }

    goToPaymentsPage = async () => {
      await this.endAnimationWatcher();

      await t
        .click(this.shippingMethodsButton);

      await this.endAnimationWatcher();
    }

    doCardPayment = async (holderName, cardNumber, expDate, cvc, saveForNextPayment = false) => {

        await t
            .click(this.creditCardInput);
        await this.fillHolderName(holderName);
        await this.fillCardNumber(cardNumber);
        await this.fillExpDate(expDate);
        await this.fillCVC(cvc);
        if(saveForNextPayment){
          await this.checkSaveForNextPayment();
        }
    }

    doBancontactPayment = async (holderName, cardNumber, expDate) => {
        await t
            .click(this.bcmcInput);
        await this.fillBcmcCardNumber(cardNumber);
        await this.fillBcmcExpDate(expDate);
        await this.fillBcmcHolderName(holderName);
    }

    checkSaveForNextPayment = async () => {
      if(await this.saveForNextPaymentCheckbox.exists) {
          await t
              .click(this.saveForNextPaymentCheckbox.filterVisible());
      }
    }

    checkTermsAndConditions = async () => {
      if(await this.termsAndConditionsCheckbox.exists) {
          await t
              .click(this.termsAndConditionsCheckbox.filterVisible());
      }
    }


    placeOrder = async () => {
      await this.checkTermsAndConditions();

      await t
          .click(this.placeOrderButton);
    }

    do3DS2Validation = async (answer) => {
      await this.fillThreeDS2ChallengeAndSubmit(answer);
    }

    expectSuccess = async () => {
      await t
        .wait(3000)
        .expect(this.getLocation()).contains('checkout/onepage/success');
    }

    expectVoucherInSuccessPage = async () => {
        await t
            .expect(Selector('#ActionContainer .adyen-checkout__voucher-result')).ok();
    }

    expectRefusal = async () => {
      await t
        .expect(this.errorMessage.innerText).eql('The payment is REFUSED.', 'The payment is REFUSED.');
    }

    expectError = async () => {
      await t
        .expect(this.errorMessage.innerText).eql('Your payment failed, Please try again later', 'Your payment failed, Please try again later')
        .expect(this.getLocation()).contains('checkout/cart');
    }

    expectPlaceOrderDisabled = async () => {
     let placeOrderButton = Selector('.payment-method._active button[type=submit]');
      await t
        .expect(placeOrderButton.hasAttribute('disabled')).ok('this assertion will pass');
    }

    doIDealPayment = async (action = 'approved') => {
        await t
            .click(this.iDealInput)
            .click(this.iDealDropDown);

        switch (action) {
            case 'refused':
                await t
                    .click(this.iDealRefusedDropDownListElement);
                break;
            default:
                await t
                    .click(this.iDealDropDownListElement);
                break;
        }
        await this.placeOrder();
        await this.continueOnHPP();
    }

    continueOnHPP = async () => {
      await t
        .click(this.iDealContinueButtonOnHPP);
    }

    doOneClickPayment = async (cvc) => {
      await t
          .click(this.oneClickInput);

      await this.fillCVC(cvc);
      await this.placeOrder();
    }

    doOneClickPaymentWithEmptyRequiredFields = async (cvc) => {

      await t
          .click(this.oneClickInput)
          .click(this.billingAsShippingAddress.filterVisible())
          .click(this.billingAsShippingAddressDropDown)
          .click(this.billingAsShippingAddressDropDownOption.withText("New Address"));

      await this.fillCVC(cvc);
      await this.placeOrder();
    }

    doKlarnaPayment = async (action, dateOfBirth = null) => {
      await t
          .click(this.klarnaInput);
      await this.placeOrder();

      switch (action) {
        case 'continue':
          await this.continueOnKlarna(dateOfBirth);
          break;
        case 'cancel':
          await this.cancelOnKlarna();
          break;
        default:
          await this.continueOnKlarna(dateOfBirth);
      }

    }

    continueOnKlarna = async (dateOfBirth) => {
      // doesn't wait for the button to be clickable
      const klarnaBuyButton = await this.klarnaBuyButton.with({ visibilityCheck: true })();
      await t
          .expect(this.klarnaBuyButton.hasAttribute('disabled')).notOk('ready for testing', {timeout: 5000})
          .click(this.klarnaBuyButton)
          .switchToIframe(this.klarnaIframe)
          .typeText(this.klarnaDateOfBirthInput, dateOfBirth)
          .click(this.klarnaContinueButton)
          .switchToMainWindow();
    }

    cancelOnKlarna = async () => {
      await t
        .click(this.klarnaCancelButton);
    }

    doOneyPayment = async (action, userData, card) => {
        const oneyPaymentPage = new OneyPaymentPage();
        await t
            .click(this.oneyInput())
            .click(this.billingAsShippingAddressHpp)
            .click(this.oneyFormContainer.find(this.formContainerGenderRadioButton()))
            .typeText(this.oneyFormContainer.find(this.formDateOfBirthInput), userData.dateOfBirth)
            .typeText(this.oneyFormContainer.find(this.formHouseNumberOrName), '1'); //TODO the component will set this config PW-3698
        await this.placeOrder();

        switch (action) {
            case 'continue':
                await oneyPaymentPage.continueOnOney(userData, card);
                break;
            case 'refused':
            //Do nothing, cart amount is <150 and Oney will refuse
                break;
        }
    }

    doSimplePayment = async (selector) => {
        await t
            .click(selector);
        await this.placeOrder();
    }

    doSepaDirectDebitPayment = async (data) => {
        await t
            .click(this.sepaDirectDebitInput)
            .typeText(this.sepaDirectDebitAccountNameInput, data.nl.accountName)
            .typeText(this.sepaDirectDebitIbanInput, data.nl.iban)
        await this.placeOrder();
    }

    doAfterPayPayment = async (gender, dateOfBirth, houseNumber) => {
        await t
            .click(this.afterPayInput())
            .click(this.billingAsShippingAddressHpp)
            .click(this.afterPayFormContainer().find(this.formContainerGenderRadioButton(gender)))
            .click(this.afterPayFormContainer().find(this.formConsentCheckbox))
            .typeText(this.afterPayFormContainer.find(this.formDateOfBirthInput), dateOfBirth)
            .typeText(this.afterPayFormContainer.find(this.formHouseNumberOrName), houseNumber); //TODO the component will set this config PW-3698
        await this.placeOrder();

    }

    goToShippingAddressPage = async () => {
      await t
        .click(this.backToShippingMethods);
    }

    changeCountry = async (countryCode) => {
      await t
        .click(this.user.checkoutPageUserCountrySelect)
        .click(this.user.checkoutPageUserCountrySelectOption.withAttribute('value', countryCode))
    }

    selectCardType = async (cardType) => {
        this.comboCardSelect = Selector('#adyen-combo-card-select')
        this.comboCardOption = this.comboCardSelect.find('option')
        await t.click(this.comboCardSelect)
            .click(this.comboCardOption.withText(cardType))
    }

    selectInstallments = async () => {
        this.installmentsSelect = Selector('#adyen_cc_installments')
        this.installmentsOption = this.installmentsSelect.find('option')

        await t.click(this.installmentsSelect)
        .click(this.installmentsOption.withText('10 x'))
    }

    changeCurrency = async (currency) => {
    let currencyDropDownListItem = Selector('#switcher-currency > div > ul > li.currency-'+ currency +'.switcher-option');

        if (await currencyDropDownListItem.exists) {
            await t
            .click(this.currencyDropDown)
            .click(this.currencyDropDownList)
            .click(currencyDropDownListItem)
        } else {
          throw 'The currency '+ currency +' is not configured ';
        }
    }
}

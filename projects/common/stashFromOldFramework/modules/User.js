import {Selector, Role, t} from "testcafe";
import Magento2Config from "../Magento2Config";

export default class User {
    config = new Magento2Config();
    loginUrl = '/customer/account';
    emailInput = Selector('#email');
    passwordInput = Selector('#pass');
    submitButton = Selector('#send2');
    customerAccountPage = Selector('.account.customer-account-index');

    checkoutPageUserEmailInput = Selector('.form-login #customer-email');
    checkoutPageUserPasswordInput = Selector('.form-login #customer-password');
    checkoutPageLoginButton = Selector('.form-login button[type="submit"]');

    checkoutPageUserFirstNameInput = Selector('#shipping-new-address-form input[name="firstname"]');
    checkoutPageUserLastNameInput = Selector('#shipping-new-address-form input[name="lastname"]');
    checkoutPageUserStreetLine1Input = Selector('#shipping-new-address-form input[name="street[0]"]');
    checkoutPageUserStreetLine2Input = Selector('#shipping-new-address-form input[name="street[1]"]');
    checkoutPageUserCityInput = Selector('#shipping-new-address-form input[name="city"]');
    checkoutPageUserPostCodeInput = Selector('#shipping-new-address-form input[name="postcode"]');
    checkoutPageUserCountrySelect = Selector('#shipping-new-address-form select[name="country_id"]');
    checkoutPageUserCountrySelectOption = this.checkoutPageUserCountrySelect.find('option');
    checkoutPageUserStateOrProvinceSelect = Selector('#shipping-new-address-form select[name="region_id"]');
    checkoutPageUserStateOrProvinceSelectOption = this.checkoutPageUserStateOrProvinceSelect.find('option');
    checkoutPageUserTelephoneInput = Selector('#shipping-new-address-form input[name="telephone"]');

    shippingMethodRadioButton = Selector('#checkout-shipping-method-load input[type="radio"]').nth(0);

    _setUser = async (email, password) => {
      await t
        .typeText(this.checkoutPageUserEmailInput, email, { paste: true })
        .wait(300)
        .typeText(this.checkoutPageUserPasswordInput, password)
        .wait(300)
        .click(this.checkoutPageLoginButton);
    }

    _setGuestUser = async (email, firstName, lastName, street, houseNumber, city, postCode, countryCode, phoneNumber, useStreetLine2ForHouseNumber = false, useStateOrProvince = false, stateOrProvince = null) => {
      await t
        .click(this.checkoutPageUserCountrySelect)
        .click(this.checkoutPageUserCountrySelectOption.withAttribute('value', countryCode))
        .click(this.shippingMethodRadioButton)
        .typeText(this.checkoutPageUserEmailInput, email, { paste: true })
        .typeText(this.checkoutPageUserFirstNameInput, firstName)
        .typeText(this.checkoutPageUserLastNameInput, lastName);

      if (useStreetLine2ForHouseNumber) {
        await t
          .typeText(this.checkoutPageUserStreetLine1Input, street)
          .typeText(this.checkoutPageUserStreetLine2Input, houseNumber);
      } else {
        await t
          .typeText(this.checkoutPageUserStreetLine1Input, street + " " + houseNumber);
      }

      await t
        .typeText(this.checkoutPageUserCityInput, city)
        .typeText(this.checkoutPageUserPostCodeInput, postCode)
        .typeText(this.checkoutPageUserTelephoneInput, phoneNumber);

    if (useStateOrProvince) {
        await t
            .click(this.checkoutPageUserStateOrProvinceSelect)
            .click(this.checkoutPageUserStateOrProvinceSelectOption.withAttribute('value', stateOrProvince))
    }
    }

    userRoles = (useStreetLine2ForHouseNumber) => ({
        regularUser: () => this._setUser(this.config.registeredUser.regular.userName, this.config.registeredUser.regular.password),
        brazilianUser: () => this._setUser(this.config.registeredUser.brazilianUser.userName, this.config.registeredUser.brazilianUser.password),
        frenchUser: () => this._setUser(this.config.registeredUser.frenchUser.userName, this.config.registeredUser.frenchUser.password),
        portugueseUser: () => this._setUser(this.config.registeredUser.portugueseUser.userName, this.config.registeredUser.portugueseUser.password),
        belgianUser: () => this._setUser(this.config.registeredUser.belgianUser.userName, this.config.registeredUser.belgianUser.password),
        guestUser: () => this._setGuestUser(this.config.guestUser.regular.email,
          this.config.guestUser.regular.firstName, this.config.guestUser.regular.lastName,
          this.config.guestUser.regular.street, this.config.guestUser.regular.houseNumber, this.config.guestUser.regular.city, this.config.guestUser.regular.postCode,
          this.config.guestUser.regular.countryCode, this.config.guestUser.regular.phoneNumber, useStreetLine2ForHouseNumber),
        guestUserDutch: () => this._setGuestUser(this.config.guestUser.dutch.email,
          this.config.guestUser.dutch.firstName, this.config.guestUser.dutch.lastName,
          this.config.guestUser.dutch.street, this.config.guestUser.dutch.houseNumber, this.config.guestUser.dutch.city, this.config.guestUser.dutch.postCode,
          this.config.guestUser.dutch.countryCode, this.config.guestUser.dutch.phoneNumber, useStreetLine2ForHouseNumber),
        guestUserKlarna: () => this._setGuestUser(this.config.guestUser.klarna.approved.nl.email,
            this.config.guestUser.klarna.approved.nl.firstName, this.config.guestUser.klarna.approved.nl.lastName,
            this.config.guestUser.klarna.approved.nl.street, this.config.guestUser.klarna.approved.nl.houseNumber, this.config.guestUser.klarna.approved.nl.city, this.config.guestUser.klarna.approved.nl.postCode,
            this.config.guestUser.klarna.approved.nl.countryCode, this.config.guestUser.klarna.approved.nl.phoneNumber, useStreetLine2ForHouseNumber),
        guestUserOney: () => this._setGuestUser(this.config.guestUser.oney.approved.fr.email,
            this.config.guestUser.oney.approved.fr.firstName, this.config.guestUser.oney.approved.fr.lastName,
            this.config.guestUser.oney.approved.fr.street, this.config.guestUser.oney.approved.fr.houseNumber, this.config.guestUser.oney.approved.fr.city, this.config.guestUser.oney.approved.fr.postCode,
            this.config.guestUser.oney.approved.fr.countryCode, this.config.guestUser.oney.approved.fr.phoneNumber, useStreetLine2ForHouseNumber),
        guestUserPortuguese: () => this._setGuestUser(this.config.guestUser.portuguese.email,
            this.config.guestUser.portuguese.firstName, this.config.guestUser.portuguese.lastName,
            this.config.guestUser.portuguese.street, this.config.guestUser.portuguese.houseNumber, this.config.guestUser.portuguese.city, this.config.guestUser.portuguese.postCode,
            this.config.guestUser.portuguese.countryCode, this.config.guestUser.portuguese.phoneNumber, useStreetLine2ForHouseNumber),
        guestUserBelgian: () => this._setGuestUser(this.config.guestUser.belgian.email,
            this.config.guestUser.belgian.firstName, this.config.guestUser.belgian.lastName,
            this.config.guestUser.belgian.street, this.config.guestUser.belgian.houseNumber, this.config.guestUser.belgian.city, this.config.guestUser.belgian.postCode,
            this.config.guestUser.belgian.countryCode, this.config.guestUser.belgian.phoneNumber, useStreetLine2ForHouseNumber),
        guestAfterPayApprovedUser: () => this._setGuestUser(this.config.guestUser.afterPay.approved.nl.email,
            this.config.guestUser.afterPay.approved.nl.firstName, this.config.guestUser.afterPay.approved.nl.lastName,
            this.config.guestUser.afterPay.approved.nl.address, this.config.guestUser.afterPay.approved.nl.houseNumber, this.config.guestUser.afterPay.approved.nl.city, this.config.guestUser.afterPay.approved.nl.postCode,
            this.config.guestUser.afterPay.approved.nl.countryCode, this.config.guestUser.afterPay.approved.nl.phoneNumber, useStreetLine2ForHouseNumber),
        guestAfterPayDeniedUser: () => this._setGuestUser(this.config.guestUser.afterPay.denied.nl.email,
            this.config.guestUser.afterPay.denied.nl.firstName, this.config.guestUser.afterPay.denied.nl.lastName,
            this.config.guestUser.afterPay.denied.nl.address, this.config.guestUser.afterPay.denied.nl.houseNumber, this.config.guestUser.afterPay.denied.nl.city, this.config.guestUser.afterPay.denied.nl.postCode,
            this.config.guestUser.afterPay.denied.nl.countryCode, this.config.guestUser.afterPay.denied.nl.phoneNumber, useStreetLine2ForHouseNumber),
        klarnaApprovedUser: () => this._setUser(this.config.registeredUser.klarna.approved.email,
            this.config.registeredUser.klarna.approved.password),
        afterPayApprovedUser: () => this._setUser(this.config.registeredUser.afterPay.approved.email,
                this.config.registeredUser.afterPay.approved.password),
        afterPayDeniedUser: () => this._setUser(this.config.registeredUser.afterPay.denied.email,
            this.config.registeredUser.afterPay.denied.password),
        guestUserBrazilian: () => this._setGuestUser(this.config.guestUser.brazilian.email,
            this.config.guestUser.brazilian.firstName, this.config.guestUser.brazilian.lastName,
            this.config.guestUser.brazilian.street, this.config.guestUser.brazilian.houseNumber, this.config.guestUser.brazilian.city, this.config.guestUser.brazilian.postCode,
            this.config.guestUser.brazilian.countryCode, this.config.guestUser.brazilian.phoneNumber, useStreetLine2ForHouseNumber, true, this.config.guestUser.brazilian.stateOrProvince),
        })

    setUser = async (userType = 'regularUser', useStreetLine2ForHouseNumber = false) => {
      await this.userRoles(useStreetLine2ForHouseNumber)[userType]();
    }
}

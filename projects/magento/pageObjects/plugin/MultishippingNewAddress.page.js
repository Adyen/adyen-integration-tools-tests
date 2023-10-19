export class MultishippingNewAddress {
    constructor(page, user) {
        this.page = page;
        this.user = user;

        this.addressForm = page.locator("#form-validate");
        this.firstnameInput = this.addressForm.locator("#firstname");
        this.lastnameInput = this.addressForm.locator("#lastname");
        this.phoneNumberInput = this.addressForm.locator("#telephone");
        this.streetAddressFirstLineInput = this.addressForm.locator("#street_1");
        this.streetAddressSecondLineInput = this.addressForm.locator("#street_2");
        this.countryDropdown = this.addressForm.locator("#country");
        this.stateInput = this.addressForm.locator("#region");
        this.cityInput = this.addressForm.locator("#city");
        this.postCodeInput = this.addressForm.locator("#zip");
        this.submitButton = this.addressForm.locator("button.save");
        this.primaryBillingCheckbox = this.addressForm.locator("#primary_billing");
    }

    async fillNewAddressForm()  {
        await this.firstnameInput.fill(this.user.firstName);
        await this.lastnameInput.fill(this.user.lastName);
        await this.phoneNumberInput.fill(this.user.phoneNumber);
        await this.streetAddressFirstLineInput.fill(this.user.street);
        await this.streetAddressSecondLineInput.fill(this.user.houseNumber);
        await this.countryDropdown.selectOption(this.user.countryCode);
        await this.stateInput.fill(this.user.stateCode);
        await this.cityInput.fill(this.user.city);
        await this.postCodeInput.fill(this.user.postCode);
        await this.primaryBillingCheckbox.check();

        await this.submitButton.click();
    }
}

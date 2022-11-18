import { SPRBasePage } from "./SPRBase.page.js";

export class ShippingDetailsPage extends SPRBasePage {
    constructor(page) {
        super(page);
        this.page = page;

        // Shipping details form
        this.shippingFormContainer = page.locator(".register-form");

        this.salutationDropDown = this.shippingFormContainer.locator("#personalSalutation");
        this.firstNameField = this.shippingFormContainer.locator("#personalFirstName");
        this.lastNameField = this.shippingFormContainer.locator("#personalLastName");
        this.noCustomerAccountCheckBox = this.shippingFormContainer.locator("label[for='personalGuest']");
        this.emailField = this.shippingFormContainer.locator("#personalMail");

        this.addressField = this.shippingFormContainer.locator("#billingAddressAddressStreet");
        this.postCodeField = this.shippingFormContainer.locator("#billingAddressAddressZipcode");
        this.cityField = this.shippingFormContainer.locator("#billingAddressAddressCity");
        this.countrySelectDropdown = this.shippingFormContainer.locator("#billingAddressAddressCountry");
        this.stateSelectDropDown = this.shippingFormContainer.locator("#billingAddressAddressCountryState");

        //Continue button
        this.continueButton = page.locator(".register-submit button.btn-primary");

    }

    // Shipping details actions
    async fillShippingDetails(user) {
        await this.salutationDropDown.selectOption({ index: 1 });
        await this.firstNameField.fill(user.firstName);
        await this.lastNameField.fill(user.lastName);
        await this.noCustomerAccountCheckBox.click();
        await this.emailField.fill(user.email);

        await this.addressField.fill(user.street);
        await this.postCodeField.fill(user.postCode);
        await this.cityField.fill(user.city);

        await this.countrySelectDropdown.scrollIntoViewIfNeeded();
        await this.countrySelectDropdown.selectOption(user.shopwareCountryCode);

        if (await this.stateSelectDropDown.isVisible()) {
            await this.stateSelectDropDown.selectOption({ index: 2 });
        }
    }

    async clickContinue() {
        await this.continueButton.click();
    }


}
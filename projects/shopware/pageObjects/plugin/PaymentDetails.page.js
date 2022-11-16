import { CreditCardComponents } from "../../../common/checkoutComponents/CreditCardComponents.js";
import { SPRBasePage } from "./SPRBase.page.js";

export class PaymentDetailsPage extends SPRBasePage {
    constructor(page) {
        super(page)
        this.page = page;

        // Terms and conditions Checkbox
        this.termsAndConditionsCheckBox = page.locator("label[for='tos']");

        // Show More button
        this.showMoreButton = page.locator
            ("//span[@class='confirm-checkout-collapse-trigger-label' and contains(text(),'Show more')]");

        // Payment Method Specifics
        this.paymentDetailsList = page.locator("#changePaymentForm");
        this.cardSelector = this.paymentDetailsList.locator("img[alt='Cards']");

        //Submit Order button
        this.submitOrderButton = page.locator("#confirmFormSubmit");

    }

    // General actions

    async acceptTermsAndConditions() {
        await this.termsAndConditionsCheckBox.click({ position: { x: 1, y: 1 } });
    }

    async submitOrder() {
        await this.submitOrderButton.click();
    }

    async loadAllPaymentDetails() {
        if (await this.showMoreButton.isVisible()) {
            await this.showMoreButton.click();
        }
    }

    // Payment Method specific actions
    async selectCreditCard() {
        await this.cardSelector.click();
        return new CreditCardComponents(this.page);
    }

}

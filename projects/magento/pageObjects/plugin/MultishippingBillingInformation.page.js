import { CreditCardComponentsMagento } from "../checkout/CreditCardComponentsMagento.js";

export class MultishippingBillingInformation {
    constructor(page) {
        this.page = page;

        this.billingForm = page.locator("#multishipping-billing-form");
        this.creditCardMethodLabel = this.billingForm.locator("[for='p_method_adyen_cc']");
        this.idealMethodLabel = this.billingForm.locator("[for='p_method_adyen_ideal']");
        this.idealDropdown = page.locator("#idealContainer .adyen-checkout__dropdown__button");
        this.proceedToOrderReviewButton = this.billingForm.locator("button.continue");

        this.orderReviewForm = page.locator("#review-order-form");
        this.placeOrderButton = this.orderReviewForm.locator("button.submit");
    }

    async selectCreditCardPaymentMethod() {
        await this.creditCardMethodLabel.click();
        return new CreditCardComponentsMagento(this.page.locator("#cardContainer"));
    }

    async selectIdealPaymentMethod() {
        await this.idealMethodLabel.click();
    }

    async selectIdealIssuer(issuerName) {
        await this.idealDropdown.click();
        await this.page.locator(
            `.adyen-checkout__dropdown__list li [alt='${issuerName}']`
        ).click();
    }

    async proceedToOrderReviewPageAndPlaceOrder() {
        await this.proceedToOrderReviewButton.click();
        await this.placeOrderButton.click();
    }
}

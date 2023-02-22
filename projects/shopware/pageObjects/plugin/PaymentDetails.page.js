import { CreditCardComponents } from "../../../common/checkoutComponents/CreditCardComponents.js";
import { IDealComponents } from "../../../common/checkoutComponents/iDealComponents.js";
import { PayPalComponents } from "../../../common/checkoutComponents/PayPalComponents.js";
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
        this.payPalSelector = this.paymentDetailsList.locator("img[alt='PayPal']");
        this.idealWrapper = this.paymentDetailsList.locator("#adyen-payment-checkout-mask");
        this.idealSelector = this.paymentDetailsList.locator("img[alt='iDeal']");
        this.clearPaySelector = this.paymentDetailsList.locator("img[alt='Clearpay']");

        // Checkout Summary
        this.checkoutSummaryContainer = page.locator(".checkout-aside-container");

        // Submit Order button
        this.submitOrderButton = page.locator("#confirmFormSubmit");

        // Error message
        this.errorMessageContainer = page.locator(".alert-content");

    }

    // Redirect in case of an error

    async waitForRedirection() {

        await this.page.waitForNavigation({
            url: /ERROR/,
            timeout: 15000,
        });
    }

    get errorMessage() {
        return this.errorMessageContainer.innerText();
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

    async scrollToCheckoutSummary() {
        await this.checkoutSummaryContainer.scrollIntoViewIfNeeded();
    }

    // Payment Method specific actions
    async selectCreditCard() {
        await this.getPaymentMethodReady(this.cardSelector);
        return new CreditCardComponents(this.page);
    }

    async selectPayPal() {
        await this.getPaymentMethodReady(this.payPalSelector);
        return new PayPalComponents(this.page);

    }

    async selectIdeal(){
        await this.getPaymentMethodReady(this.idealSelector);
        return new IDealComponents(this.idealWrapper);
    }

    async selectClearPay(){
        await this.getPaymentMethodReady(this.clearPaySelector);
    }

    async getPaymentMethodReady(locator) {
        await locator.click();
        await this.page.waitForLoadState("networkidle", { timeout: 10000 });
        await locator.scrollIntoViewIfNeeded();
    }

}

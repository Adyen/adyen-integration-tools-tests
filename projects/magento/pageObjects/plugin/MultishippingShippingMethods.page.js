export class MultishippingShippingMethods {
    constructor(page) {
        this.page = page;

        this.shippingMethodForm = page.locator("#shipping_method_form");
        this.shippingMethodSelector = this.shippingMethodForm.locator(".methods-shipping");
        this.proceedToBillingInformationButton = this.shippingMethodForm.locator("button.continue");
    }

    async selectShippingMethods() {
        await this.shippingMethodSelector.first().getByText("Fixed").click();
        await this.shippingMethodSelector.nth(1).getByText("Fixed").click();
    }

    async proceedToBillingInformation() {
        await this.proceedToBillingInformationButton.click();
    }
}

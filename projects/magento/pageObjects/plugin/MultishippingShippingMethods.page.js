export class MultishippingShippingMethods {
    constructor(page) {
        this.page = page;

        this.shippingMethodForm = page.locator("#shipping_method_form");
        this.shippingMethodSelector = this.shippingMethodForm.locator(".methods-shipping");
        this.proceedToBillingInformationButton = this.shippingMethodForm.locator("button.continue");
    }

    async selectShippingMethods() {
        // Ugly implementation due to page.$$ not being stable to implement an iterator
        let firstShippingMethod = this.page.locator(".box-shipping-method").first();
        await firstShippingMethod.locator("[type=radio]").first().click();

        let lastShippingMethod = this.page.locator(".box-shipping-method").last();
        await lastShippingMethod.locator("[type=radio]").first().click();
    }

    async proceedToBillingInformation() {
        await this.proceedToBillingInformationButton.click();
    }
}

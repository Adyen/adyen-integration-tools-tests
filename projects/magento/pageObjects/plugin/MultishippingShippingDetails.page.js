export class MultishippingShippingDetails {
    constructor(page) {
        this.page = page;

        this.shippingForm = page.locator("#checkout_multishipping_form");
        this.addressDropdown = this.shippingForm.locator(".address .control select");
        this.enterNewAddressButton = this.shippingForm.locator("button.add");
        this.proceedToShippingInformationButton = this.shippingForm.locator("button.continue");
    }

    async goTo() {
        await this.page.goto("/multishipping/checkout/addresses");
    }

    async getAddressCount() {
        // Ugly wait should hopefully suffice
        await new Promise(r => setTimeout(r, 1000));
        return await this.addressDropdown.first().getByRole("option").count();
    }

    async updateItemAddress() {
        // Ugly wait should hopefully suffice
        await new Promise(r => setTimeout(r, 1000));
        const value = await this.addressDropdown.first().getByRole("option").last().getAttribute("value");
        await this.addressDropdown.first().selectOption(value);
    }

    async enterNewAddress() {
        await this.enterNewAddressButton.click();
        await this.page.waitForURL("**/checkout_address/newShipping/");
    }

    async proceedToShippingInformation() {
        await this.proceedToShippingInformationButton.click();
        await this.page.waitForURL("**/checkout/shipping/");
    }
}

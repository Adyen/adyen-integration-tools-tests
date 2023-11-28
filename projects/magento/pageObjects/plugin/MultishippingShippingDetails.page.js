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
         return await this.addressDropdown.first().getByRole("option").count();
    }

    async updateItemAddress() {
        const value = await this.addressDropdown.first().getByRole("option").last().getAttribute("value");
        await this.addressDropdown.first().selectOption(value);
    }

    async enterNewAddress() {
        await this.enterNewAddressButton.click();
    }

    async proceedToShippingInformation() {
        await this.proceedToShippingInformationButton.click();
    }
}

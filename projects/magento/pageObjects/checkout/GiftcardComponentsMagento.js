import { expect } from "@playwright/test";
import { GiftcardComponents } from "../../../common/checkoutComponents/GiftcardComponents.js";
export class GiftcardComponentsMagento extends GiftcardComponents {
    constructor(page) {
        super();
        this.page = page;

        this.addGiftcardButton = page
            .locator("#adyen_giftcard_giftcard_button_wrapper button");

        this.redeemOrPayButton = page
            .locator(".adyen-checkout__button--pay");

        this.removeSingleGiftcardButton = page
            .locator(".adyen-giftcard-remove-single");

        this.removeGiftcardStateDataButton = page
            .locator(".adyen-giftcard-remove-button")
            .first();

        this.availableGiftcardsDropdown = page
            .locator("#adyen_giftcard_giftcard_payment_methods")

        this.cardNumberInput = page
            .frameLocator(".adyen-checkout__card__cardNumber__input iframe")
            .locator(".input-field");

        this.cvcInput = page
            .frameLocator(".adyen-checkout__card__cvc__input iframe")
            .locator(".input-field");

        this.giftcardComponentResult = page
            .locator(".adyen-checkout__giftcard-result");

        this.typeDelay = 50;
    }
    async fillCardNumber(cardNumber) {
        await this.cardNumberInput.scrollIntoViewIfNeeded();
        await this.cardNumberInput.click();
        await this.cardNumberInput.type(cardNumber, { delay: this.typeDelay });
    }
    async fillCVC(CVC) {
        await this.cvcInput.scrollIntoViewIfNeeded();
        await this.cvcInput.click();
        await this.cvcInput.type(CVC, { delay: this.typeDelay });
    }
    async addGiftcard() {
        await this.addGiftcardButton.scrollIntoViewIfNeeded();
        await this.addGiftcardButton.click();
    }
    async redeemOrPay() {
        await this.redeemOrPayButton.scrollIntoViewIfNeeded();
        await this.redeemOrPayButton.click();
    }
    async removeSingleGiftcard()
    {
        await this.removeSingleGiftcardButton.scrollIntoViewIfNeeded();
        await this.removeSingleGiftcardButton.click();
    }
    async removeGiftcardStateData()
    {
        await this.removeGiftcardStateDataButton.scrollIntoViewIfNeeded();
        await this.removeGiftcardStateDataButton.click();
    }

    async selectGiftcard(txVariant) {
        await this.availableGiftcardsDropdown.scrollIntoViewIfNeeded();
        await this.availableGiftcardsDropdown.click();
        await this.availableGiftcardsDropdown.selectOption(txVariant);
    }

    async fillGiftcardInfo(
        cardNumber,
        cardCVC,
        cardBrand
    ) {
        await this.addGiftcard();
        await this.selectGiftcard(cardBrand);
        await this.fillCardNumber(cardNumber);
        await this.fillCVC(cardCVC);
    }

    async waitForGiftcardComponentReady() {
        await expect(this.addGiftcardButton).toBeVisible();
    }

    // Assertions of giftcard component
    async verifyGiftcardRemoval()
    {
        await expect(this.giftcardComponentResult).toBeHidden();
        await expect(this.addGiftcardButton).toBeVisible();
    }
}

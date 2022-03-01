export class GiftCardHPPage {
    constructor(page){
        this.page = page;

        this.cardHoldernameInput = page.locator("#genericgiftcard\\.cardHolderName");
        this.cardNumberInput = page.locator("#genericgiftcard\\.cardNumber");
        this.cardPinUnput = page.locator("#genericgiftcard\\.pin");

        this.partialPaymentCheckBox = page.locator("#genericgiftcard\\.partialPayments");
        this.continueButton = page.locator("#mainSubmit[value|='continue']");

        this.previousButton = page.locator("#mainBack");

        this.payButton = page.locator("#mainSubmit[value|='pay']");

        this.genericGiftCardButtonHPP = page.locator("input[value|='Generic GiftCard']");
    }

    async fillGiftCardDetails(cardHolderName, cardNumber, cardPin, partialPayment = false){
        await this.cardHoldernameInput.fill(cardHolderName);
        await this.cardNumberInput.fill(cardNumber);
        await this.cardPinUnput.fill(cardPin);

        if (partialPayment != false){
            this.partialPaymentCheckBox.click();
        }
    }

    async clickContinue(){
        await this.continueButton.click();
    }

    async clickPay(){
        await this.payButton.click();
    }

    async clickPrevious(){
        await this.previousButton.click();
    }
}
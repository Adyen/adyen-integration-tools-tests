import {PaymentDetailsPage} from "../pageObjects/plugin/PaymentDetails.page.js";

export async function selectGiftcardSection(page) {
    let paymentDetailPage = new PaymentDetailsPage(page);
    return await paymentDetailPage.selectGiftCard();
}

export async function redeemGiftcard(
    giftcardsSection,
    giftcardNumber,
    cvc,
    cardBrand
) {
    await giftcardsSection.fillGiftcardInfo(
        giftcardNumber,
        cvc,
        cardBrand
    );

    await giftcardsSection.redeemOrPay();
}

export async function paySingleGiftcard(giftcardsSection) {
    await giftcardsSection.redeemOrPay();
}

export async function removeSingleGiftcard(giftcardsSection) {
    await giftcardsSection.removeSingleGiftcard();
}

export async function removeGiftcardStateData(giftcardsSection) {
    await giftcardsSection.removeGiftcardStateData();
}

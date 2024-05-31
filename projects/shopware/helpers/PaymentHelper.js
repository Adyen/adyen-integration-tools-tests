import { PaymentDetailsPage } from "../pageObjects/plugin/PaymentDetails.page.js";

export async function makeCreditCardPayment(
    page,
    user,
    creditCardNumber,
    expDate,
    cvc,
    saveCard = false
) {
    const paymentDetailPage = new PaymentDetailsPage(page);
    const creditCardSection = await paymentDetailPage.selectCreditCard();
    await creditCardSection.fillCreditCardInfo(
        user.firstName,
        user.lastName,
        creditCardNumber,
        expDate,
        cvc
    );
    if (saveCard) {
        await page.locator("text=Save for my next payment").click();
    }
    await new PaymentDetailsPage(page).submitOrder();
}

export async function makeIDealPayment(page, issuerName) {
    const paymentDetailPage = new PaymentDetailsPage(page);
    const idealPaymentSection = await paymentDetailPage.selectIdeal();
    
    await idealPaymentSection.selectIdealIssuer(issuerName);
    await paymentDetailPage.scrollToCheckoutSummary();
    await paymentDetailPage.submitOrder();
  
    await page.waitForNavigation();
}


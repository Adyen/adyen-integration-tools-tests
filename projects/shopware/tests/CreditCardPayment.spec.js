import { test } from "@playwright/test";
import PaymentResources from "../../data/PaymentResources.js";
import {
    doPrePaymentChecks,
    goToShippingWithFullCart,
    proceedToPaymentAs,
    verifySuccessfulPayment
} from "../helpers/ScenarioHelper.js";
import { PaymentDetailsPage } from "../pageObjects/plugin/PaymentDetails.page.js";

const paymentResources = new PaymentResources();
const users = paymentResources.guestUser;

test.describe.parallel("Payment via credit card", () => {
    test.beforeEach(async ({ page }) => {
        await goToShippingWithFullCart(page);
        await proceedToPaymentAs(page, users.regular);
        await doPrePaymentChecks(page);
    });

    test("without 3Ds should succeed", async ({ page }) => {

        await makeCreditCardPayment(
            page,
            users.regular,
            paymentResources.masterCardWithout3D,
            paymentResources.expDate,
            paymentResources.cvc
        );

        await verifySuccessfulPayment(page);

    });

});

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
        await page.locator(".adyen-checkout__checkbox__input").click();
    }
    await new PaymentDetailsPage(page).submitOrder();
}

import { test } from "@playwright/test";
import { ThreeDSPaymentPage } from "../../common/redirect/ThreeDSPaymentPage.js";
import PaymentResources from "../../data/PaymentResources.js";
import {
    doPrePaymentChecks,
    goToShippingWithFullCart,
    proceedToPaymentAs,
    verifyFailedPayment,
    verifySuccessfulPayment
} from "../helpers/ScenarioHelper.js";
import { PaymentDetailsPage } from "../pageObjects/plugin/PaymentDetails.page.js";

const paymentResources = new PaymentResources();
const user = paymentResources.guestUser.belgian;
const bancontactCard = paymentResources.bcmc.be;

test.describe.parallel("Payment via credit card", () => {
    test.beforeEach(async ({ page }) => {
        await goToShippingWithFullCart(page);
        await proceedToPaymentAs(page, user);
        await doPrePaymentChecks(page);
        const paymentDetailPage = new PaymentDetailsPage(page);
        const bancontactCardSection = await paymentDetailPage.selectBancontactCard();
        
        await bancontactCardSection.fillCardNumber(bancontactCard.cardNumber);
        await bancontactCardSection.fillExpDate(bancontactCard.expDate);

        await paymentDetailPage.submitOrder();
    });

    test("with 3Ds1 should succeed", async ({ page }) => {

        await new ThreeDSPaymentPage(page).validate3DS(
            bancontactCard.user,
            bancontactCard.password
        );
        await verifySuccessfulPayment(page);
    });

    test("with wrong 3Ds1 credentials should fail", async ({ page }) => {

        await new ThreeDSPaymentPage(page).validate3DS(
            bancontactCard.wrongUser,
            bancontactCard.wrongPassword
        );

        await verifyFailedPayment(page);
    });
});

import { test } from "@playwright/test";
import PaymentResources from "../../data/PaymentResources.js";
import {
    doPrePaymentChecks,
    goToShippingWithFullCart,
    proceedToPaymentAs,
    verifyFailedPayment,
    verifySuccessfulPayment
} from "../helpers/ScenarioHelper.js";
import { PaymentDetailsPage } from "../pageObjects/plugin/PaymentDetails.page.js";
import { IdealIssuerPage } from "../../common/redirect/IdealIssuerPage.js";

const paymentResources = new PaymentResources();
const users = paymentResources.guestUser;

test.describe.parallel("Payment via iDeal", () => {
    test.beforeEach(async ({ page }) => {
        await goToShippingWithFullCart(page);
        await proceedToPaymentAs(page, users.dutch);
        await doPrePaymentChecks(page);
    });

    test("should succeed via Test Issuer", async ({ page }) => {
        await makeIDealPayment(page, "Test Issuer");
        await verifySuccessfulPayment(page, false);
    });

    test("should fail via Failing Test Issuer", async ({ page }) => {
        await makeIDealPayment(page, "Test Issuer Refused");
        await verifyFailedPayment(page, false);
    });

});


async function makeIDealPayment(page, issuerName) {
  const paymentDetailPage = new PaymentDetailsPage(page);
  const idealPaymentSection = await paymentDetailPage.selectIdeal();
  
  await idealPaymentSection.selectIdealIssuer(issuerName);
  await paymentDetailPage.scrollToCheckoutSummary();
  await paymentDetailPage.submitOrder();

  await page.waitForNavigation();
  await new IdealIssuerPage(page).continuePayment();
}
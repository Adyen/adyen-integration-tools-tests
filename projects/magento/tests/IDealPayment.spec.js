import { test } from "@playwright/test";
import PaymentResources from "../../data/PaymentResources.js";
import { PaymentDetailsPage } from "../pageObjects/checkout/PaymentDetails.page.js";
import {
  goToShippingWithFullCart,
  proceedToPaymentAs,
  verifyFailedPayment,
  verifySuccessfulPayment,
} from "../helpers/ScenarioHelper.js";

const paymentResources = new PaymentResources();
const users = paymentResources.guestUser;

test.describe.parallel("Payment with iDeal", () => {
  test.beforeEach(async ({ page }) => {
    await goToShippingWithFullCart(page);
  });

  test("should succeed via Test Issuer", async ({ page }) => {
    await proceedToPaymentAs(page, users.dutch);
    await makeIDealPayment(page, "Test Issuer");
    await verifySuccessfulPayment(page, false);
  });

  test("should fail via Failing Test Issuer", async ({ page }) => {
    await proceedToPaymentAs(page, users.dutch);
    await makeIDealPayment(page, "Test Issuer Refused");
    await verifyFailedPayment(page);
  });
});

async function makeIDealPayment(page, issuerName) {
  const paymentDetailPage = new PaymentDetailsPage(page);
  const idealPaymentSection = await paymentDetailPage.selectIDeal();
  await idealPaymentSection.selectIdealIssuer(issuerName);

  const issuerPage = await idealPaymentSection.placeOrder();
  await issuerPage.continuePayment();
}

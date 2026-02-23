import { test } from "@playwright/test";
import {
  goToShippingWithFullCart,
  placeOrder,
  proceedToPaymentAs,
  selectCurrency, verifyFailedPayment,
  verifySuccessfulPayment
} from "../helpers/ScenarioHelper.js";
import {PaymentDetailsPage} from "../pageObjects/plugin/PaymentDetails.page.js";
import PaymentResources from "../../data/PaymentResources.js";
import {PaymentSimulatorPage} from "../pageObjects/checkout/PaymentSimulatorPage.js";

const paymentResources = new PaymentResources();
const user = paymentResources.guestUser.norwegian;

test.describe("Payment via Vipps", () => {
  test.beforeEach(async ({ page }) => {
    if (user.currency) {
      await selectCurrency(page, user.currency);
    }
    await goToShippingWithFullCart(page);
    await proceedToPaymentAs(page, user);
    await page.waitForLoadState()
    await new PaymentDetailsPage(page).selectVipps();
    await page.waitForLoadState()
    await placeOrder(page);
  });

  test("should succeed with authorize simulation", async ({ page }) => {
    await new PaymentSimulatorPage(page).authorizePayment();
    await page.waitForLoadState()

    await verifySuccessfulPayment(page);
  });

  test("should fail with refusal simulation", async ({ page }) => {
    await new PaymentSimulatorPage(page).refusePayment();
    await page.waitForLoadState()

    await verifyFailedPayment(page)
  });

  test("should fail with cancellation simulation", async ({ page }) => {
    await new PaymentSimulatorPage(page).refusePayment();
    await page.waitForLoadState()

    await verifyFailedPayment(page)
  });
})
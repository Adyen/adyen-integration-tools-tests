import { test, expect } from "@playwright/test";
import PaymentResources from "../../data/PaymentResources.js";
import {
  goToShippingWithFullCart,
  verifySuccessfulPayment,
} from "../helpers/ScenarioHelper.js";
import { proceedToPaymentAs } from "../helpers/ScenarioHelper.js";
import { PaymentDetailsPage } from "../pageObjects/plugin/PaymentDetails.page.js";
import { PayPalComponentsMagentoPage } from "../pageObjects/checkout/PayPalComponentsMagento.page.js";

const paymentResources = new PaymentResources();
const users = paymentResources.guestUser;

test.describe("Payment via PayPal", () => {
  test.use({ storageState: undefined });

  test("should succeed", async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await goToShippingWithFullCart(page);
    await proceedToPaymentAs(page, users.dutch);

    await new PayPalComponentsMagentoPage(page).payViaPayPal(
      paymentResources.payPalUserName,
      paymentResources.payPalPassword
    );

    await verifySuccessfulPayment(page);
    await context.close();
  });

  test("should fail if shopper cancels", async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await goToShippingWithFullCart(page);
    await proceedToPaymentAs(page, users.dutch);

    await new PayPalComponentsMagentoPage(page).cancelPayPal(page);

    const paymentDetailPage = new PaymentDetailsPage(page);
    await page.waitForLoadState("domcontentloaded", { timeout: 15000 });
    await expect(paymentDetailPage.errorMessage).toBeVisible({ timeout: 15000 });
    await context.close();
  });
});

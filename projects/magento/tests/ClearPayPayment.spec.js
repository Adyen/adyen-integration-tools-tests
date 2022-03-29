import { test } from "@playwright/test";
import PaymentResources from "../../data/PaymentResources.js";
import {
  goToShippingWithFullCart,
  verifySuccessfulPayment,
} from "../helpers/ScenarioHelper.js";
import { proceedToPaymentAs } from "../helpers/ScenarioHelper.js";
import { PaymentDetailsPage } from "../pageObjects/checkout/PaymentDetails.page.js";
import { ClearPayPaymentPage } from "../../common/ClearPayPaymentPage.js";

const paymentResources = new PaymentResources();
const user = paymentResources.guestUser.clearPay.approved.it;

test.describe("Payment via Oney", () => {
  test.beforeEach(async ({ page }) => {
    await goToShippingWithFullCart(page);
  });

  test.skip("should succeed", async ({ page }) => {
    await proceedToPaymentAs(page, user);
    await payViaClearPay(page);
    await verifySuccessfulPayment(page, false);
  });

  async function payViaClearPay(page) {
    const paymentDetailPage = new PaymentDetailsPage(page);
    const clearPayPaymentSection = await paymentDetailPage.selectClearPay();
    await clearPayPaymentSection.placeOrder();
    await new ClearPayPaymentPage(page).continueClearPayPayment();
  }
});

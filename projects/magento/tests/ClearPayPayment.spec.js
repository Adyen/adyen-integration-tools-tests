import { test } from "@playwright/test";
import PaymentResources from "../../data/PaymentResources.js";
import {
  goToShippingWithFullCart,
  placeOrder,
  verifySuccessfulPayment,
} from "../helpers/ScenarioHelper.js";
import { proceedToPaymentAs } from "../helpers/ScenarioHelper.js";
import { PaymentDetailsPage } from "../pageObjects/plugin/PaymentDetails.page.js";
import { ClearPayPaymentPage } from "../../common/redirect/ClearPayPaymentPage.js";

const paymentResources = new PaymentResources();
const user = paymentResources.guestUser.clearPay.approved.it;

test.describe("Payment via ClearPay", () => {
  test.beforeEach(async ({ page }) => {
    await goToShippingWithFullCart(page);
  });

  test.skip("should succeed", async ({ page }) => {
    await proceedToPaymentAs(page, user);
    await payViaClearPay(page);
    await verifySuccessfulPayment(page, true);
  });

  async function payViaClearPay(page) {
    await new PaymentDetailsPage(page).selectClearPay();
    await placeOrder(page);
    await new ClearPayPaymentPage(page).continueClearPayPayment();
  }
});

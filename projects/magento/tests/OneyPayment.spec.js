import { test } from "@playwright/test";
import PaymentResources from "../../data/PaymentResources.js";
import {
  goToShippingWithFullCart,
  placeOrder,
  verifySuccessfulPayment,
} from "../helpers/ScenarioHelper.js";
import { proceedToPaymentAs } from "../helpers/ScenarioHelper.js";
import { PaymentDetailsPage } from "../pageObjects/plugin/PaymentDetails.page.js";
import { OneyPaymentPage } from "../../common/redirect/OneyPaymentPage.js";

const paymentResources = new PaymentResources();
const user = paymentResources.guestUser.oney.approved.fr;

// Skipping due to broken sandbox
test.describe("Payment via Oney", () => {
  test.beforeEach(async ({ page }) => {
    await goToShippingWithFullCart(page, 5);
  });

  test("should succeed", async ({ page }) => {
    await proceedToPaymentAs(page, user);
    await payViaOney(page);
  });

  async function payViaOney(page) {
    const paymentDetailPage = new PaymentDetailsPage(page);
    const oneyPaymentSection = await paymentDetailPage.selectOney();

    await oneyPaymentSection.completeOneyForm(user.dateOfBirth);
    await placeOrder(page);
    await new OneyPaymentPage(page).continueOneyPayment();
  }
});

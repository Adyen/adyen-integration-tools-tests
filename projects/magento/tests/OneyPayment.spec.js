import { test } from "@playwright/test";
import PaymentResources from "../../data/PaymentResources.js";
import {
  goToShippingWithFullCart,
  verifySuccessfulPayment,
} from "../helpers/ScenarioHelper.js";
import { proceedToPaymentAs } from "../helpers/ScenarioHelper.js";
import { PaymentDetailsPage } from "../pageObjects/checkout/PaymentDetails.page.js";
import { OneyPaymentPage } from "../../common/OneyPaymentPage.js";

const paymentResources = new PaymentResources();
const user = paymentResources.guestUser.oney.approved.fr;

test.describe("Payment via Oney", () => {
  test.beforeEach(async ({ page }) => {
    await goToShippingWithFullCart(page, 4);
  });

  test("should succeed", async ({ page }) => {
    await proceedToPaymentAs(page, user);
    await payViaOney(page);
    await verifySuccessfulPayment(page, false);
  });

  async function payViaOney(page) {
    const paymentDetailPage = new PaymentDetailsPage(page);
    const oneyPaymentSection = await paymentDetailPage.selectOney();

    await oneyPaymentSection.completeOneyForm(user.dateOfBirth);
    await oneyPaymentSection.placeOrder();
    await new OneyPaymentPage(page).continueOneyPayment();
  }
});

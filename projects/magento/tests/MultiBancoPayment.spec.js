import { test } from "@playwright/test";
import PaymentResources from "../../data/PaymentResources.js";
import {
  goToShippingWithFullCart,
  proceedToPaymentAs,
  verifySuccessfulPayment,
  verifyVoucherCouponGeneration,
} from "../helpers/ScenarioHelper.js";
import { PaymentDetailsPage } from "../pageObjects/plugin/PaymentDetails.page.js";

const paymentResources = new PaymentResources();
const user = paymentResources.guestUser.portuguese;

test.describe("Payment via MultiBanco", () => {
  test.beforeEach(async ({ page }) => {
    await goToShippingWithFullCart(page);
    await proceedToPaymentAs(page, user);
  });

  test("should succeed", async ({ page }) => {
    const paymentDetailPage = new PaymentDetailsPage(page);
    const multiBancoSection = await paymentDetailPage.selectMultiBanco();
    await multiBancoSection.placeOrder();

    await verifySuccessfulPayment(page);
    await verifyVoucherCouponGeneration(page);
  });
});

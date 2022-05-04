import { test } from "@playwright/test";
import PaymentResources from "../../data/PaymentResources.js";
import {
  goToShippingWithFullCart,
  proceedToPaymentAs,
  verifySuccessfulPayment,
  verifyVoucherCouponGeneration,
} from "../helpers/ScenarioHelper.js";
import { PaymentDetailsPage } from "../pageObjects/checkout/PaymentDetails.page.js";

const paymentResources = new PaymentResources();
const user = paymentResources.guestUser.boleto;

test.describe("Payment via Boleto", () => {
  test.beforeEach(async ({ page }) => {
    await goToShippingWithFullCart(page);
    await proceedToPaymentAs(page, user);
  });

  // Skipping this due to Merchant config issue with BRL
  test.skip("should succeed", async ({ page }) => {
    const paymentDetailPage = new PaymentDetailsPage(page);
    const boletoSection = await paymentDetailPage.selectBoleto();

    await boletoSection.fillBoletoDetails(
      user.socialSecurityNumber,
      user.firstName,
      user.lastName
    );
    await boletoSection.placeOrder();
    await verifySuccessfulPayment(page);
    await verifyVoucherCouponGeneration(page);
  });
});

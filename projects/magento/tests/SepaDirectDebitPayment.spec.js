import { test } from "@playwright/test";
import PaymentResources from "../../data/PaymentResources.js";
import {
  goToShippingWithFullCart,
  placeOrder,
  proceedToPaymentAs,
  verifySuccessfulPayment,
} from "../helpers/ScenarioHelper.js";
import { PaymentDetailsPage } from "../pageObjects/plugin/PaymentDetails.page.js";

const paymentResources = new PaymentResources();
const user = paymentResources.guestUser.dutch;
const ibanDetails = paymentResources.sepaDirectDebit.nl;

test.describe("Payment via SEPA Direct debit", () => {
  test.beforeEach(async ({ page }) => {
    await goToShippingWithFullCart(page);
    await proceedToPaymentAs(page, user);
  });

  test("should succeed", async ({ page }) => {
    const paymentDetailPage = new PaymentDetailsPage(page);
    const sepaPaymentSection = await paymentDetailPage.selectSepaDirectDebit();

    await sepaPaymentSection.fillSepaDirectDebitInfo(
      ibanDetails.accountName,
      ibanDetails.iban
    );
    await placeOrder(page);

    await verifySuccessfulPayment(page);
  });
});

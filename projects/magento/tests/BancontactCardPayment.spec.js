import { test } from "@playwright/test";
import { ThreeDSPaymentPage } from "../../common/redirect/ThreeDSPaymentPage.js";
import PaymentResources from "../../data/PaymentResources.js";
import {
  goToShippingWithFullCart,
  placeOrder,
  proceedToPaymentAs,
  verifyFailedPayment,
  verifySuccessfulPayment,
} from "../helpers/ScenarioHelper.js";
import { makeCreditCardPayment } from "../helpers/PaymentHelper.js";

const paymentResources = new PaymentResources();
const bancontactCard = paymentResources.bcmc.be;
const user = paymentResources.guestUser.belgian;

test.describe.parallel("Payment via Bancontact Card", () => {
  test.beforeEach(async ({ page }) => {
    await goToShippingWithFullCart(page);
    await proceedToPaymentAs(page, user);

    await makeCreditCardPayment(
      page,
      user,
      bancontactCard.cardNumber,
      bancontactCard.expDate
    );
  });

  test("should succeed with correct 3DS credentials", async ({ page }) => {
    await new ThreeDSPaymentPage(page).validate3DS(
      bancontactCard.user,
      bancontactCard.password
    );

    await verifySuccessfulPayment(page);
  });

  test("should fail with wrong 3DS credentials", async ({ page }) => {
    await new ThreeDSPaymentPage(page).validate3DS(
      bancontactCard.wrongUser,
      bancontactCard.wrongPassword
    );

    await verifyFailedPayment(page);
  });
});

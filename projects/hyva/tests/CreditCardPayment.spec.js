import { test } from "@playwright/test";
import PaymentResources from "../../data/PaymentResources.js";
import { makeCreditCardPayment } from "../helpers/PaymentHelper.js";
import { ThreeDSPaymentPage } from "../../common/redirect/ThreeDSPaymentPage.js";
import { ThreeDS2PaymentPage } from "../../common/redirect/ThreeDS2PaymentPage.js";
import { CreditCardComponentsMagento } from "../pageObjects/checkout/CreditCardComponentsMagento.js";
import {
  goToShippingWithFullCart,
  proceedToPaymentAs,
  verifyFailedPayment,
  verifySuccessfulPayment,
} from "../helpers/ScenarioHelper.js";

const paymentResources = new PaymentResources();
const users= paymentResources.guestUser;

test.describe.parallel("Payment via credit card", () => {
  test.beforeEach(async ({ page }) => {
    await goToShippingWithFullCart(page);
    await proceedToPaymentAs(page, users.regular);
  });

  test("without 3Ds should succeed", async ({ page }) => {

    await makeCreditCardPayment(
      page,
      users.regular,
      paymentResources.masterCardWithout3D,
      paymentResources.expDate,
      paymentResources.cvc
    );

    await verifySuccessfulPayment(page);
  });
});

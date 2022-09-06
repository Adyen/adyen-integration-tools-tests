import { test } from "@playwright/test";
import PaymentResources from "../../data/PaymentResources.js";
import { makeCreditCardPayment } from "../helpers/PaymentHelper.js";
import { ThreeDSPaymentPage } from "../../common/ThreeDSPaymentPage.js";
import { ThreeDS2PaymentPage } from "../../common/ThreeDS2PaymentPage.js";
import { CreditCardComponents } from "../pageObjects/checkout/CreditCardComponents.js";
import {
  goToShippingWithFullCart,
  proceedToPaymentAs,
  verifyFailedPayment,
  verifySuccessfulPayment,
} from "../helpers/ScenarioHelper.js";

const paymentResources = new PaymentResources();
const users = paymentResources.guestUser;

test.describe.parallel("Payment via credit card", () => {
  test.beforeEach(async ({ page }) => {
    await goToShippingWithFullCart(page);
  });

  test("without 3Ds should succeed", async ({ page }) => {
    await proceedToPaymentAs(page, users.regular);

    await makeCreditCardPayment(
      page,
      users.regular,
      paymentResources.masterCardWithout3D,
      paymentResources.expDate,
      paymentResources.cvc
    );

    await verifySuccessfulPayment(page);
  });

  test("with 3Ds1 should succeed", async ({ page }) => {
    await proceedToPaymentAs(page, users.regular);

    await makeCreditCardPayment(
      page,
      users.regular,
      paymentResources.visa3DS1,
      paymentResources.expDate,
      paymentResources.cvc
    );

    await new ThreeDSPaymentPage(page).validate3DS(
      paymentResources.threeDSCorrectUser,
      paymentResources.threeDSCorrectPassword
    );
    await verifySuccessfulPayment(page);
  });

  test("with wrong 3Ds1 credentials should fail", async ({ page }) => {
    await proceedToPaymentAs(page, users.regular);

    await makeCreditCardPayment(
      page,
      users.regular,
      paymentResources.visa3DS1,
      paymentResources.expDate,
      paymentResources.cvc
    );

    await new ThreeDSPaymentPage(page).validate3DS(
      paymentResources.threeDSCorrectUser,
      paymentResources.threeDSWrongPassword
    );

    await verifyFailedPayment(page);
  });

  test("with 3Ds2 should succeed", async ({ page }) => {
    await proceedToPaymentAs(page, users.regular);

    await makeCreditCardPayment(
      page,
      users.regular,
      paymentResources.masterCard3DS2,
      paymentResources.expDate,
      paymentResources.cvc
    );

    await new ThreeDS2PaymentPage(page).validate3DS2(
      paymentResources.threeDSCorrectPassword
    );

    await verifySuccessfulPayment(page);
  });

  test("with wrong 3Ds2 credentials should fail", async ({ page }) => {
    await proceedToPaymentAs(page, users.regular);

    await makeCreditCardPayment(
      page,
      users.regular,
      paymentResources.masterCard3DS2,
      paymentResources.expDate,
      paymentResources.cvc
    );

    await new ThreeDS2PaymentPage(page).validate3DS2(
      paymentResources.threeDSWrongPassword
    );

    await new CreditCardComponents(page).verifyPaymentRefusal();
  });

  test("with 3Ds2 should abort the payment with correct message when cancelled", async ({ page }) => {
    await proceedToPaymentAs(page, users.regular);

    await makeCreditCardPayment(
      page,
      users.regular,
      paymentResources.masterCard3DS2,
      paymentResources.expDate,
      paymentResources.cvc
    );

    await new ThreeDS2PaymentPage(page).clickCancel();

    await new CreditCardComponents(page).verifyPaymentRefusal();
  });
});

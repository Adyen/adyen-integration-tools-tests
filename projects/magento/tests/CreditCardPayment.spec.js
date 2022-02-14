import { test, expect } from "@playwright/test";
import PaymentResources from "../../common/PaymentResources.js";
import { PaymentDetailsPage } from "../pageObjects/checkout/PaymentDetails.page.js";
import { ThreeDSPaymentPage } from "../../common/ThreeDSPaymentPage.js";
import { ThreeDS2PaymentPage } from "../../common/ThreeDS2PaymentPage.js";
import { ShoppingCartPage } from "../pageObjects/plugin/ShoppingCart.page.js";
import { CreditCardComponents } from "../pageObjects/checkout/CreditCardComponents.js";
import { SuccessfulCheckoutPage } from "../pageObjects/checkout/SuccessfulCheckout.page.js";
import {
  goToShippingWithFullCart,
  proceedToPaymentAs,
} from "../helpers/ScenarioHelper.js";

const paymentResources = new PaymentResources();
const users = paymentResources.guestUser;

test.describe.parallel("Payment with", () => {
  test.beforeEach(async ({ page }) => {
    await goToShippingWithFullCart(page);
  });

  test("credit card without 3Ds should succeed", async ({ page }) => {
    proceedToPaymentAs(page, users.regular);

    await makeCreditCardPayment(
      page,
      users.regular,
      paymentResources.masterCardWithout3D,
      paymentResources.expDate,
      paymentResources.cvc
    );

    await verifySuccessfulCheckout(page);
  });

  test("credit card with 3Ds1 should succeed", async ({ page }) => {
    proceedToPaymentAs(page, users.regular);

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
    await verifySuccessfulCheckout(page);
  });

  test("credit card with wrong 3Ds1 credentials should fail", async ({
    page,
  }) => {
    proceedToPaymentAs(page, users.regular);

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

    await new ShoppingCartPage(page).verifyPaymentFailure();
  });

  test("credit card with 3Ds2 should succeed", async ({ page }) => {
    proceedToPaymentAs(page, users.regular);

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

    await verifySuccessfulCheckout(page);
  });

  test("credit card with wrong 3Ds2 credentials should fail", async ({
    page,
  }) => {
    proceedToPaymentAs(page, users.regular);

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
});

async function makeCreditCardPayment(
  page,
  user,
  creditCardNumber,
  expDate,
  cvc
) {
  const paymentDetailPage = new PaymentDetailsPage(page);
  const creditCardSection = await paymentDetailPage.selectCreditCard();
  await creditCardSection.fillCreditCardInfoAndPlaceOrder(
    user.firstName,
    user.lastName,
    creditCardNumber,
    expDate,
    cvc
  );
}

async function verifySuccessfulCheckout(page) {
  const successfulCheckoutPage = new SuccessfulCheckoutPage(page);
  await successfulCheckoutPage.waitForRedirection();
  await expect(await successfulCheckoutPage.pageTitle.innerText()).toEqual(
    "Thank you for your purchase!"
  );
}

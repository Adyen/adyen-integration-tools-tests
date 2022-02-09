import { test, expect } from "@playwright/test";
import PaymentResources from "../../common/PaymentResources.js";
import { ProductDetailsPage } from "../pages/plugin/ProductDetail.page.js";
import { ShippingDetails } from "../pages/checkout/ShippingDetails.page.js";
import { PaymentDetails } from "../pages/checkout/PaymentDetails.page.js";
import { SuccessfulCheckoutPage } from "../pages/checkout/SuccessfulCheckout.page.js";
import { ThreeDSPaymentPage } from "../../common/ThreeDSPaymentPage.js";
import { ThreeDS2PaymentPage } from "../../common/ThreeDS2PaymentPage.js";

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
    proceedToPaymentAs(page, users.dutch);

    await makeCreditCardPayment(
      page,
      users.dutch,
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
});

async function goToShippingWithFullCart(page, multiItems = false) {
  const productDetailsPage = new ProductDetailsPage(page);
  await productDetailsPage.addItemToCart("joust-duffle-bag.html");

  await expect(await productDetailsPage.currentCartItemCount).toEqual("1");

  if (multiItems != false) {
    await productDetailsPage.addItemWithOptionsToCart(
      "breathe-easy-tank.html",
      "M",
      2
    );
    await expect(await productDetailsPage.currentCartItemCount).toEqual("3");
  }
}

async function proceedToPaymentAs(page, user) {
  const shippingDetailsPage = new ShippingDetails(page);
  await shippingDetailsPage.goTo();
  await shippingDetailsPage.fillShippingDetailsAndProceedToPayment(user);
}

async function makeCreditCardPayment(
  page,
  user,
  creditCardNumber,
  expDate,
  cvc
) {
  const paymentDetailPage = new PaymentDetails(page);
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
  await successfulCheckoutPage.waitforNavigaton();
  await expect(await successfulCheckoutPage.pageTitle.innerText()).toEqual(
    "Thank you for your purchase!"
  );
}

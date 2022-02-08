import { test, expect } from "@playwright/test";
import PaymentResources from "../../common/PaymentResources.js";
import { ProductDetailsPage } from "../pages/plugin/ProductDetail.page.js";
import { ShippingDetails } from "../pages/checkout/ShippingDetails.page.js";
import { PaymentDetails } from "../pages/checkout/PaymentDetails.page.js";
import { SuccessfulCheckoutPage } from "../pages/checkout/SuccessfulCheckout.page.js";

const paymentResources = new PaymentResources();
const users = paymentResources.guestUser;

test.beforeEach(async ({ page }) => {
  await goToShippingWithSingleItem(page);
});

test("basic test", async ({ page }) => {
  const shippingDetailsPage = new ShippingDetails(page);
  await shippingDetailsPage.goTo();
  await shippingDetailsPage.fillShippingDetailsAndProceedToPayment(
    users.regular
  );

  const paymentDetailPage = new PaymentDetails(page);
  const creditCardSection = await paymentDetailPage.selectCreditCard();
  await creditCardSection.fillCreditCardInfoAndPlaceOrder(
    users.regular.firstName,
    users.regular.lastName,
    paymentResources.masterCardWithout3D,
    paymentResources.expDate,
    paymentResources.cvc
  );

  await verifySuccessfulCheckout(page);
});

async function goToShippingWithSingleItem(page) {
  const productDetailsPage = new ProductDetailsPage(page);
  await productDetailsPage.addItemToCart("joust-duffle-bag.html");

  await expect(await productDetailsPage.currentCartItemCount).toEqual("1");
}

async function goToShippingWithMultipleItems(page) {
  const productDetailsPage = new ProductDetailsPage(page);
  await productDetailsPage.addItemToCart("joust-duffle-bag.html");
  await productDetailsPage.addItemWithOptionsToCart(
    "breathe-easy-tank.html",
    "M",
    2
  );
  await expect(await productDetailsPage.currentCartItemCount).toEqual("3");
}

async function verifySuccessfulCheckout(page) {
  const successfulCheckoutPage = new SuccessfulCheckoutPage(page);
  await successfulCheckoutPage.waitforNavigaton();
  await expect(await successfulCheckoutPage.pageTitle.innerText()).toEqual(
    "Thank you for your purchase!"
  );
}

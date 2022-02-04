import { test, expect } from "@playwright/test";
import PaymentResources from "../../common/PaymentResources.js";
import { ProductDetailsPage } from "../pages/plugin/ProductDetail.page.js";
import { ShippingDetails } from "../pages/checkout/ShippingDetails.page.js";
import { PaymentDetails } from "../pages/checkout/PaymentDetails.page.js";
import { SuccessfulCheckoutPage } from "../pages/checkout/SuccessfulCheckout.page.js";

test("basic test", async ({ page }) => {
  const paymentResources = new PaymentResources();
  const user = paymentResources.guestUser.regular;

  const productDetailsPage = new ProductDetailsPage(page);
  await productDetailsPage.addItemToCart("joust-duffle-bag.html");
  await productDetailsPage.addItemWithOptionsToCart(
    "breathe-easy-tank.html",
    "M",
    2
  );
  await expect(await productDetailsPage.currentCartItemCount).toEqual("3");

  const shippingDetailsPage = new ShippingDetails(page);
  await shippingDetailsPage.goTo();
  await shippingDetailsPage.fillShippingDetailsAndProceedToPayment(
    paymentResources.guestUser.regular
  );

  const paymentDetailPage = new PaymentDetails(page);
  await (
    await paymentDetailPage.selectCreditCard()
  ).fillCreditCardInfoAndPlaceOrder(
    user.firstName,
    user.lastName,
    paymentResources.masterCardWithout3D,
    paymentResources.expDate,
    paymentResources.cvc
  );

  const successfulCheckoutPage = new SuccessfulCheckoutPage(page);
  await successfulCheckoutPage.waitforNavigaton();
  await expect(await successfulCheckoutPage.pageTitle.innerText()).toEqual(
    "Thank you for your purchase!"
  );
});

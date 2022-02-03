import { test, expect } from "@playwright/test";
import PaymentResources from "../../common/PaymentResources.js";
import { ProductDetailsPage } from "../pages/plugin/ProductDetail.page.js";
import { ShippingDetails } from "../pages/checkout/ShippingDetails.page.js";
import { PaymentDetails } from "../pages/checkout/PaymentDetails.page.js";

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

  // tamam

  await page.click("#adyen_cc");

  await page.click(".adyen-checkout__card__holderName input");
  await page.fill(".adyen-checkout__card__holderName input", "JohnDoe");
  const ccNumber = await page
    .frameLocator(".adyen-checkout__card__cardNumber__input iframe")
    .locator("#encryptedCardNumber");
  await ccNumber.fill("2222 4000 7000 0005");
  const expDate = await page
    .frameLocator(".adyen-checkout__card__exp-date__input iframe")
    .locator("#encryptedExpiryDate");
  await expDate.fill("0330");

  // tamam

  await paymentDetailPage.fillCreditCardInfoAndPlaceOrder(
    user.firstName,
    user.lastName,
    paymentResources.masterCardWithout3D,
    paymentResources.expDate,
    paymentResources.cvc
  );
});

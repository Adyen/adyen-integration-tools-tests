import { test, expect } from "@playwright/test";
import PaymentResources from "../../common/PaymentResources.js";
import { goToShippingWithFullCart } from "../helpers/ScenarioHelper.js";
import { proceedToPaymentAs } from "../helpers/ScenarioHelper.js";
import { PaymentDetailsPage } from "../pageObjects/checkout/PaymentDetails.page.js";
import { SuccessfulCheckoutPage } from "../pageObjects/checkout/SuccessfulCheckout.page.js";

const paymentResources = new PaymentResources();
const users = paymentResources.guestUser;

test.describe("Payment via PayPal", () => {
  test.beforeEach(async ({ page }) => {
    await goToShippingWithFullCart(page);
  });
  test("should succeed", async ({ page }) => {
    await proceedToPaymentAs(page, users.dutch);

    await makePayPalPayment(
      page,
      paymentResources.payPalUserName,
      paymentResources.payPalPassword
    );

    await verifySuccessfulCheckout(page);
  });

  async function makePayPalPayment(page, username, password) {
    const paymentDetailPage = new PaymentDetailsPage(page);
    const payPalSection = await paymentDetailPage.selectPayPal();

    const [popup] = await Promise.all([
      page.waitForEvent("popup"),
      payPalSection.proceedToPayPal(),
    ]);

    await popup.waitForNavigation({ url: /.*sandbox.paypal.com*/ });
    await popup.locator("#email").fill("sb-absw44928195@personal.example.com");
    await popup.locator("#password").fill("t-2LqbUX");
    await popup.locator("#btnLogin").click();
    await popup.locator("#payment-submit-btn").click();
    // const payPalExternalPage = new PayPalPaymentPage(page);
    // await payPalExternalPage.makeFullPayment(page, username, password);
  }

  async function verifySuccessfulCheckout(page) {
    const successfulCheckoutPage = new SuccessfulCheckoutPage(page);
    await successfulCheckoutPage.waitForRedirection();
    await expect(await successfulCheckoutPage.pageTitle.innerText()).toEqual(
      "Thank you for your purchase!"
    );
  }
});

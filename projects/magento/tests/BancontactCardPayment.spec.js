import { test } from "@playwright/test";
import PaymentResources from "../../data/PaymentResources.js";
import {
  goToShippingWithFullCart,
  placeOrder,
  proceedToPaymentAs,
  verifyPaymentRefusal,
  verifySuccessfulPayment,
} from "../helpers/ScenarioHelper.js";
import { PaymentDetailsPage } from "../pageObjects/plugin/PaymentDetails.page.js";
import { ThreeDS2PaymentPage } from "../../common/redirect/ThreeDS2PaymentPage.js";
import { BancontactCardComponentsMagento } from "../pageObjects/checkout/BancontactCardComponentsMagento.js";

const paymentResources = new PaymentResources();
const bancontactCard = paymentResources.bcmc.be;
const user = paymentResources.guestUser.belgian;

test.describe.parallel("Payment via Bancontact Card", () => {
  test.beforeEach(async ({ page }) => {
    await goToShippingWithFullCart(page);
    await proceedToPaymentAs(page, user);
    const bancontactCardSection = await new PaymentDetailsPage(page)
    .selectBancontactCard();
    await bancontactCardSection.fillBancontacCardInfo(
      bancontactCard.cardNumber,
      bancontactCard.expDate,
      user.firstName,
      user.lastName
    );
    await placeOrder(page);
    await page.waitForLoadState("load", { timeout: 15000 });
  });

  test("should succeed with correct 3DS credentials", async ({ page }) => {
    const threeDS2Page = new ThreeDS2PaymentPage(page);
  
    try {
      // Attempt to validate with the correct 3DS credentials
      await threeDS2Page.validate3DS2(paymentResources.threeDSCorrectPassword);
    } catch (error) {
      console.error("Error: ", error);
    }
  
    // Verify successful payment after trying to validate
    await verifySuccessfulPayment(page);
  });

  test("should fail with wrong 3DS credentials", async ({ page }) => {
    const threeDS2Page = new ThreeDS2PaymentPage(page);
  
    try {
      // Attempt to validate with the wrong 3DS credentials
      await threeDS2Page.validate3DS2(paymentResources.threeDSWrongPassword);
      await threeDS2Page.threeDS2SubmitButton.waitFor({state:"hidden", timeout:10000})
    } catch (error) {
      console.error("Error: ", error);
    }
  
    // Verify payment refusal regardless of the above outcome
    await verifyPaymentRefusal(page);
  });
  
});

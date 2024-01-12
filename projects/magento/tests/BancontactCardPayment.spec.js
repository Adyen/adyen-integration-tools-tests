import { test } from "@playwright/test";
import {ThreeDS2PaymentPage} from "../../common/redirect/ThreeDS2PaymentPage.js";
import PaymentResources from "../../data/PaymentResources.js";
import {
  goToShippingWithFullCart,
  placeOrder,
  proceedToPaymentAs,
  verifyGenericPaymentRefusal,
  verifySuccessfulPayment,
} from "../helpers/ScenarioHelper.js";
import { PaymentDetailsPage } from "../pageObjects/plugin/PaymentDetails.page.js";

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
  });

  test("should succeed with correct 3DS credentials", async ({ page }) => {
    await new ThreeDS2PaymentPage(page).validate3DS2(
      bancontactCard.password
  );

    await verifySuccessfulPayment(page);
  });

  test("should fail with wrong 3DS credentials", async ({ page }) => {
    await new ThreeDS2PaymentPage(page).validate3DS2(
      bancontactCard.wrongPassword
  );

  await verifyGenericPaymentRefusal(page);
  });
});

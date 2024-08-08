import { test } from "@playwright/test";
import PaymentResources from "../../data/PaymentResources.js";
import {
  goToShippingWithFullCart, placeOrder,
  proceedToPaymentAs,
  verifySuccessfulPayment,
} from "../helpers/ScenarioHelper.js";

import {ThreeDS2PaymentPage} from "../../common/redirect/ThreeDS2PaymentPage.js";
import {BancontactCardComponentsMagento} from "../pageObjects/checkout/BancontactCardComponentsMagento.js";
import {PaymentDetailsPage} from "../pageObjects/plugin/PaymentDetails.page.js";

const paymentResources = new PaymentResources();
const bancontactCard = paymentResources.bcmc.be;
const user = paymentResources.guestUser.belgian;

test.describe.parallel("Payment via Bancontact Card", () => {
  test.beforeEach(async ({ page }) => {
    await goToShippingWithFullCart(page);
    await proceedToPaymentAs(page, user);
    await new PaymentDetailsPage(page).selectBancontactCard();

    const bancontactCardComponents = new BancontactCardComponentsMagento(page);
    await bancontactCardComponents.fillBancontacCardInfo(
        bancontactCard.cardNumber,
        bancontactCard.expDate
    );

    await placeOrder(page);
  });

  test("should succeed with correct 3DS credentials", async ({ page }) => {
    await new ThreeDS2PaymentPage(page).validate3DS2(
        paymentResources.threeDSCorrectPassword
    );

    await verifySuccessfulPayment(page);
  });

  test("should fail with wrong 3DS credentials", async ({ page }) => {
    await new ThreeDS2PaymentPage(page).validate3DS2(
        paymentResources.threeDSWrongPassword
    );

    await new BancontactCardComponentsMagento(page).verifyPaymentRefusal();
  });
});

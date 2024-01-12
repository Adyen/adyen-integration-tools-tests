import { test } from "@playwright/test";
import PaymentResources from "../../data/PaymentResources.js";
import {
  goToShippingWithFullCart,
  proceedToPaymentAs,
  verifySuccessfulPayment,
} from "../helpers/ScenarioHelper.js";
import { makeCreditCardPayment } from "../helpers/PaymentHelper.js";
import {ThreeDS2PaymentPage} from "../../common/redirect/ThreeDS2PaymentPage.js";
import {CreditCardComponentsMagento} from "../pageObjects/checkout/CreditCardComponentsMagento.js";

const paymentResources = new PaymentResources();
const bancontactCard = paymentResources.bcmc.be;
const user = paymentResources.guestUser.belgian;

test.describe.parallel("Payment via Bancontact Card", () => {
  test.beforeEach(async ({ page }) => {
    await goToShippingWithFullCart(page);
    await proceedToPaymentAs(page, user);

    await makeCreditCardPayment(
      page,
      user,
      bancontactCard.cardNumber,
      bancontactCard.expDate
    );
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

    await new CreditCardComponentsMagento(page).verifyPaymentRefusal();
  });
});

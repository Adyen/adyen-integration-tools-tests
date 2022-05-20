import { test } from "@playwright/test";
import PaymentResources from "../../data/PaymentResources.js";
import { ThreeDS2PaymentPage } from "../../common/ThreeDS2PaymentPage.js";
import {
  goToShippingWithFullCart,
  proceedToPaymentAs,
} from "../helpers/ScenarioHelper.js";
import { makeCreditCardPayment } from "../helpers/PaymentHelper.js";
import { AdyenGivingComponents } from "../pageObjects/checkout/AdyenGivingComponents.js";

const paymentResources = new PaymentResources();
const users = paymentResources.guestUser;

test.describe.parallel("Adyen Giving payments", () => {
  test.beforeEach(async ({ page }) => {
    await goToShippingWithFullCart(page);
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
  });

  test("should succeed with a 3Ds2 credit card", async ({ page }) => {
    const donationSection = new AdyenGivingComponents(page);
    await donationSection.makeDonation("least");
    await donationSection.verifySuccessfulDonationMessage();
  });

  test("should redirect to landing page when declined", async ({ page }) => {
    const donationSection = new AdyenGivingComponents(page);
    await donationSection.declineDonation();
    await donationSection.verifyDeclineRedirection();
  });
});

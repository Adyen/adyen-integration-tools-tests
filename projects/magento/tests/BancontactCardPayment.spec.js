import { test } from "@playwright/test";
import { ThreeDSPaymentPage } from "../../common/ThreeDSPaymentPage.js";
import PaymentResources from "../../data/PaymentResources.js";
import {
  goToShippingWithFullCart,
  proceedToPaymentAs,
  verifyFailedPayment,
  verifySuccessfulPayment,
} from "../helpers/ScenarioHelper.js";
import { PaymentDetailsPage } from "../pageObjects/checkout/PaymentDetails.page.js";

const paymentResources = new PaymentResources();
const bancontactCard = paymentResources.bcmc.be;
const user = paymentResources.guestUser.belgian;

test.describe.parallel("Payment via Bancontact Card", () => {
  test.beforeEach(async ({ page }) => {
    await goToShippingWithFullCart(page);
    await proceedToPaymentAs(page, user);
    const bancontactCardSection = await selectBancontactCard(page);
    await bancontactCardSection.fillBancontacCardInfo(
      bancontactCard.cardNumber,
      bancontactCard.expDate,
      user.firstName,
      user.lastName
    );
    await bancontactCardSection.placeOrder();
  });

  test("should succeed with correct 3DS credentials", async ({ page }) => {
    await new ThreeDSPaymentPage(page).validate3DS(
      bancontactCard.user,
      bancontactCard.password
    );

    await verifySuccessfulPayment(page);
  });

  test("should fail with wrong 3DS credentials", async ({ page }) => {
    await new ThreeDSPaymentPage(page).validate3DS(
      bancontactCard.wrongUser,
      bancontactCard.wrongPassword
    );

    await verifyFailedPayment(page);
  });
});

async function selectBancontactCard(page) {
  const paymentDetailPage = new PaymentDetailsPage(page);
  const bancontactCardSection = await paymentDetailPage.selectBancontactCard(
    page
  );
  return bancontactCardSection;
}

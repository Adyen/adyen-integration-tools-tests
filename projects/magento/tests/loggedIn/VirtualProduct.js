import { test } from "@playwright/test";
import PaymentResources from "../../../data/PaymentResources.js";
import { goToShippingWithFullCart, loginAs, proceedToPaymentWithoutShipping, verifySuccessfulPayment } from "../../helpers/ScenarioHelper.js";
import { makeCreditCardPayment } from "../../helpers/PaymentHelper.js";
import { PaymentDetailsPage } from "../../pageObjects/plugin/PaymentDetails.page.js";

const credentials = new PaymentResources();
const users = credentials.guestUser;
const magentoUser = credentials.sampleRegisteredUser;

test.describe("Virtual Products should be", () => {
  test.beforeEach(async ({ page, request }) => {
      await loginAs(page, magentoUser )
      await goToShippingWithFullCart(page, 0, "lifelong-fitness-iv.html");
  });

  test("purchasable via CC", async ({ page }) => {
    await proceedToPaymentWithoutShipping(page);
    await new PaymentDetailsPage(page).selectCreditCard();
    
    await makeCreditCardPayment(
      page,
      users.regular,
      credentials.masterCardWithout3D,
      credentials.expDate,
      credentials.cvc
    );

    await verifySuccessfulPayment(page);
  });
});

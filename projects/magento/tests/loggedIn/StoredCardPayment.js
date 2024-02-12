import { expect, test } from "@playwright/test";
import PaymentResources from "../../../data/PaymentResources.js";
import { PaymentDetailsPage } from "../../pageObjects/plugin/PaymentDetails.page.js";
import {
  goToShippingWithFullCart,
  proceedToPaymentAs,
  verifySuccessfulPayment,
  loginAs,
  placeOrder,
} from "../../helpers/ScenarioHelper.js";
import { CreditCardComponentsMagento } from "../../pageObjects/checkout/CreditCardComponentsMagento.js";
import { ThreeDS2PaymentPage } from "../../../common/redirect/ThreeDS2PaymentPage.js";

const paymentResources = new PaymentResources();
const magentoSampleUser = paymentResources.sampleRegisteredUser;
const users = paymentResources.guestUser;

/* No parallelism due to usage of same user account
since it will cause the cart to reset */
test.describe.only("Payment via stored credit card", () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAs(page, magentoSampleUser);
    await goToShippingWithFullCart(page);
    await proceedToPaymentAs(page, undefined, false);
  });
  
  test.afterEach("should allow the tokenized cards to be cleared", async ({page}) =>{
    await page.goto("/vault/cards/listaction/");
    await page.waitForLoadState("load", { timeout: 15000 });

    await page.getByRole('button', { name: 'Delete' }).click();
    await page.getByLabel('Delete').getByRole('button', { name: 'Delete' }).click();

    await page.waitForLoadState("load", { timeout: 15000 });
    await expect(page.getByText('Stored Payment Methods You have no stored payment methods.')).toBeVisible();
    await expect(page.getByText('Stored Payment Method was successfully removed')).toBeVisible();
  });

  test("should succeed with 3Ds2", async ({ page }) => {
    await makeCreditCardPayment(
      page,
      users.regular,
      paymentResources.masterCard3DS2,
      paymentResources.expDate,
      paymentResources.cvc,
      true
    );
    await new ThreeDS2PaymentPage(page).validate3DS2(
      paymentResources.threeDSCorrectPassword
    );
    await verifySuccessfulPayment(page);

    await goToShippingWithFullCart(page);
    await proceedToPaymentAs(page, undefined, false);

    await makeVaultPayment(page, paymentResources.masterCard3DS2, paymentResources.cvc);
    await new ThreeDS2PaymentPage(page).validate3DS2(
      paymentResources.threeDSCorrectPassword
    );
    await verifySuccessfulPayment(page);
  });

  test("should succeed with no 3Ds", async ({ page }) => {
    await makeCreditCardPayment(
      page,
      users.regular,
      paymentResources.masterCardWithout3D,
      paymentResources.expDate,
      paymentResources.cvc,
      true
    );
    await verifySuccessfulPayment(page);

    await goToShippingWithFullCart(page);
    await proceedToPaymentAs(page, undefined, false);

    await makeVaultPayment(page, paymentResources.masterCardWithout3D, paymentResources.cvc);
    await verifySuccessfulPayment(page);
  });
  
});

async function makeCreditCardPayment(
  page,
  user,
  creditCardNumber,
  expDate,
  cvc,
  saveCard = false
) {
  const paymentDetailPage = new PaymentDetailsPage(page);
  const creditCardSection = await paymentDetailPage.selectCreditCard();

  await creditCardSection.fillCreditCardInfo(
    user.firstName,
    user.lastName,
    creditCardNumber,
    expDate,
    cvc
  );

  if (saveCard == true){
    await paymentDetailPage.savePaymentMethod();
  }

  await placeOrder(page);
}

async function makeVaultPayment(page, creditCardNumber, cvc) {
  await new PaymentDetailsPage(page).selectVault(creditCardNumber.slice(-4));
  await new CreditCardComponentsMagento(page.locator(".payment-method._active")).fillCVC(cvc);

  await placeOrder(page);
}

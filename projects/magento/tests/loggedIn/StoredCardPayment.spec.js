import { test } from "@playwright/test";
import PaymentResources from "../../../data/PaymentResources.js";
import { PaymentDetailsPage } from "../../../magento/pageObjects/plugin/PaymentDetails.page.js";
import {
  goToShippingWithFullCart,
  proceedToPaymentAs,
  verifySuccessfulPayment,
  loginAs,
  placeOrder,
} from "../../../magento/helpers/ScenarioHelper.js";
import { CreditCardComponentsMagento } from "../../pageObjects/checkout/CreditCardComponentsMagento.js";

const paymentResources = new PaymentResources();
const magentoSampleUser = paymentResources.sampleRegisteredUser;
const users = paymentResources.guestUser;

test.describe("Payment via stored credit card", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, magentoSampleUser);
    await goToShippingWithFullCart(page);
    await proceedToPaymentAs(page, undefined, false);

    await makeCreditCardPayment(
      page,
      users.regular,
      paymentResources.masterCardWithout3D,
      paymentResources.expDate,
      paymentResources.cvc,
      true
    );
    await verifySuccessfulPayment(page);
  });

  test("should succeed", async ({ page }) => {
    await goToShippingWithFullCart(page);
    await proceedToPaymentAs(page, undefined, false);

    await makeVaultPayment(page, paymentResources.cvc);
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
  if (saveCard == true) await paymentDetailPage.savePaymentMethod();
  await creditCardSection.fillCreditCardInfo(
    user.firstName,
    user.lastName,
    creditCardNumber,
    expDate,
    cvc
  );
  await placeOrder(page);
}

async function makeVaultPayment(page, cvc) {
  await new PaymentDetailsPage(page).selectVault();
  await new CreditCardComponentsMagento(page.locator(".payment-method._active")).fillCVC(cvc);

  await placeOrder(page);
}

import { test } from "@playwright/test";
import { GiftCardHPPage } from "../../common/redirect/GiftCardHPPage.js";
import PaymentResources from "../../data/PaymentResources.js";
import {
  goToShippingWithFullCart,
  placeOrder,
  proceedToPaymentAs,
  verifyFailedPayment,
  verifySuccessfulPayment,
} from "../helpers/ScenarioHelper.js";
import { PaymentDetailsPage } from "../pageObjects/plugin/PaymentDetails.page.js";

const paymentResources = new PaymentResources();
const giftCard50EUR = paymentResources.giftCard.EUR50;
const giftCard20EUR = paymentResources.giftCard.EUR20;
const user = paymentResources.guestUser.dutch;

// TODO
test.describe.skip("Payment via Gift Card", () => {
  test.beforeEach(async ({ page }) => {
    await goToShippingWithFullCart(page, 1);
    await proceedToPaymentAs(page, user);
  });

  test("should succeed with gift card that has sufficient funds", async ({
    page,
  }) => {
    const giftCardPaymentPage = await selectGiftCard(page);
    await giftCardPaymentPage.fillGiftCardDetails(
      giftCard50EUR.cardHolderName,
      giftCard50EUR.cardNumber,
      giftCard50EUR.cardPIN
    );

    await giftCardPaymentPage.clickContinue();
    await giftCardPaymentPage.clickPay();

    await verifySuccessfulPayment(page, false);
  });

  test("should fail if Previous Button is clicked on payment details page", async ({
    page,
  }) => {
    const giftCardPaymentPage = await selectGiftCard(page);
    await giftCardPaymentPage.fillGiftCardDetails(
      giftCard50EUR.cardHolderName,
      giftCard50EUR.cardNumber,
      giftCard50EUR.cardPIN
    );

    await giftCardPaymentPage.clickPrevious();

    await verifyFailedPayment(page);
  });

  test("should redirect to a second payment method if giftcard has less balance than sum", async ({
    page,
  }) => {
    const giftCardPaymentPage = await selectGiftCard(page);
    await giftCardPaymentPage.fillGiftCardDetails(
      giftCard20EUR.cardHolderName,
      giftCard20EUR.cardNumber,
      giftCard20EUR.cardPIN
    );
    await giftCardPaymentPage.partialPaymentCheckBox.click();
    await giftCardPaymentPage.clickContinue();

    await giftCardPaymentPage.clickPay();

    await giftCardPaymentPage.genericGiftCardButtonHPP.click();

    await giftCardPaymentPage.fillGiftCardDetails(
      giftCard20EUR.cardHolderName,
      giftCard20EUR.cardNumber,
      giftCard20EUR.cardPIN
    );
    await giftCardPaymentPage.clickContinue();

    await giftCardPaymentPage.clickPay();

    await verifySuccessfulPayment(page, false);
  });

  test("should succeed when partially combined with another payment method", async ({
    page,
  }) => {
    const giftCardPaymentPage = await selectGiftCard(page);
    await giftCardPaymentPage.fillGiftCardDetails(
      giftCard20EUR.cardHolderName,
      giftCard20EUR.cardNumber,
      giftCard20EUR.cardPIN
    );
    await giftCardPaymentPage.partialPaymentCheckBox.click();
    await giftCardPaymentPage.clickContinue();

    await giftCardPaymentPage.clickPay();

    await giftCardPaymentPage.idealButtonHPP.click();
    await giftCardPaymentPage.idealIssuerButton.click();

    // Ideal simulator can have different buttons based on the merchant account
    await giftCardPaymentPage.iDealCompleteButton.isVisible() ? await giftCardPaymentPage.iDealCompleteButton.click()
      : await giftCardPaymentPage.iDealContinueButton.click();

    await verifySuccessfulPayment(page, false);
  });

  test("should fail when the second part of a partial payment is cancelled", async ({
    page,
  }) => {
    const giftCardPaymentPage = await selectGiftCard(page);
    await giftCardPaymentPage.fillGiftCardDetails(
      giftCard20EUR.cardHolderName,
      giftCard20EUR.cardNumber,
      giftCard20EUR.cardPIN
    );
    await giftCardPaymentPage.partialPaymentCheckBox.click();
    await giftCardPaymentPage.clickContinue();

    await giftCardPaymentPage.clickPay();

    await giftCardPaymentPage.clickPrevious();

    await verifyFailedPayment(page);
  });
});

async function selectGiftCard(page) {
  await new PaymentDetailsPage(page).selectGiftCard(page);
  await placeOrder(page);
  return new GiftCardHPPage(page);
}

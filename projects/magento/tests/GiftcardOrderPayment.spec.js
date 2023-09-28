import { test } from "@playwright/test";
import PaymentResources from "../../data/PaymentResources.js";
import {
  makeCreditCardPayment
} from "../helpers/PaymentHelper.js";
import {
  paySingleGiftcard,
  redeemGiftcard,
  removeSingleGiftcard,
  selectGiftcardSection,
  removeGiftcardStateData
} from "../helpers/GiftcardHelper.js";
import { GiftcardComponentsMagento } from "../pageObjects/checkout/GiftcardComponentsMagento.js";
import {
  goToShippingWithFullCart,
  proceedToPaymentAs,
  placeOrder,
  verifySuccessfulPayment,
} from "../helpers/ScenarioHelper.js";

const paymentResources = new PaymentResources();
const users = paymentResources.guestUser;

test.describe.parallel("Payment via giftcard", () => {
  test("Single giftcard should succeed", async ({ page }) => {
    await goToShippingWithFullCart(page);
    await proceedToPaymentAs(page, users.regular);

    const giftcardsSection = await selectGiftcardSection(page);

    await redeemGiftcard(
      giftcardsSection,
      paymentResources.giftCard.EUR50SVS.cardNumber,
      paymentResources.giftCard.EUR50SVS.cardPIN,
      paymentResources.giftCard.EUR50SVS.cardBrand
    );

    await paySingleGiftcard(giftcardsSection);
    await verifySuccessfulPayment(page);
  });

  test("Multiple giftcards should succeed", async ({ page }) => {
    await goToShippingWithFullCart(page, 1);
    await proceedToPaymentAs(page, users.regular);

    const giftcardsSection = await selectGiftcardSection(page);

    // Redeem first giftcard
    await redeemGiftcard(
        giftcardsSection,
        paymentResources.giftCard.EUR50SVS.cardNumber,
        paymentResources.giftCard.EUR50SVS.cardPIN,
        paymentResources.giftCard.EUR50SVS.cardBrand
    );

    // Redeem second giftcard
    await redeemGiftcard(
        giftcardsSection,
        paymentResources.giftCard.EUR50SVS.cardNumber,
        paymentResources.giftCard.EUR50SVS.cardPIN,
        paymentResources.giftCard.EUR50SVS.cardBrand
    );

    await placeOrder(page);
    await verifySuccessfulPayment(page);
  });

  test("Multiple giftcards and credit card should succeed", async ({ page }) => {
    await goToShippingWithFullCart(page, 2);
    await proceedToPaymentAs(page, users.regular);

    const giftcardsSection = await selectGiftcardSection(page);

    // Redeem first giftcard
    await redeemGiftcard(
        giftcardsSection,
        paymentResources.giftCard.EUR50SVS.cardNumber,
        paymentResources.giftCard.EUR50SVS.cardPIN,
        paymentResources.giftCard.EUR50SVS.cardBrand
    );

    // Redeem second giftcard
    await redeemGiftcard(
        giftcardsSection,
        paymentResources.giftCard.EUR50SVS.cardNumber,
        paymentResources.giftCard.EUR50SVS.cardPIN,
        paymentResources.giftCard.EUR50SVS.cardBrand
    );

    await makeCreditCardPayment(
        page,
        users.regular,
        paymentResources.masterCardWithout3D,
        paymentResources.expDate,
        paymentResources.cvc
    );

    await verifySuccessfulPayment(page);
  });

  test("Remove single giftcard from checkout should succeed", async ({ page }) => {
    await goToShippingWithFullCart(page);
    await proceedToPaymentAs(page, users.regular);

    const giftcardsSection = await selectGiftcardSection(page);

    await redeemGiftcard(
        giftcardsSection,
        paymentResources.giftCard.EUR50SVS.cardNumber,
        paymentResources.giftCard.EUR50SVS.cardPIN,
        paymentResources.giftCard.EUR50SVS.cardBrand
    );

    await removeSingleGiftcard(giftcardsSection);
    await new GiftcardComponentsMagento(page).verifyGiftcardRemoval();
  });

  test("Remove multiple giftcards from checkout should succeed", async ({ page }) => {
    await goToShippingWithFullCart(page, 2);
    await proceedToPaymentAs(page, users.regular);

    const giftcardsSection = await selectGiftcardSection(page);

    // Redeem first giftcard
    await redeemGiftcard(
        giftcardsSection,
        paymentResources.giftCard.EUR50SVS.cardNumber,
        paymentResources.giftCard.EUR50SVS.cardPIN,
        paymentResources.giftCard.EUR50SVS.cardBrand
    );

    await new GiftcardComponentsMagento(page).waitForGiftcardComponentReady(page);

    // Redeem second giftcard
    await redeemGiftcard(
        giftcardsSection,
        paymentResources.giftCard.EUR50SVS.cardNumber,
        paymentResources.giftCard.EUR50SVS.cardPIN,
        paymentResources.giftCard.EUR50SVS.cardBrand
    );

    await new GiftcardComponentsMagento(page).waitForGiftcardComponentReady(page);

    // Remove giftcards as the redeemed order
    await removeGiftcardStateData(giftcardsSection);
    await removeGiftcardStateData(giftcardsSection);

    await new GiftcardComponentsMagento(page).verifyGiftcardRemoval();
  });
});

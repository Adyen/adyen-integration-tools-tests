import PaymentResources from "../../../data/PaymentResources.js";
import {
  goToShippingWithFullCart, loginAs,
  loginAsAdmin, placeOrder,
  proceedToPaymentAs,
  verifySuccessfulPayment
} from "../../helpers/ScenarioHelper.js";
import { AdminOrderCreationPage } from "../../pageObjects/plugin/AdminOrderCreation.page.js";
import {AdminAdyenConfigPage} from "../../pageObjects/plugin/AdminAdyenConfig.page.js";
import {expect, test} from "@playwright/test";
import {makeCreditCardPayment} from "../../helpers/PaymentHelper.js";
import {PaymentDetailsPage} from "../../pageObjects/plugin/PaymentDetails.page.js";
import {CreditCardComponentsMagento} from "../../pageObjects/checkout/CreditCardComponentsMagento.js";

const paymentResources = new PaymentResources();
const magentoAdminUser = paymentResources.magentoAdminUser;
const users = paymentResources.guestUser;
const magentoSampleUser = paymentResources.sampleRegisteredUser;

test.describe("Payment with installments", () => {
  test("should be configured", async ({ page }) => {
    await loginAsAdmin(page, magentoAdminUser);

    const adminPage = new AdminOrderCreationPage(page);
    await adminPage.closePopup();
    await adminPage.goToAdyenPluginConfigurationPage(page);

    const adyenConfigPage = new AdminAdyenConfigPage(page);
    await adyenConfigPage.configureInstallments(page);
    await adyenConfigPage.waitForPageLoad(page);

    await expect(await adyenConfigPage.successMessage).toContainText("You saved the configuration.");
  });

  test("without 3Ds should succeed", async ({ page }) => {
    await goToShippingWithFullCart(page);
    await proceedToPaymentAs(page, users.regular);

    await makeCreditCardPayment(
        page,
        users.regular,
        paymentResources.visa,
        paymentResources.expDate,
        paymentResources.cvc,
        false,
        true
    );

    await verifySuccessfulPayment(page);
  });

  test("with stored credit card should succeed", async ({ page }) => {
    await loginAs(page, magentoSampleUser);

    await goToShippingWithFullCart(page);
    await proceedToPaymentAs(page, undefined, false);

    await makeCreditCardPayment(
        page,
        users.regular,
        paymentResources.visa,
        paymentResources.expDate,
        paymentResources.cvc,
        true
    );
    await verifySuccessfulPayment(page);

    await goToShippingWithFullCart(page);
    await proceedToPaymentAs(page, undefined, false);

    await new PaymentDetailsPage(page).selectVaultCC(paymentResources.visa.slice(-4));

    const cardComponent = await new CreditCardComponentsMagento(page.locator(".payment-method._active"));
    await cardComponent.fillCVC(paymentResources.cvc);
    await cardComponent.fillInstallements();

    await placeOrder(page);
    await verifySuccessfulPayment(page);
  });
});

import { test } from "@playwright/test";
import PaymentResources from "../../data/PaymentResources.js";
import {
  goToShippingWithFullCart,
  proceedToPaymentAs,
} from "../helpers/ScenarioHelper.js";
import { PaymentDetailsPage } from "../pageObjects/plugin/PaymentDetails.page.js";
import { ShippingDetails } from "../pageObjects/plugin/ShippingDetails.page.js";

const paymentResources = new PaymentResources();
const belgianUser = paymentResources.guestUser.belgian;
const dutchUser = paymentResources.guestUser.dutch;

test.describe("Payment method list", () => {
  test.beforeEach(async ({ page }) => {
    await goToShippingWithFullCart(page);
  });

  test("should show updated payment method list after shipping address change", async ({ page }) => {
    await proceedToPaymentAs(page, dutchUser);
    const paymentDetailPage = new PaymentDetailsPage(page);
    await paymentDetailPage.selectIDeal();

    const shippingDetailsPage = new ShippingDetails(page);
    await shippingDetailsPage.goTo(false);
    await shippingDetailsPage.fillShippingDetails(belgianUser);
    await shippingDetailsPage.clickNextButton();

    await paymentDetailPage.selectBancontactMobile();
  });
});
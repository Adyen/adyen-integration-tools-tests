import { test } from "@playwright/test";
import PaymentResources from "../../data/PaymentResources.js";
import {
    doPrePaymentChecks,
    goToShippingWithFullCart,
    proceedToPaymentAs,
    verifyFailedPayment,
    verifySuccessfulPayment
} from "../helpers/ScenarioHelper.js";
import { makeIDealPayment } from "../helpers/PaymentHelper.js";

const paymentResources = new PaymentResources();
const users = paymentResources.guestUser;

test.describe.parallel("Payment via iDeal", () => {
    test.beforeEach(async ({ page }) => {
        await goToShippingWithFullCart(page);
        await proceedToPaymentAs(page, users.dutch);
        await doPrePaymentChecks(page);
    });

    test("should succeed via Test Issuer", async ({ page }) => {
        await makeIDealPayment(page, "Test Issuer");
        await verifySuccessfulPayment(page, false);
    });

    test("should fail via Failing Test Issuer", async ({ page }) => {
        await makeIDealPayment(page, "Test Issuer Refused");
        await verifyFailedPayment(page, false);
    });

});
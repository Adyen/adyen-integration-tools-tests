import { expect, test } from "@playwright/test";
import PaymentResources from "../../../data/PaymentResources.js";
import SharedState from "./SharedState.js";
import {
  getOrderNumber,
  goToShippingWithFullCart, loginAsAdmin,
  proceedToPaymentAs,
  verifySuccessfulPayment,
} from "../../helpers/ScenarioHelper.js";
import { makeCreditCardPayment } from "../../helpers/PaymentHelper.js";
import {AdminOrderCreationPage} from "../../pageObjects/plugin/AdminOrderCreation.page.js";

const paymentResources = new PaymentResources();
const webhookCredentials = paymentResources.webhookCredentials;
const users = paymentResources.guestUser;
let orderNumber;
const randomPspNumber = Math.random().toString().slice(2,7);
const username = webhookCredentials.webhookUsername;
const password = webhookCredentials.webhookPassword;

const base64Credentials = Buffer.from(`${username}:${password}`).toString('base64');
const headers = {
    Authorization: `Basic ${base64Credentials}`
};

let adminOrderCreationPage;

test.describe("Process AUTHORISATION webhook notifications", () => {
  test.beforeEach(async ({ page }) => {
    await goToShippingWithFullCart(page,1);
    await proceedToPaymentAs(page, users.dutch);
    await makeCreditCardPayment(
      page,
      users.regular,
      paymentResources.visa,
      paymentResources.expDate,
      paymentResources.cvc
    );
    await verifySuccessfulPayment(page);
    orderNumber = await getOrderNumber(page);
    SharedState.orderNumber = orderNumber;
  });

  test("should be able to process AUTHORISATION notification through queue processor", async ({ request, page }) => {
    // Send the notification process request
    const processWebhookResponse = await request.post("/adyen/webhook", {
      headers,
      data: {
       "live" : "false",
       "notificationItems" : [
          {
             "NotificationRequestItem" : {
                   "amount" : {
                   "currency" : "EUR",
                   "value" : 7800
                },
                "eventCode" : "AUTHORISATION",
                "eventDate" : "2025-05-23T15:48:53+02:00",
                "merchantAccountCode" : `${paymentResources.apiCredentials.merchantAccount}`,
                "merchantReference" : `${orderNumber}`,
                "operations" : [
                   "AUTHORISATION"
                ],
                "paymentMethod" : "visa",
                "pspReference" : `LVL9PX2ZPQR${randomPspNumber}`,
                "reason" : "",
                "success" : "true"
             }
          }
       ]
      }
    });

    // Check response status
    expect(processWebhookResponse.status()).toBe(202);

    // Get processed notification
    const processedNotificationResponse = await request.get(`/adyentest/publishwebhookqueue`)

    // Check response status
    expect(processedNotificationResponse.status()).toBe(200);

    // Check the body of processed notification
    const processedNotificationBody = await processedNotificationResponse.json();
    expect(processedNotificationBody.result).toBe("success");

    // Navigate to the order details page
    await loginAsAdmin(page, paymentResources.magentoAdminUser);
    adminOrderCreationPage = new AdminOrderCreationPage(page);
    await adminOrderCreationPage.closePopup();

    await adminOrderCreationPage.goToOrderDetailPage(page, SharedState.orderNumber);

    await adminOrderCreationPage.verifyOrderStatusChange(page);
  });
});

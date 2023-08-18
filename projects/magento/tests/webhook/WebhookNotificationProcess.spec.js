import { expect, test } from "@playwright/test";
import PaymentResources from "../../../data/PaymentResources.js";
import {
  getOrderNumber,
  goToShippingWithFullCart,
  makeIDealPayment,
  proceedToPaymentAs,
  verifySuccessfulPayment,
} from "../../helpers/ScenarioHelper.js";

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

test.describe.parallel("Webhook notifications", () => {
  test.beforeEach(async ({ page }) => {
    await goToShippingWithFullCart(page);
    await proceedToPaymentAs(page, users.dutch);
    await makeIDealPayment(page, "Test Issuer");
    await verifySuccessfulPayment(page, false);
    orderNumber = await getOrderNumber(page);
  });

  test("should be able to process notification", async ({ request }) => {
   
   // Send the notification process request
   const processWebhookResponse = await request.post("/adyen/process/json", {
      headers,
      data: {
       "live" : "false",
       "notificationItems" : [
          {
             "NotificationRequestItem" : {
                   "amount" : {
                   "currency" : "EUR",
                   "value" : 3900
                },
                "eventCode" : "AUTHORISATION",
                "eventDate" : "2023-05-23T15:48:53+02:00",
                "merchantAccountCode" : `${paymentResources.apiCredentials.merchantAccount}`,
                "merchantReference" : `${orderNumber}`,
                "operations" : [
                   "REFUND"
                ],
                "paymentMethod" : "ideal",
                "pspReference" : `LVL9PX2ZPQR${randomPspNumber}`,
                "reason" : "",
                "success" : "true"
             }
          }
       ]
    }
 });
 // Check response status
 expect(processWebhookResponse.status()).toBe(200);

 // Get processed notification
 const processedNotificationResponse = await request.get(`/adyentest/test?orderId=${orderNumber}`)
 
 // Check response status
 expect(processedNotificationResponse.status()).toBe(200);
 
 // Check the body of processed notification
 const processedNotificationBody = await processedNotificationResponse.json();
  expect(processedNotificationBody[0].status).toBe("processing");

 });
});

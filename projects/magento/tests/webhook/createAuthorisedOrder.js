import { expect } from "@playwright/test";
import PaymentResources from "../../../data/PaymentResources.js";
import {
    getOrderNumber,
    goToShippingWithFullCart,
    proceedToPaymentAs,
    verifySuccessfulPayment,
    extractPspReferenceFromAdminOrder,
    loginAsAdmin,
} from "../../helpers/ScenarioHelper.js";
import { makeCreditCardPayment } from "../../helpers/PaymentHelper.js";
import { AdminOrderCreationPage } from "../../pageObjects/plugin/AdminOrderCreation.page.js";

const paymentResources = new PaymentResources();
const webhookCredentials = paymentResources.webhookCredentials;

const username = webhookCredentials.webhookUsername;
const password = webhookCredentials.webhookPassword;
const base64Credentials = Buffer.from(`${username}:${password}`).toString("base64");
const headers = { Authorization: `Basic ${base64Credentials}` };

export async function createAuthorisedOrder({ page, request, flowKey, sharedState }) {
    const users = paymentResources.guestUser;

    // 1) Place order on storefront
    await goToShippingWithFullCart(page, 1);
    await proceedToPaymentAs(page, users.dutch);
    await makeCreditCardPayment(
        page,
        users.regular,
        paymentResources.visa,
        paymentResources.expDate,
        paymentResources.cvc
    );
    await verifySuccessfulPayment(page);

    const orderNumber = await getOrderNumber(page);

    // 2) Login to Admin and extract PSP reference
    await loginAsAdmin(page, paymentResources.magentoAdminUser);
    const adminOrderPage = new AdminOrderCreationPage(page);
    await adminOrderPage.closePopup();
    await adminOrderPage.goToOrderDetailPage(page, orderNumber);

    const pspReference = await extractPspReferenceFromAdminOrder(page);
    expect(pspReference).toBeTruthy();

    // 3) Process AUTHORISATION webhook for that order
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
                        "eventDate" : "2023-05-23T15:48:53+02:00",
                        "merchantAccountCode" : `${paymentResources.apiCredentials.merchantAccount}`,
                        "merchantReference" : `${orderNumber}`,
                        "operations" : [
                            "AUTHORISATION"
                        ],
                        "paymentMethod" : "visa",
                        "pspReference" : `${pspReference}`,
                        "reason" : "",
                        "success" : "true"
                    }
                }
            ]
        }
    });

    expect(processWebhookResponse.status()).toBe(202);

    // Get processed notification
    const processedNotificationResponse = await request.get(`/adyentest/test?orderId=${orderNumber}&eventCode=AUTHORISATION`)

    // Check response status
    expect(processedNotificationResponse.status()).toBe(200);

    // Store under flow
    sharedState.flows ??= {};
    sharedState.flows[flowKey] ??= {};

    sharedState.flows[flowKey].orderNumber = orderNumber;
    sharedState.flows[flowKey].pspReference = pspReference;

    sharedState.orderNumber = orderNumber;
    sharedState.pspReference = pspReference;

    return { orderNumber, pspReference };
}

export { headers, paymentResources };

import { expect, test } from "@playwright/test";
import SharedState from "./SharedState.js";
import { AdminOrderCreationPage } from "../../pageObjects/plugin/AdminOrderCreation.page.js";
import { loginAsAdmin } from "../../helpers/ScenarioHelper.js";
import { createAuthorisedOrder, headers, paymentResources } from "./createAuthorisedOrder.js";

test.describe("Backoffice Cancel + process CANCELLATION webhook", () => {
    test.beforeEach(async ({ page, request }) => {
        await createAuthorisedOrder({
            page,
            request,
            flowKey: "cancellation",
            sharedState: SharedState,
        });
    });

    test("should cancel in admin and process CANCELLATION webhook", async ({ page, request }) => {
        const { orderNumber, pspReference } = SharedState.flows.cancellation;

        // Login again (helper logged in earlier, but keep test self-safe)
        await loginAsAdmin(page, paymentResources.magentoAdminUser);
        const adminOrderPage = new AdminOrderCreationPage(page);
        await adminOrderPage.closePopup();
        await adminOrderPage.goToOrderDetailPage(page, orderNumber);

        // Click Cancel
        await page.locator("#order-view-cancel-button").click();
        await page.locator(".modal-popup .action-accept").click();
        await expect(page.locator(".message-success")).toBeVisible();

        const cancelPspReference = await extractCancelPspReferenceFromOrderComments(page);

        // Webhook
        const cancellationWebhook = {
            amount: { currency: "EUR", value: 7800 },
            eventCode: "CANCELLATION",
            eventDate: new Date().toISOString(),
            merchantAccountCode: `${paymentResources.apiCredentials.merchantAccount}`,
            merchantReference: `${orderNumber}`,
            originalReference: `${pspReference}`,
            paymentMethod: "visa",
            pspReference: `${cancelPspReference}`,
            reason: "",
            success: "true",
        };

        const processWebhookResponse = await request.post("/adyen/webhook", {
            headers,
            data: { live: "false", notificationItems: [{ NotificationRequestItem: cancellationWebhook }] },
        });
        expect(processWebhookResponse.status()).toBe(202);

        const processedNotificationResponse = await request.get(
            `/adyentest/test?orderId=${orderNumber}&eventCode=CANCELLATION`
        );
        expect(processedNotificationResponse.status()).toBe(200);

        const processedNotificationBody = await processedNotificationResponse.json();
        expect(processedNotificationBody[0].status).toMatch(/cancel/i);
    });
});

async function extractCancelPspReferenceFromOrderComments(page) {
    const cancelEntry = page.locator("text=Cancel authorised Adyen payment").first();
    await expect(cancelEntry).toBeVisible({ timeout: 20000 });

    const container = cancelEntry.locator("xpath=ancestor::*[self::tr or self::li or self::div][1]");
    const rawText = await container.innerText();

    const pspLines = rawText
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => /^psp reference:/i.test(l) && !/^original psp reference:/i.test(l));

    if (pspLines.length === 0) {
        throw new Error(`No non-original PSP reference line found. Raw:\n${rawText}`);
    }

    const value = pspLines[0].split(":")[1]?.trim();
    if (!value) {
        throw new Error(`Could not parse PSP reference value from line: "${pspLines[0]}"`);
    }

    return value;
}


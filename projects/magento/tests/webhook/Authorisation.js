import { test, expect } from "@playwright/test";
import SharedState from "./SharedState.js";
import { createAuthorisedOrder } from "./createAuthorisedOrder.js";

test.describe("Process AUTHORISATION webhook notifications", () => {
    test("should be able to process AUTHORISATION notification", async ({ page, request }) => {
        const { orderNumber, pspReference } = await createAuthorisedOrder({
            page,
            request,
            flowKey: "authorisation",
            sharedState: SharedState,
        });

        expect(orderNumber).toBeTruthy();
        expect(pspReference).toBeTruthy();
    });
});

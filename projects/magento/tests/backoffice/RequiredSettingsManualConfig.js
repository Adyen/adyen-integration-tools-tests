import { expect, test } from "@playwright/test";
import PaymentResources from "../../../data/PaymentResources.js";
import { loginAsAdmin } from "../../helpers/ScenarioHelper.js";
import { AdminAdyenConfigPage } from "../../pageObjects/plugin/AdminAdyenConfig.page.js";


const paymentResources = new PaymentResources();
const apiCredentials = paymentResources.apiCredentials;

let adyenConfigPage;


test.describe('Configure required settings', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsAdmin(page, paymentResources.magentoAdminUser);
        adyenConfigPage = new AdminAdyenConfigPage(page);
        await adyenConfigPage.closePopup();
        await adyenConfigPage.goToAdyenPluginConfigurationPage(page);
    });


// Webhook needed for testing
    test("Manual mode should be configured successfully with Webhook", async ({ page }) => {
        adyenConfigPage = new AdminAdyenConfigPage(page);
        await adyenConfigPage.manualConfigureRequiredSettings(page, apiCredentials.merchantAccount, paymentResources.webhookUsername, paymentResources.webhookPassword)
        await adyenConfigPage.waitForPageLoad(page);

        await expect(adyenConfigPage.successMessage).toContainText("You saved the configuration.");

    });
});

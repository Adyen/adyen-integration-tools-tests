import { expect, test } from "@playwright/test";
import PaymentResources from "../../../data/PaymentResources.js";
import { loginAsAdmin } from "../../helpers/ScenarioHelper.js";
import { AdminPanelPage } from "../../pageObjects/plugin/AdminPanel.page.js";

const paymentResources = new PaymentResources();

test.describe('Configure required settings', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsAdmin(page, paymentResources.magentoAdminUser);
    });

    test("auto mode should be configured successfully", async ({ page }) => {
        const adminSection = new AdminPanelPage(page);
        await adminSection.goToAdyenPluginConfigurationPage(page);

        const apiKey = paymentResources.wsUserApiKey;
        const clientKey = paymentResources.wsUserClientKey;
        const apiKeyField = page.locator("div.adyen_required_config_settings input[name*=api_key_test]");
        const clientKeyField = page.locator('input[name*=client_key_test]');
        const merchantAccountField = page.locator("select[name*=merchant_account_auto]");
        const nextButton = page.locator('#adyen_configuration_action');

        await page.locator("#payment_us_adyen_group_all_in_one_adyen_required_settings-head").click();
        await page.locator("select[name*=configuration_mode]").selectOption('auto');
        await page.locator("select[name*=demo_mode]").selectOption('1');
        await apiKeyField.type(apiKey);
        await nextButton.click();

        await adminSection.waitForPageLoad(page);
        await expect(clientKeyField).toHaveValue(clientKey);
        await merchantAccountField.selectOption('MagentoMerchantTest2');
        await nextButton.click();
        
        await expect(page.locator('input[name*=notification_username]')).toHaveValue('webuser');
        await expect(page.locator('input[name*=notification_password]')).not.toBeEmpty();
        await page.locator('#save').click();
        await adminSection.waitForPageLoad(page);
        await expect(page.locator('.message-success', { has: page.locator("//div[text()='You saved the configuration.']")})).toBeVisible();
        await page.locator("#payment_us_adyen_group_all_in_one_adyen_required_settings-head").click();
        await expect(clientKeyField).toBeVisible();
        await expect(clientKeyField).toBeDisabled();
        await expect(clientKeyField).not.toBeEmpty();
    });
});

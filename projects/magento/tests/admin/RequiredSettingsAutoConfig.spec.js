import {expect, test} from "@playwright/test";
import PaymentResources from "../../../data/PaymentResources.js";
import {loginAsAdmin} from "../../helpers/ScenarioHelper.js";
import {AdminPanelPage} from "../../pageObjects/plugin/AdminPanel.page.js";

const paymentResources = new PaymentResources();
const apiCredentials = paymentResources.apiCredentials;

test.describe('Configure required settings', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsAdmin(page, paymentResources.magentoAdminUser);
    });

    test("auto mode should be configured successfully", async ({ page }) => {
        const adminSection = new AdminPanelPage(page);
        await adminSection.goToAdyenPluginConfigurationPage(page);

        const requiredSettingsHeader = page.locator("#payment_us_adyen_group_all_in_one_adyen_required_settings-head");
        const configurationModeField = page.locator("select[name*=configuration_mode]");
        const demoModeField = page.locator("select[name*=demo_mode]");
        const apiKeyField = page.locator("div.adyen_required_config_settings input[name*=api_key_test]");
        const clientKeyField = page.locator('input[name*=client_key_test]');
        const merchantAccountField = page.locator("select[name*=merchant_account_auto]");
        const notificationUsernameField = page.locator('input[name*=notification_username]');
        const notificationPasswordField = page.locator('input[name*=notification_password]');
        const nextButton = page.locator('#adyen_configuration_action');

        await requiredSettingsHeader.click();
        await configurationModeField.selectOption('auto');
        await demoModeField.selectOption('1');
        await apiKeyField.type(apiCredentials.apiKey);
        await nextButton.click();

        await adminSection.waitForPageLoad(page);
        await expect(clientKeyField).toHaveValue(apiCredentials.clientKey);

        await merchantAccountField.selectOption(apiCredentials.merchantAccount);
        await nextButton.click();

        await expect(notificationUsernameField).toHaveValue('webuser');
        await expect(notificationPasswordField).not.toBeEmpty();
        await page.locator('#save').click();

        await adminSection.waitForPageLoad(page);
        await expect(page.locator('.message-success', { has: page.locator("//div[text()='You saved the configuration.']")})).toBeVisible();
    });
});

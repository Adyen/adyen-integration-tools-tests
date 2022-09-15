import {expect, test} from "@playwright/test";
import PaymentResources from "../../../data/PaymentResources.js";
import {loginAsAdmin} from "../../helpers/ScenarioHelper.js";
import {AdminPanelPage} from "../../pageObjects/plugin/AdminPanel.page.js";

const paymentResources = new PaymentResources();
const apiCredentials = paymentResources.apiCredentials;
let adminSection;
let requiredSettingsHeader;
let configurationModeField;
let demoModeField;
let apiKeyField;
let clientKeyField;
let merchantAccountField;
let notificationUsernameField;
let notificationPasswordField;
let nextButton;
let resetButton;
let saveConfigButton;

test.describe('Configure required settings', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsAdmin(page, paymentResources.magentoAdminUser);
        adminSection = new AdminPanelPage(page);
        requiredSettingsHeader = page.locator("#payment_us_adyen_group_all_in_one_adyen_required_settings-head");
        configurationModeField = page.locator("select[name*=configuration_mode]");
        demoModeField = page.locator("select[name*=demo_mode]");
        apiKeyField = page.locator("div.adyen_required_config_settings input[name*=api_key_test]");
        clientKeyField = page.locator('input[name*=client_key_test]');
        merchantAccountField = page.locator("select[name*=merchant_account_auto]");
        notificationUsernameField = page.locator('input[name*=notification_username]');
        notificationPasswordField = page.locator('input[name*=notification_password]');
        nextButton = page.locator('#adyen_configuration_action');
        resetButton = page.locator('#adyen_configuration_action_reset');
        saveConfigButton = page.locator('#save');

        await adminSection.goToAdyenPluginConfigurationPage(page);
    });

    test("auto mode should be configured successfully", async ({ page }) => {
        await goToAutoConfigurationMode();
        await apiKeyField.type(apiCredentials.apiKey);
        await nextButton.click();

        await adminSection.waitForPageLoad(page);
        await expect(clientKeyField).toHaveValue(apiCredentials.clientKey);

        await merchantAccountField.selectOption(apiCredentials.merchantAccount);
        await nextButton.click();

        await expect(notificationUsernameField).toHaveValue('webuser');
        await expect(notificationPasswordField).not.toBeEmpty();
        await saveConfigButton.click();

        await adminSection.waitForPageLoad(page);
        await expect(page.locator('.message-success', { has: page.locator("//div[text()='You saved the configuration.']")})).toBeVisible();
    });

    test('auto mode fails with bad api key', async ({ page }) => {
        page.on('dialog', dialog => dialog.accept());
        await goToAutoConfigurationMode();

        await resetButton.click();
        await apiKeyField.type('xyzabc');
        await nextButton.click();

        await adminSection.waitForPageLoad(page);
        await expect(page.locator('#adyen_payments_configuration_errors .message-warning')).toContainText('Unable to load merchant accounts');
    });
});

async function goToAutoConfigurationMode() {
    await requiredSettingsHeader.click();
    await configurationModeField.selectOption('auto');
    await demoModeField.selectOption('1');
}

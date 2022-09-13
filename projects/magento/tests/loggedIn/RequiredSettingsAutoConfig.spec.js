import { expect, test } from "@playwright/test";
import PaymentResources from "../../../data/PaymentResources.js";
import { loginAsAdmin } from "../../helpers/ScenarioHelper.js";
import { AdminPanelPage } from "../../pageObjects/plugin/AdminPanel.page.js";

const paymentResources = new PaymentResources();

test.describe('Configure required settings', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsAdmin(page, paymentResources.magentoAdminUser);
    });

    test("auto mode should be configured", async ({ page }) => {
        const adminSection = new AdminPanelPage(page);
        await adminSection.goToPluginConfiguration(page);
        await adminSection.waitForPageLoad(page);
        const nextButton = page.locator('#adyen_configuration_action');
        await page.locator("#payment_us_adyen_group_all_in_one_adyen_required_settings-head").click();
        await page.locator("select[name*=configuration_mode]").selectOption('auto');
        await page.locator("select[name*=demo_mode]").selectOption('1');
        const apiKey = paymentResources.wsUserApiKey;
        const clientKey = paymentResources.wsUserClientKey;
        await page.locator("div.adyen_required_config_settings input[name*=api_key_test]").type(apiKey);
        await nextButton.click();
        await adminSection.waitForPageLoad(page);
        await expect(page.locator('input[name*=client_key_test]')).toHaveValue(clientKey);
        await page.locator("select[name*=merchant_account_auto]").selectOption('MagentoMerchantTest2');
        await nextButton.click();
        await expect(page.locator('input[name*=notification_username]')).toHaveValue('webuser');
        await expect(page.locator('input[name*=notification_password]')).not.toBeEmpty();
        // todo submit
    });
});
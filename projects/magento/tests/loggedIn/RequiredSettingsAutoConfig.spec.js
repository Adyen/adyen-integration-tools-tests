import { chromium, expect, test } from "@playwright/test";
import PaymentResources from "../../../data/PaymentResources.js";
import { loginAsAdmin } from "../../helpers/ScenarioHelper.js";
import { AdminPanelPage } from "../../pageObjects/plugin/AdminPanel.page.js";

const paymentResources = new PaymentResources();

test.describe('Configure required settings', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsAdmin(page, paymentResources.magentoAdminUser);
    });

    test("auto mode should succeed", async ({page}) => {
        const adminSection = new AdminPanelPage(page);
        await adminSection.goToPluginConfiguration(page);
        await adminSection.waitForPageLoad(page);
        await page.pause(); // debugger
        await page.locator("#payment_us_adyen_group_all_in_one_adyen_required_settings-head").click();
        await page.locator("#payment_us_adyen_group_all_in_one_adyen_required_settings_configuration_mode").click();
        await page.locator("select[name*=configuration_mode]").selectOption('auto');
        await page.locator("select[name*=demo_mode]").selectOption('1');

    });
});
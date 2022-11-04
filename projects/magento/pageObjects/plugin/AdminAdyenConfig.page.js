
import { expect } from "@playwright/test";
import { AdminPanelPage } from "./AdminPanel.page.js";
export class AdminAdyenConfigPage extends AdminPanelPage {
  constructor(page) {
    super(page);
    this.page = page;

    //Configuration > Required Settings
    this.adyenRequiredSettingsLink = page.locator("#payment_us_adyen_group_all_in_one_adyen_required_settings-head");
    this.adyenRequiredSettingsGroup = page.locator("#payment_us_adyen_group_all_in_one_adyen_required_settings");

    this.confirgurationModeDropdown = this.adyenRequiredSettingsGroup.locator("select[name*=configuration_mode]");
    this.environmentDropdown = this.adyenRequiredSettingsGroup.locator("select[name*=demo_mode]");
    this.apiKeyInput = this.adyenRequiredSettingsGroup.locator("input[name*=api_key_test]");
    this.clientKeyInput = this.adyenRequiredSettingsGroup.locator("input[name*=client_key_test]");
    this.merchantAccountDropdown = this.adyenRequiredSettingsGroup.locator("select[name*=merchant_account_auto]");
    this.webhookUsernameInput = this.adyenRequiredSettingsGroup.locator("input[name*=notification_username]");
    this.webhookPasswordInput = this.adyenRequiredSettingsGroup.locator("input[name*=notification_password]");
    this.nextButton = this.adyenRequiredSettingsGroup.locator("#adyen_configuration_action");
    this.reconfigureButton = this.adyenRequiredSettingsGroup.locator("#adyen_configuration_action_reset");
    this.configuredCheckMark = this.adyenRequiredSettingsGroup.locator(".configured");

    this.requiredSettingsWarningMessage = this.adyenRequiredSettingsGroup.locator(".message.message-warning");
    this.requiredSettingsSpinner = this.adyenRequiredSettingsGroup.locator("img.processing");


    //Configuration > Payment Methods
    this.adyenPaymentsLink = page.locator("#payment_us_adyen_group_all_in_one-head");
    this.configurePaymentMethodsLink = page.locator("#payment_us_adyen_group_all_in_one_adyen_configure_payment_methods-head");
    this.adyenMOTOLink = page.locator("#payment_us_adyen_group_all_in_one_adyen_configure_payment_methods_adyen_moto_advanced_settings-head");

    //Configuration > Payment Methods > AdyenMOTO
    this.adyenMOTOStatusDropdown = page.locator("#payment_us_adyen_group_all_in_one_adyen_configure_payment_methods_adyen_moto_advanced_settings_active");

    this.adyenMOTOAccountSettingsGroup = page.locator("#payment_us_adyen_group_all_in_one_adyen_configure_payment_methods_adyen_moto_advanced_settings_moto_settings");

    this.adyenMOTOAccountAddButton = this.adyenMOTOAccountSettingsGroup.locator("button[title='Add']");
    this.adyenMOTOCredentialsFirstTable = this.adyenMOTOAccountSettingsGroup.locator("tbody tr").first();

    this.adyenMOTOMerhcantAccountInputField = this.adyenMOTOCredentialsFirstTable.locator("//input[contains(@id,'_merchant_account')]");
    this.adyenMOTOClientKeyInputField = this.adyenMOTOCredentialsFirstTable.locator("//input[contains(@id,'_client_key')]");
    this.adyenMOTOApiKeyInputField = this.adyenMOTOCredentialsFirstTable.locator("//input[contains(@id,'_api_key')]");
    this.adyenMOTOModeSelector = this.adyenMOTOCredentialsFirstTable.locator("select");
  }

  async enableMOTO(page, adyenMOTOMerchantAccount, adyenMOTOClientKey, adyenMOTOApiKey) {
    await this.configurePaymentMethodsLink.click();

    await this.adyenMOTOLink.click();
    await this.adyenMOTOStatusDropdown.selectOption("1");
    await this.adyenMOTOAccountAddButton.click();

    await this.adyenMOTOMerhcantAccountInputField.type(adyenMOTOMerchantAccount);
    await this.adyenMOTOClientKeyInputField.type(adyenMOTOClientKey);
    await this.adyenMOTOApiKeyInputField.type(adyenMOTOApiKey);

    await this.adyenMOTOModeSelector.selectOption("1");
    await this.saveConfigButton.click();

    await this.waitForPageLoad(page);

  }

  async autoConfigureRequiredSettings(page, apiKey, clientKey, merchantAccount, webhookUsername,) {
    await this.waitForPageLoad(page);
    await this.adyenRequiredSettingsLink.click();
    await this.confirgurationModeDropdown.selectOption("auto");
    await this.environmentDropdown.selectOption("1");

    await this.waitForPageLoad(page);
    if (await this.reconfigureButton.isVisible()) {
      page.on('dialog', dialog => dialog.accept());
      await this.reconfigureButton.scrollIntoViewIfNeeded();
      await this.reconfigureButton.click();
    }

    await this.apiKeyInput.fill("");
    console.log("non-stringified");
    console.log(apiKey);
    console.log("stringified");
    console.log(`${apiKey}`);

    await this.apiKeyInput.type(`${apiKey}`);
    await this.nextButton.scrollIntoViewIfNeeded();
    await this.nextButton.click();

    await this.requiredSettingsSpinner.waitFor({ state: "visible", timeout: 5000 });
    await this.requiredSettingsSpinner.waitFor({ state: "hidden", timeout: 15000 });

    await this.waitForPageLoad(page);

    if (await this.configuredCheckMark.isVisible()) {
      await expect(this.clientKeyInput).toHaveValue(clientKey);
      await this.merchantAccountDropdown.selectOption(merchantAccount);

      await expect(this.configuredCheckMark).toBeVisible();
      await this.nextButton.scrollIntoViewIfNeeded();
      await this.nextButton.click();

      await expect(this.webhookUsernameInput).toHaveValue(webhookUsername);
      await expect(this.webhookPasswordInput).not.toBeEmpty();

      await expect(this.configuredCheckMark).toBeVisible();
      await this.saveConfigButton.scrollIntoViewIfNeeded();
      await this.saveConfigButton.click();
    }
  }



}


import { expect } from "@playwright/test";
import { AdminPanelPage } from "./AdminPanel.page.js";
import PaymentResources from "../../../data/PaymentResources.js";

const paymentResources = new PaymentResources();

export class AdminAdyenConfigPage extends AdminPanelPage {
  constructor(page) {
    super(page);
    this.page = page;

    //Configuration > Required Settings
    this.adyenInitialSetupLink = page.locator("#payment_us_adyen_group_all_in_one_adyen_initial_setup-head");
    this.adyenInitialSetupGroup = page.locator("#payment_us_adyen_group_all_in_one_adyen_initial_setup");

    this.confirgurationModeDropdown = this.adyenInitialSetupGroup.locator("select[name*=configuration_mode]");
    this.environmentDropdown = this.adyenInitialSetupGroup.locator("select[name*=demo_mode]");
    this.apiKeyInput = this.adyenInitialSetupGroup.locator("input[name*=api_key_test]");
    this.clientKeyInput = this.adyenInitialSetupGroup.locator("input[name*=client_key_test]");
    this.merchantAccountDropdown = this.adyenInitialSetupGroup.locator("select[name*=merchant_account_auto]");
    this.webhookUsernameInput = this.adyenInitialSetupGroup.locator("input[name*=notification_username]");
    this.webhookPasswordInput = this.adyenInitialSetupGroup.locator("input[name*=notification_password]");
    this.nextButton = this.adyenInitialSetupGroup.locator("#adyen_configuration_action");
    this.reconfigureButton = this.adyenInitialSetupGroup.locator("#adyen_configuration_action_reset");
    this.configuredCheckMark = this.adyenInitialSetupGroup.locator(".configured");
    this.generateNewWebhookCredentialsRadioButton = this.adyenInitialSetupGroup.locator
    ("label[for=payment_us_adyen_group_all_in_one_adyen_initial_setup_create_new_webhook1]");

    this.requiredSettingsWarningMessage = this.adyenInitialSetupGroup.locator(".message.message-warning");
    this.requiredSettingsSpinner = this.adyenInitialSetupGroup.locator("img.processing");


    //Configuration > Payment Methods > Adyen Payments

    this.adyenPaymentsSection = page.locator(".section-config.adyen-payments");
    this.adyenPaymentsConfigButton = this.adyenPaymentsSection.locator(".button.action-configure");

      //Configuration > Payment Methods > Adyen Payments > Accepting Payments
      this.acceptingPaymentsSection = this.adyenPaymentsSection.locator("//tr[contains(@id,'adyen_accepting_payments')]").first();
        this.paymentMethodsSection = this.acceptingPaymentsSection.getByRole('link', { name: 'Payment methods' });
          this.cardPaymentsSection = this.acceptingPaymentsSection.locator("//tr[contains(@id,'adyen_card_payments')]").first();
            this.enableInstallments = this.cardPaymentsSection.locator("//select[contains(@id,'enable_installments')]").first();
              this.installmentsTable = this.cardPaymentsSection.locator("//tr[contains(@id,'adyen_card_payments_installments')]").first()
                this.addInstallementsRule = this.installmentsTable.getByRole('button', { name: 'Add Rule' }).last();
                this.installmentsAmount = this.installmentsTable.locator("//input[contains(@id,'amount')]").last();
                this.numberOfInstallments = this.installmentsTable.locator("//select[contains(@id, 'installments')]").last();
                this.installmentsCCTypes = this.installmentsTable.locator("//select[contains(@name,'cc_types')]").last();
        this.adminOrdersLink = this.acceptingPaymentsSection.getByRole('link', { name: 'Admin Orders' });
          this.adminOrdersSection = this.acceptingPaymentsSection.locator("//tr[contains(@id,'adyen_admin_orders')]").first();
            this.adyenMOTODropdown = this.adminOrdersSection.locator("//select[contains(@id,'adyen_moto_active')]");

    //Configuration > Payment Methods > AdyenMOTO
    this.adyenMOTOAccountSettingsGroup = this.adminOrdersSection.locator("//table[contains(@id,'adyen_moto_accounts')]");
    this.adyenMOTOStatusDropdown = this.adyenMOTOAccountSettingsGroup.locator("//*[contains(@id,'_adyen_group_all_in_one_adyen_accepting_payments_adyen_admin_orders_adyen_moto_active')]");

    this.adyenMOTOAccountAddButton = this.adyenMOTOAccountSettingsGroup.getByRole('button', { name: 'Add' });
    this.adyenMOTOCredentialsFirstTable = this.adyenMOTOAccountSettingsGroup.locator("tbody tr").first();

    this.adyenMOTOMerhcantAccountInputField = this.adyenMOTOCredentialsFirstTable.locator("//input[contains(@id,'_merchant_account')]");
    this.adyenMOTOClientKeyInputField = this.adyenMOTOCredentialsFirstTable.locator("//input[contains(@id,'_client_key')]");
    this.adyenMOTOApiKeyInputField = this.adyenMOTOCredentialsFirstTable.locator("//input[contains(@id,'_api_key')]");
    this.adyenMOTOModeSelector = this.adyenMOTOCredentialsFirstTable.locator("select");
  }

  async revealAdyenSettings(){
    await this.adyenPaymentsConfigButton.click();
  }

  async enableMOTO(page, adyenMOTOMerchantAccount, adyenMOTOClientKey, adyenMOTOApiKey) {
    await this.revealAdyenSettings();
    await this.acceptingPaymentsSection.click();
    await this.adminOrdersLink.click();

    await this.adyenMOTODropdown.selectOption("Yes");
    if(!await this.adyenMOTOCredentialsFirstTable.isVisible()){
      await this.adyenMOTOAccountAddButton.click();
    }

    await this.adyenMOTOMerhcantAccountInputField.fill("");
    await this.adyenMOTOMerhcantAccountInputField.type(adyenMOTOMerchantAccount);
    await this.adyenMOTOClientKeyInputField.fill("");
    await this.adyenMOTOClientKeyInputField.type(adyenMOTOClientKey);
    await this.adyenMOTOApiKeyInputField.fill("");
    await this.adyenMOTOApiKeyInputField.type(adyenMOTOApiKey);

    await this.adyenMOTOModeSelector.selectOption("1");
    await this.saveConfigButton.click();

    await this.waitForPageLoad(page);

  }

  async autoConfigureRequiredSettings(page, apiKey, clientKey, merchantAccount, webhookUsername) {
    await this.waitForPageLoad(page);
    await this.revealAdyenSettings();

    await this.adyenInitialSetupLink.click();
    await this.confirgurationModeDropdown.selectOption("auto");
    await this.environmentDropdown.selectOption("1");

    await this.waitForPageLoad(page);
    if (await this.reconfigureButton.isVisible()) {
      page.on('dialog', dialog => dialog.accept());
      await this.reconfigureButton.scrollIntoViewIfNeeded();
      await this.reconfigureButton.click();
    }

    await this.apiKeyInput.fill("");
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
      await this.generateNewWebhookCredentialsRadioButton.click();

      await this.webhookUsernameInput.fill("");
      await this.webhookUsernameInput.type(webhookUsername);

      await this.webhookPasswordInput.fill("");
      await this.webhookPasswordInput.type(webhookUsername);

      await expect(this.configuredCheckMark).toBeVisible();
      await this.saveConfigButton.scrollIntoViewIfNeeded();
      await this.saveConfigButton.click();
    }
  }

  async manualConfigureRequiredSettings(page, clientKey, webhookUsername, webhookPassword ) {
    await this.waitForPageLoad(page);
    await this.revealAdyenSettings();

    await this.adyenInitialSetupLink.click();
    await this.confirgurationModeDropdown.selectOption("manual");
    await this.environmentDropdown.selectOption("1");

    await this.waitForPageLoad(page);
    
    await expect(this.clientKeyInput).toHaveValue(clientKey);

    await this.webhookUsernameInput.scrollIntoViewIfNeeded();
    await this.webhookUsernameInput.click();
    await this.webhookUsernameInput.fill("");
    await this.webhookUsernameInput.type(webhookUsername); 

    await this.webhookPasswordInput.scrollIntoViewIfNeeded();
    await this.webhookPasswordInput.click();
    await this.webhookPasswordInput.fill(""); 
    await this.webhookPasswordInput.type(webhookPassword); 

    await expect(this.webhookPasswordInput).not.toBeEmpty()


    await this.saveConfigButton.scrollIntoViewIfNeeded();
    await this.saveConfigButton.click();
  }

  async configureInstallments(page) {
    await this.waitForPageLoad(page);
    await this.revealAdyenSettings();

    await this.acceptingPaymentsSection.click();
    await this.paymentMethodsSection.click();
    await this.cardPaymentsSection.click();
    await this.enableInstallments.selectOption("1");

    await this.installmentsTable.waitFor({ state: "visible", timeout: 5000 });
    await this.addInstallementsRule.click();
    await this.installmentsAmount.click();
    await this.installmentsAmount.type(paymentResources.installmentsDefaults.amount);
    await this.numberOfInstallments.selectOption(paymentResources.installmentsDefaults.count);
    await this.installmentsCCTypes.selectOption(paymentResources.installmentsDefaults.ccType);

    await this.saveConfigButton.scrollIntoViewIfNeeded();
    await this.saveConfigButton.click();
  }
}

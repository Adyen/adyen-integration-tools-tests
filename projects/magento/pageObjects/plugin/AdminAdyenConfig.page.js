
import { AdminPanelPage } from "./AdminPanel.page.js";
export class AdminAdyenConfigPage extends AdminPanelPage {
  constructor(page) {
    super(page);
    this.page = page;

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
    await this.waitForPageLoad(page);
    await this.goToAdyenPluginConfigurationPage(page);

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
}

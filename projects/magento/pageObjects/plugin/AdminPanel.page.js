import { CreditCardComponents } from "../checkout/CreditCardComponents.js";
export class AdminPanelPage {
  constructor(page) {
    this.page = page;

    //General Buttons
    this.saveConfigButton = page.locator("#save");

    //Messages
    this.successMessage = page.locator("#messages .message-success");
    this.errorMessage = page.locator("#order-message .message-error")

    // Sidebar locators
    this.salesLink = page.locator("#menu-magento-sales-sales");
    this.storesLink = page.locator("#menu-magento-backend-stores");

    // Sales menu locators
    this.salesSideMenu = page.locator(".item-sales-operation");
    this.orderLink = this.salesSideMenu.locator("//span[text()='Orders']");

    // Stores menu locators
    this.storesSettingsSection = page.locator(".item-stores-settings");
    this.configurationLink = this.storesSettingsSection.locator("//span[text()='Configuration']");

    //Configuration Section
    this.configurationMenuWrapper = page.locator("#system_config_tabs");
    this.salesConfigLink = this.configurationMenuWrapper.locator("//strong[text()='Sales']")

    //Configuration > Sales Subsection
    this.salesConfigMenu = this.salesConfigLink.locator("..").locator("..");
    this.paymentMethodsLink = this.salesConfigMenu.locator("//span[text()='Payment Methods']");

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

    // Sales > Orders Section
    this.createNewOrderButton = page.locator("#add");
    this.testUserNameSelector = page.locator(
      "//td[@data-column='name' and contains(text(),'Veronica Costello')]"
    );
    this.addProductsButton = page.locator("#add_products");
    this.thirdProductPriceSelector = page.locator(".col-price").nth(3);
    this.addProductsToOrderButton = page.locator(
      "button[title='Add Selected Product(s) to Order']"
    );
    this.shippingMethodCalculateLink = page
      .locator(".order-shipping-method a")
      .nth(0);
    this.shippingMethodSelector = page.locator("#s_method_flatrate_flatrate");

    this.payByLinkSelector = page.locator("#p_method_adyen_pay_by_link");
    this.motoSelector = page.locator("#p_method_adyen_moto");
    this.motoMerchantAccountDropdown = page.locator("#adyen_moto_merchant_accounts");

    this.submitOrderButton = page.locator("#submit_order_top_button");
    this.paymentLink = page.locator("a[rel='noopener']");
  }

  async goToOrdersPage() {
    await this.salesLink.click();
    await this.orderLink.click();
  }

  async waitForAdminPanelAnimation(page) {
    const loadingLayer = page.locator(".loading-mask");
    await loadingLayer.waitFor({ state: "visible", timeout: 15000 });
    await loadingLayer.waitFor({ state: "hidden", timeout: 15000 });
  }

  async waitForPageLoad(page) {
    await page.waitForLoadState("domcontentloaded", { timeout: 10000 });
    await page.waitForLoadState("networkidle", { timeout: 10000 });
  }

  async goToAdyenPluginConfigurationPage(page) {
    await this.storesLink.click();
    await this.configurationLink.click();
    await this.waitForPageLoad(page);
    await this.salesConfigLink.click();
    await this.paymentMethodsLink.click();
    await this.waitForPageLoad(page);
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

  async createOrder(page) {
    await this.waitForPageLoad(page);
    await this.goToOrdersPage();
    await this.waitForPageLoad(page);
    await this.createNewOrderButton.click();
    await this.waitForPageLoad(page);
    await this.testUserNameSelector.click();
    await this.waitForPageLoad(page);
    await this.addProductsButton.click();
    await this.thirdProductPriceSelector.click();
    await this.addProductsToOrderButton.click();
    await this.waitForAdminPanelAnimation(page);
    await this.shippingMethodCalculateLink.click();
    await this.waitForAdminPanelAnimation(page);
    await this.shippingMethodSelector.click();
    await this.waitForAdminPanelAnimation(page);
  }

  async createOrderPayBylink(page) {
    await this.createOrder(page);
    await this.payByLinkSelector.click();
    await this.waitForAdminPanelAnimation(page);
    await this.submitOrderButton.click();
    await this.waitForPageLoad(page);

    const linkToPayment = await this.paymentLink.getAttribute("href");
    return linkToPayment;
  }

  async createOrderMoto(page, cardNumber, cardExpirationDate, merchantAccount = undefined) {
    await this.createOrder(page);
    await this.motoSelector.click();
    await this.waitForAdminPanelAnimation(page);

    merchantAccount != undefined ?
      await this.motoMerchantAccountDropdown.selectOption({ value: `${merchantAccount}` }) :
      await this.motoMerchantAccountDropdown.selectOption({ index: 1 });

    await this.waitForAdminPanelAnimation(page);

    const ccSection = new CreditCardComponents(page);
    await ccSection.fillHolderName("John Doe");
    await ccSection.fillCardNumber(cardNumber);
    await ccSection.fillExpDate(cardExpirationDate);

    await this.submitOrderButton.click();
    await this.waitForPageLoad(page);
  }
}

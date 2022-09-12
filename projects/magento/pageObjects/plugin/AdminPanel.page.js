export class AdminPanelPage {
  constructor(page) {
    this.page = page;

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
    this.submitOrderButton = page.locator("#submit_order_top_button");
    this.paymentLink = page.locator("a[rel='noopener']");

    // Sidebar locators
    this.salesLink = page.locator("#menu-magento-sales-sales");
    this.salesSideMenu = page.locator(".item-sales-operation");
    this.storesLink = page.locator("#menu-magento-backend-stores");
    this.configurationSettingsLink = this.storesLink.locator(".item-system-config", { has: page.locator("//span[text()='Configuration']") });

    this.orderLink = this.salesSideMenu.locator("//span[text()='Orders']")
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

  async goToConfiguration () {
    await this.storesLink.click();
    await this.configurationSettingsLink.click();
  }

  async goToPluginConfiguration(page) {
    await this.waitForPageLoad(page);
    await this.goToConfiguration();
    await this.waitForPageLoad(page);
    const configNavigation = page.locator("#system_config_tabs");
    await configNavigation.locator(".config-nav-block", { has: page.locator("//strong[text()='Sales']") }).scrollIntoViewIfNeeded();
    await configNavigation.locator(".config-nav-block", { has: page.locator("//strong[text()='Sales']") }).click();
    await configNavigation.locator(".admin__page-nav-item", { has: page.locator("//span[text()='Payment Methods']") }).click();
  }

  async createOrderPayBylink(page) {
    await this.waitForPageLoad(page);
    await this.goToOrdersPage(page);
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
    await this.payByLinkSelector.click();
    await this.waitForAdminPanelAnimation(page);
    await this.submitOrderButton.click();
    await this.waitForPageLoad(page);

    const linkToPayment = await this.paymentLink.getAttribute("href");
    return linkToPayment;
  }

  async autoConfigureRequiredSettings(page) {
    await this.goToPluginConfiguration(page);
    await this.waitForPageLoad(page);

  }
}

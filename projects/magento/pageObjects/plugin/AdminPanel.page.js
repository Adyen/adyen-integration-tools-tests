export class AdminPanelPage {
  constructor(page) {
    this.page = page;

    //Security Patch Message Selectors
    this.securityMessageHeader = page.locator("//*[contains(@class, 'modal-title') and contains(text(),'Incoming Message')]/..");
    this.securityMessageCloseButton = this.securityMessageHeader.locator(".action-close")

    //Adobe Data collection popup button
    this.usageStatsTrackerPopupCloser = page.locator(".modal-footer .action-secondary")

    //General Buttons
    this.saveConfigButton = page.locator("#save");

    //Messages
    this.successMessage = page.locator("#messages .message-success");
    this.errorMessage = page.locator("#messages .message-error");
    this.orderErrorMessage = page.locator("#order-message .message-error")

    // Sidebar locators
    this.salesLink = page.locator("#menu-magento-sales-sales");
    this.storesLink = page.locator("#menu-magento-backend-stores");

    // Sidebar > Sales Submenu locators
    this.salesSideMenu = page.locator(".item-sales-operation");
    this.orderLink = this.salesSideMenu.locator("//span[text()='Orders']");

    // Sidebar > Stores Submenu locators
    this.storesSettingsSection = page.locator(".item-stores-settings");
    this.configurationLink = this.storesSettingsSection.locator("//span[text()='Configuration']");

    //Configuration Screen Section
    this.configurationMenuWrapper = page.locator("#system_config_tabs");

    //Configuration Screen > Menu Links
    this.generalConfigLink = this.configurationMenuWrapper.locator("//strong[text()='General']");
    this.salesConfigLink = this.configurationMenuWrapper.locator("//strong[text()='Sales']");

    //Configuration Screen > General Subsection
    this.generalConfigMenu = this.generalConfigLink.locator("..").locator("..");
    this.generalConfigMenuLinkWrapper = this.generalConfigMenu.locator("ul").first();

    //Configuration Screen > Sales Subsection
    this.salesConfigMenu = this.salesConfigLink.locator("..").locator("..");
    this.paymentMethodsLink = this.salesConfigMenu.locator("//span[text()='Payment Methods']");
  }

  async closePopup() {
    await this.waitForPageLoad(this.page);
    if (await this.securityMessageHeader.isVisible()) {
      await this.securityMessageCloseButton.click();
    }
    if (await this.usageStatsTrackerPopupCloser.isVisible()) {
      await this.usageStatsTrackerPopupCloser.click();
    }
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

  async goToOrdersPage() {
    await this.salesLink.click();
    await this.orderLink.click();
  }

  async goToAdyenPluginConfigurationPage(page) {
    await this.waitForPageLoad(page);
    await this.storesLink.click();
    await this.configurationLink.click();
    await this.waitForPageLoad(page);
    await this.generalConfigMenuLinkWrapper.waitFor({ state: "visible", timeout: 2000 });
    await this.salesConfigLink.click();
    await this.paymentMethodsLink.click();
    await this.waitForPageLoad(page);
  }
}

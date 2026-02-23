export class HomePageMagento {
  constructor(page) {
    this.page = page;
    this.currencySwitcher = page.locator("#switcher-currency-trigger")
  }

  async selectCurrencyCode(currencyCode) {
    const currentCurrency = await this.currencySwitcher.locator("span").innerText();
    if (currentCurrency.includes(currencyCode)) {
      return;
    }
    await this.currencySwitcher.click();
    await this.page.locator(`li.currency-${currencyCode} a`).first().click();
  }
}

export class HomePageMagento {
  constructor(page) {
    this.page = page;
    this.currencySwitcher = page.locator("#switcher-currency-trigger")
  }

  async selectCurrencyCode(currencyCode) {
    await this.currencySwitcher.waitFor({ state: "visible" });
    const currentCurrency = await this.currencySwitcher.locator("span").innerText();
    if (currentCurrency.includes(currencyCode)) {
      return;
    }
    await this.currencySwitcher.click();
    const currencyLink = this.page.locator(`li.currency-${currencyCode} a`).first();
    await currencyLink.waitFor({ state: "visible" });
    await currencyLink.click();
  }
}

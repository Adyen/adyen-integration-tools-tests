export class HomePageMagento {
  constructor(page) {
    this.page = page;
    this.currencySwitcher = page.locator("#switcher-currency-trigger")
  }

  async selectCurrencyCode(currencyCode) {
    await this.page.waitForLoadState("networkidle");
    await this.currencySwitcher.waitFor({ state: "visible", timeout: 10000 });
    const currentCurrency = await this.currencySwitcher.locator("span").innerText();
    if (currentCurrency.includes(currencyCode)) {
      return;
    }
    const currencyLink = this.page.locator(`li.currency-${currencyCode} a`).first();
    await this.currencySwitcher.click();
    await currencyLink.waitFor({ state: "visible", timeout: 5000 }).catch(async () => {
      // Retry if dropdown didn't open on first click
      await this.currencySwitcher.click();
      await currencyLink.waitFor({ state: "visible", timeout: 5000 });
    });
    await currencyLink.click();
    await this.page.waitForLoadState("load");
  }
}

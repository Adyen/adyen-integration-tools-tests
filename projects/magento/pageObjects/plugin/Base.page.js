import { TopBar } from "./TopBar.page.js";

export class BasePage extends TopBar {
  constructor(page) {
    super(page);
    this.page = page;
    this.storeLogo = page.locator(".logo img");
    this.searchInput = page.locator(".control #search");
    this.cartIcon = page.locator(".showcart");
    this.cartItemCount = page.locator(".qty .counter-number");
    this.shoppingCartLoaderMask = page.locator(".showcart .loading-mask");
  }

  async currentCartItemCount() {
    await this.shoppingCartLoaderMask.waitFor({
      state: "detached",
      timeout: 10000,
    });
    return this.cartItemCount.innerText();
  }
}

import { TopBar } from "./TopBar.page.js";

export class BasePage extends TopBar {
  constructor(page) {
    super(page);
    this.page = page;
    this.storeLogo = page.locator(".logo img");
    this.searchInput = page.locator(".control #search");
    this.cartIcon = page.locator(".showcart");
    this.cartItemCount = page.locator(".qty .counter-number");
    this.cartItemLoadingAnimation = page.locator("._block-content-loading");
    this.loadingLayer = page.locator("[aria-busy='true']");
  }

  get currentCartItemCount() {
    return this.cartItemCount.innerText();
  }
}

import { Page } from "@playwright/test";

export class BasePage {
  constructor(page) {
    this.page = page;
  }

  get storeLogo() {
    return this.locator(".logo img");
  }

  get searchInput() {
    return this.locator(".control #search");
  }

  get cartIcon() {
    return this.locator(".showcart");
  }
}

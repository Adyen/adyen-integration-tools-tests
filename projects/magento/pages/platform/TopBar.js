import { Page } from "@playwright/test";

export class TopBar {
  constructor(page) {
    this.page = page;
  }

  get signInLink() {
    return this.locator(".link.authorization-link > a");
  }

  get createAccountLink() {
    return this.locator("text=Create an Account");
  }
}

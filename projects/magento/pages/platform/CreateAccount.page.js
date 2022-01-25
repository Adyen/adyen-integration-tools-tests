import { Page } from "@playwright/test";
import { BasePage } from "./Base.page";

export class CreateAccountPage extends BasePage {
  constructor(page) {
    this.page = page;
  }

  get firstNameInput() {
    return this.locator("input[name='firstname']");
  }

  get lastNameInput() {
    return this.locator("input[name='lastname']");
  }

  get emailAddressInput() {
    return this.locator("input[name='email']");
  }

  get passwordInput() {
    return this.locator("input[name='password']");
  }

  get passwordConfirmInput() {
    return this.locator("input[name='password_confirmation']");
  }

  get createAnAccountButton() {
    return this.locator("button[title='Create an Account']");
  }
}

import { BasePage } from "./Base.page";

export class CreateAccountPage extends BasePage {
  constructor(page) {
    this.page = page;
    this.firstNameInput = page.locator("input[name='firstname']");
    this.lastNameInput = page.locator("input[name='lastname']");
    this.emailAddressInput = page.locator("input[name='email']");
    this.passwordInput = page.locator("input[name='password']");
    this.passwordConfirmInput = page.locator(
      "input[name='password_confirmation']"
    );
    this.createAnAccountButton = page.locator(
      "button[title='Create an Account']"
    );
  }
}

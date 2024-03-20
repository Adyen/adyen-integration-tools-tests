export class TopBar {
  constructor(page) {
    this.page = page;
    this.signInLink = page.locator(".link.authorization-link > a");
    this.createAccountLink = page.locator("text=Create an Account");
  }
}

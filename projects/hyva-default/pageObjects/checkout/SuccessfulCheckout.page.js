export class SuccessfulCheckoutPage {
  constructor(page) {
    this.page = page;
    this.pageTitle = page.locator("span[data-ui-id='page-title-wrapper']");
  }

  async waitForRedirection(timeout = 15000) {
    await this.page.waitForNavigation({
      url: / *\/onepage\/success/,
      timeout: timeout,
    });
  }
}

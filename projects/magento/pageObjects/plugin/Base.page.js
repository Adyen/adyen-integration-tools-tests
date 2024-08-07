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

    this.miniCartWrapper = page.locator(".block-minicart");
    this.buyWithGoogleViaCartButton = this.miniCartWrapper.locator(".adyen-checkout__paywithgoogle");
    this.buyWithGoogleViaCartButtonAnimation = this.miniCartWrapper.locator(".gpay-card-info-animated-progress-bar");
  }

  async currentCartItemCount() {
    await this.shoppingCartLoaderMask.waitFor({
      state: "detached",
      timeout: 10000,
    });
    return this.cartItemCount.innerText();
  }

  async clickbuyWithGPayViaMiniCart(){
    await this.shoppingCartLoaderMask.waitFor({
      state: "detached",
      timeout: 10000,
    });
    await this.cartIcon.click();

    await (this.buyWithGoogleViaCartButtonAnimation).waitFor({state: "visible"});
    await (this.buyWithGoogleViaCartButton).waitFor({state: "visible"});
    await this.page.waitForLoadState("networkidle", { timeout: 10000 });
    await this.buyWithGoogleViaCartButton.click();
  }

  async waitForRedirection(timeout = 15000) {
    await this.page.waitForURL(/ *\/onepage\/success/,
        {
          timeout: timeout,
          waitUntil:"load"
        });
  }

  async waitForRedirectionOrManuallyNavigate(timeout)
  {
    let attemptedUrl = '';

    // Listen for responses to capture redirect status
    this.page.on('response', response => {
      const status = response.status();
      if (status >= 300 && status < 400) {
        attemptedUrl = response.headers()['location'];
      }
    });

    try{
      await this.waitForRedirection(timeout);
    } catch (e) {
      await this.page.goto(attemptedUrl);
    }
  }
}
